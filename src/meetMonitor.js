import puppeteer from 'puppeteer';
import ToneAnalyzer from './toneAnalyzer.js';
import Notifier from './notifier.js';

class MeetMonitor {
  constructor(options = {}) {
    this.meetUrl = options.meetUrl;
    this.email = options.email;
    this.password = options.password;
    this.checkInterval = options.checkInterval || 2000;
    this.headless = options.headless !== undefined ? options.headless : false;

    this.browser = null;
    this.page = null;
    this.isMonitoring = false;

    this.analyzer = new ToneAnalyzer();
    this.notifier = new Notifier({
      enableSound: options.enableSound,
      enableDesktop: options.enableDesktop,
      enableConsole: options.enableConsole
    });

    this.captionHistory = new Set();
    this.lastProcessedCaption = '';
  }

  /**
   * Helper function to wait/sleep for specified milliseconds
   * Replaces deprecated page.waitForTimeout()
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Initialize browser and page
   */
  async initialize() {
    try {
      this.notifier.info('Launching browser...');

      this.browser = await puppeteer.launch({
        headless: this.headless,
        args: [
          '--use-fake-ui-for-media-stream',
          '--use-fake-device-for-media-stream',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        defaultViewport: {
          width: 1280,
          height: 720
        }
      });

      this.page = await this.browser.newPage();

      // Set user agent
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Grant permissions
      const context = this.browser.defaultBrowserContext();
      await context.overridePermissions(this.meetUrl, [
        'microphone',
        'camera',
        'notifications'
      ]);

      this.notifier.success('Browser initialized');
      return true;
    } catch (error) {
      this.notifier.error(`Failed to initialize browser: ${error.message}`);
      throw error;
    }
  }

  /**
   * Join Google Meet
   */
  async joinMeet() {
    try {
      this.notifier.info(`Navigating to ${this.meetUrl}...`);

      await this.page.goto(this.meetUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Wait a bit for page to load
      await this.sleep(3000);

      // Try to turn off camera and microphone before joining
      try {
        // Turn off camera
        const cameraButton = await this.page.$('[data-is-muted="false"][aria-label*="camera"]');
        if (cameraButton) {
          await cameraButton.click();
          await this.sleep(500);
        }
      } catch (e) {
        this.notifier.warning('Could not toggle camera');
      }

      try {
        // Turn off microphone
        const micButton = await this.page.$('[data-is-muted="false"][aria-label*="microphone"]');
        if (micButton) {
          await micButton.click();
          await this.sleep(500);
        }
      } catch (e) {
        this.notifier.warning('Could not toggle microphone');
      }

      // Click "Join now" or "Ask to join" button
      const joinSelectors = [
        '[jsname="Qx7uuf"]', // Join button
        'button[jsname="Qx7uuf"]',
        'div[role="button"]:has-text("Join")',
        'div[role="button"]:has-text("Ask to join")',
        'span:has-text("Join now")',
        'span:has-text("Ask to join")'
      ];

      let joined = false;
      for (const selector of joinSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          await this.page.click(selector);
          joined = true;
          this.notifier.success('Clicked join button');
          break;
        } catch (e) {
          continue;
        }
      }

      if (!joined) {
        this.notifier.warning('Could not find join button, but continuing...');
      }

      // Wait for meeting to load
      await this.sleep(5000);

      // Enable captions for monitoring
      await this.enableCaptions();

      this.notifier.success('Successfully joined meeting');
      return true;
    } catch (error) {
      this.notifier.error(`Failed to join meeting: ${error.message}`);
      throw error;
    }
  }

  /**
   * Enable live captions in Google Meet
   */
  async enableCaptions() {
    try {
      this.notifier.info('Enabling live captions...');

      // Look for captions button
      const captionSelectors = [
        '[aria-label*="captions"]',
        '[aria-label*="Turn on captions"]',
        'button[aria-label*="captions"]',
        '[jsname="r8qRAd"]'
      ];

      for (const selector of captionSelectors) {
        try {
          const button = await this.page.$(selector);
          if (button) {
            const ariaPressed = await button.evaluate(el => el.getAttribute('aria-pressed'));
            if (ariaPressed !== 'true') {
              await button.click();
              await this.sleep(1000);
              this.notifier.success('Captions enabled');
              return true;
            }
          }
        } catch (e) {
          continue;
        }
      }

      this.notifier.warning('Could not enable captions automatically. Please enable manually.');
      return false;
    } catch (error) {
      this.notifier.warning(`Could not enable captions: ${error.message}`);
      return false;
    }
  }

  /**
   * Start monitoring captions for tone violations
   */
  async startMonitoring() {
    if (this.isMonitoring) {
      this.notifier.warning('Already monitoring');
      return;
    }

    this.isMonitoring = true;
    this.notifier.displayRules(this.analyzer.getRules());
    this.notifier.displayStatus(this.meetUrl);

    // Monitor captions continuously
    while (this.isMonitoring) {
      try {
        await this.checkCaptions();
        await this.sleep(this.checkInterval);
      } catch (error) {
        this.notifier.error(`Monitoring error: ${error.message}`);
        await this.sleep(this.checkInterval);
      }
    }
  }

  /**
   * Check captions for tone violations
   */
  async checkCaptions() {
    try {
      // Look for caption elements
      const captionSelectors = [
        '[jsname="tgaKEf"]', // Main caption container
        '.iOzk7',
        '[class*="caption"]',
        '[aria-live="polite"]'
      ];

      for (const selector of captionSelectors) {
        const captions = await this.page.$$(selector);

        for (const caption of captions) {
          try {
            const text = await caption.evaluate(el => el.textContent?.trim());

            if (text && text.length > 3 && text !== this.lastProcessedCaption) {
              // Get speaker name if available
              let speaker = 'Participant';
              try {
                const speakerElement = await caption.$('[class*="name"]');
                if (speakerElement) {
                  speaker = await speakerElement.evaluate(el => el.textContent?.trim());
                }
              } catch (e) {
                // Speaker name not available
              }

              // Avoid processing the same caption multiple times
              const captionKey = `${speaker}:${text}`;
              if (!this.captionHistory.has(captionKey)) {
                this.captionHistory.add(captionKey);
                this.lastProcessedCaption = text;

                // Analyze tone
                const analysis = this.analyzer.analyze(text, speaker);

                // Log all captions (optional)
                if (analysis.violations.length === 0) {
                  console.log(`[${speaker}]: ${text}`);
                }

                // Alert if violations detected
                if (analysis.shouldAlert) {
                  this.notifier.alert(analysis);
                }

                // Clean up history to prevent memory issues
                if (this.captionHistory.size > 100) {
                  const firstItem = this.captionHistory.values().next().value;
                  this.captionHistory.delete(firstItem);
                }
              }
            }
          } catch (e) {
            continue;
          }
        }
      }
    } catch (error) {
      // Silently continue monitoring
    }
  }

  /**
   * Stop monitoring
   */
  async stopMonitoring() {
    this.isMonitoring = false;
    this.notifier.info('Stopping monitoring...');
  }

  /**
   * Leave the meeting and close browser
   */
  async cleanup() {
    try {
      this.isMonitoring = false;

      if (this.page) {
        await this.page.close();
      }

      if (this.browser) {
        await this.browser.close();
      }

      this.notifier.success('Cleanup completed');
    } catch (error) {
      this.notifier.error(`Cleanup error: ${error.message}`);
    }
  }

  /**
   * Run the complete monitoring session
   */
  async run() {
    try {
      await this.initialize();
      await this.joinMeet();
      await this.startMonitoring();
    } catch (error) {
      this.notifier.error(`Monitor error: ${error.message}`);
      await this.cleanup();
      throw error;
    }
  }
}

export default MeetMonitor;
