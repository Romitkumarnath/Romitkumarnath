#!/usr/bin/env node

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import MeetMonitor from './meetMonitor.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Display banner
function displayBanner() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║          🎤 Google Meet Tone Monitor v1.0.0              ║
║                                                           ║
║     Monitor meeting tone and detect rule violations       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

// Validate configuration
function validateConfig() {
  const required = ['MEET_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n📝 Please create a .env file based on .env.example');
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    meetUrl: process.env.MEET_URL,
    email: process.env.GOOGLE_EMAIL,
    password: process.env.GOOGLE_PASSWORD,
    checkInterval: parseInt(process.env.CHECK_INTERVAL_MS) || 2000,
    enableSound: process.env.ENABLE_SOUND !== 'false',
    enableDesktop: process.env.ENABLE_DESKTOP_NOTIFICATIONS !== 'false',
    enableConsole: process.env.ENABLE_CONSOLE_LOGS !== 'false',
    headless: false
  };

  // Parse command-line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
      case '-u':
        options.meetUrl = args[++i];
        break;
      case '--headless':
      case '-h':
        options.headless = true;
        break;
      case '--no-sound':
        options.enableSound = false;
        break;
      case '--no-desktop':
        options.enableDesktop = false;
        break;
      case '--interval':
      case '-i':
        options.checkInterval = parseInt(args[++i]);
        break;
      case '--help':
        displayHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

// Display help
function displayHelp() {
  console.log(`
Usage: npm start [options]

Options:
  -u, --url <url>        Google Meet URL (or set MEET_URL in .env)
  -h, --headless         Run browser in headless mode
  --no-sound             Disable sound alerts
  --no-desktop           Disable desktop notifications
  -i, --interval <ms>    Check interval in milliseconds (default: 2000)
  --help                 Display this help message

Environment Variables (set in .env file):
  MEET_URL               Google Meet URL to join
  GOOGLE_EMAIL           Your Google account email (optional)
  GOOGLE_PASSWORD        Your Google account password (optional)
  CHECK_INTERVAL_MS      Caption check interval (default: 2000)
  ENABLE_SOUND           Enable sound alerts (default: true)
  ENABLE_DESKTOP_NOTIFICATIONS  Enable desktop notifications (default: true)
  ENABLE_CONSOLE_LOGS    Enable console logging (default: true)

Examples:
  npm start
  npm start -- --url https://meet.google.com/abc-defg-hij
  npm start -- --headless --no-sound

For more information, visit: https://github.com/Romitkumarnath/Romitkumarnath
  `);
}

// Main function
async function main() {
  displayBanner();

  // Validate configuration
  validateConfig();

  // Parse arguments
  const options = parseArgs();

  console.log('📋 Configuration:');
  console.log(`   Meeting URL: ${options.meetUrl}`);
  console.log(`   Check Interval: ${options.checkInterval}ms`);
  console.log(`   Headless Mode: ${options.headless ? 'Yes' : 'No'}`);
  console.log(`   Sound Alerts: ${options.enableSound ? 'Yes' : 'No'}`);
  console.log(`   Desktop Notifications: ${options.enableDesktop ? 'Yes' : 'No'}`);
  console.log('');

  // Create monitor instance
  const monitor = new MeetMonitor(options);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    await monitor.stopMonitoring();
    await monitor.cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    await monitor.stopMonitoring();
    await monitor.cleanup();
    process.exit(0);
  });

  // Start monitoring
  try {
    await monitor.run();
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    await monitor.cleanup();
    process.exit(1);
  }
}

// Run main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
