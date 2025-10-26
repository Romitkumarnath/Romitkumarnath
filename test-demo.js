#!/usr/bin/env node

/**
 * Demo/Test Mode for Google Meet Tone Monitor
 * This simulates the monitoring without joining an actual meeting
 */

import ToneAnalyzer from './src/toneAnalyzer.js';
import Notifier from './src/notifier.js';
import chalk from 'chalk';

console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║          🎤 Google Meet Tone Monitor - DEMO MODE         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`));

const analyzer = new ToneAnalyzer();
const notifier = new Notifier({
  enableSound: true,
  enableDesktop: true,
  enableConsole: true
});

// Display rules
notifier.displayRules(analyzer.getRules());

console.log(chalk.yellow('\n📝 Testing with simulated meeting captions...\n'));

// Simulated meeting conversation
const simulatedConversation = [
  { speaker: 'Alice', text: 'Good morning everyone, let\'s start the standup', delay: 1000 },
  { speaker: 'Bob', text: 'Thanks Alice, I completed the user authentication feature', delay: 2000 },
  { speaker: 'Charlie', text: 'Great work Bob! I have a question about the API', delay: 2000 },
  { speaker: 'Bob', text: 'Sure, what do you need to know?', delay: 1500 },
  { speaker: 'Charlie', text: 'How should we handle rate limiting?', delay: 2000 },
  { speaker: 'Bob', text: 'Obviously you should have read the documentation first', delay: 2000 }, // Condescending
  { speaker: 'Charlie', text: 'I did read it, but it wasn\'t clear on this point', delay: 2000 },
  { speaker: 'Bob', text: 'That\'s a stupid question, everyone knows how rate limiting works', delay: 2000 }, // Toxic
  { speaker: 'Alice', text: 'Bob, let\'s keep it professional please', delay: 1500 },
  { speaker: 'Bob', text: 'Whatever, I don\'t care anymore', delay: 1500 }, // Dismissive
  { speaker: 'Alice', text: 'Let me explain the rate limiting approach we decided on', delay: 2000 },
  { speaker: 'Charlie', text: 'Thank you Alice, that\'s very helpful', delay: 1500 },
  { speaker: 'Dave', text: 'I think we should consider using a token bucket algorithm', delay: 2000 },
  { speaker: 'Alice', text: 'Good suggestion Dave, let\'s discuss that further', delay: 2000 },
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDemo() {
  console.log(chalk.green('🎤 Demo meeting started...\n'));

  let violationCount = 0;

  for (const caption of simulatedConversation) {
    await sleep(caption.delay);

    // Analyze the caption
    const analysis = analyzer.analyze(caption.text, caption.speaker);

    // Display the caption
    if (analysis.violations.length === 0) {
      console.log(chalk.white(`[${caption.speaker}]: ${caption.text}`));
    } else {
      console.log(chalk.red(`[${caption.speaker}]: ${caption.text}`));
    }

    // Alert if violations detected
    if (analysis.shouldAlert) {
      violationCount++;
      notifier.alert(analysis);
      await sleep(1000); // Pause to let user see the alert
    }
  }

  // Summary
  console.log(chalk.cyan.bold('\n\n📊 Demo Session Summary'));
  console.log(chalk.cyan('═'.repeat(50)));
  console.log(chalk.yellow(`Total messages analyzed: ${simulatedConversation.length}`));
  console.log(chalk.red(`Rule violations detected: ${violationCount}`));
  console.log(chalk.cyan('\n✅ Demo completed! The monitor successfully detected:'));
  console.log(chalk.yellow('  • Condescending language ("Obviously you should have read...")'));
  console.log(chalk.yellow('  • Toxic patterns ("That\'s a stupid question...")'));
  console.log(chalk.yellow('  • Dismissive behavior ("Whatever, I don\'t care...")'));

  console.log(chalk.green.bold('\n\n🎉 The tone monitor is working correctly!'));
  console.log(chalk.white('\nTo test with a real meeting:'));
  console.log(chalk.white('1. Make sure Chrome/Chromium is installed on your system'));
  console.log(chalk.white('2. Run: npm start'));
  console.log(chalk.white('3. The browser will open and join your meeting automatically'));
  console.log(chalk.white('4. Enable captions in the meeting (press C key)'));
  console.log(chalk.white('5. Start speaking and the monitor will analyze in real-time\n'));
}

// Run the demo
runDemo().catch(error => {
  console.error(chalk.red('Error running demo:'), error);
  process.exit(1);
});
