import notifier from 'node-notifier';
import chalk from 'chalk';

class Notifier {
  constructor(options = {}) {
    this.enableSound = options.enableSound !== false;
    this.enableDesktop = options.enableDesktop !== false;
    this.enableConsole = options.enableConsole !== false;
  }

  /**
   * Send a violation alert
   * @param {Object} analysis - Analysis result from ToneAnalyzer
   */
  alert(analysis) {
    const message = analysis.alertMessage || '⚠️ Rules of engagement may be violated';
    const speaker = analysis.speaker || 'Unknown';

    // Console notification
    if (this.enableConsole) {
      console.log('\n' + '='.repeat(80));
      console.log(chalk.red.bold(message));
      console.log(chalk.yellow(`Speaker: ${speaker}`));
      console.log(chalk.yellow(`Text: "${analysis.text}"`));
      console.log(chalk.yellow(`Violations: ${analysis.violations.join(', ')}`));
      console.log(chalk.yellow(`Sentiment Score: ${analysis.scores.sentiment}`));
      console.log(chalk.yellow(`Time: ${new Date(analysis.timestamp).toLocaleTimeString()}`));
      console.log('='.repeat(80) + '\n');
    }

    // Desktop notification
    if (this.enableDesktop) {
      notifier.notify({
        title: '🚨 Meeting Tone Alert',
        message: `${speaker}: ${message}`,
        sound: this.enableSound,
        wait: false,
        timeout: 10
      });
    }

    // Beep sound in terminal
    if (this.enableSound) {
      process.stdout.write('\x07'); // Bell character
    }
  }

  /**
   * Log information message
   * @param {string} message - Message to log
   */
  info(message) {
    if (this.enableConsole) {
      console.log(chalk.blue('ℹ'), message);
    }
  }

  /**
   * Log success message
   * @param {string} message - Message to log
   */
  success(message) {
    if (this.enableConsole) {
      console.log(chalk.green('✓'), message);
    }
  }

  /**
   * Log warning message
   * @param {string} message - Message to log
   */
  warning(message) {
    if (this.enableConsole) {
      console.log(chalk.yellow('⚠'), message);
    }
  }

  /**
   * Log error message
   * @param {string} message - Message to log
   */
  error(message) {
    if (this.enableConsole) {
      console.log(chalk.red('✗'), message);
    }
  }

  /**
   * Display rules of engagement
   * @param {Object} rules - Rules object
   */
  displayRules(rules) {
    if (this.enableConsole) {
      console.log(chalk.cyan.bold(`\n${rules.title}`));
      console.log(chalk.cyan('─'.repeat(rules.title.length)));
      rules.rules.forEach((rule, index) => {
        console.log(chalk.cyan(`${index + 1}. ${rule}`));
      });
      console.log('');
    }
  }

  /**
   * Display monitoring status
   * @param {string} meetUrl - Meeting URL
   */
  displayStatus(meetUrl) {
    if (this.enableConsole) {
      console.log(chalk.green.bold('\n🎤 Tone Monitor Active'));
      console.log(chalk.green(`Meeting: ${meetUrl}`));
      console.log(chalk.green('Monitoring for tone violations...\n'));
    }
  }
}

export default Notifier;
