# Usage Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your meeting:**
   ```bash
   # Edit .env file
   MEET_URL=https://meet.google.com/your-code
   ```

3. **Run the monitor:**
   ```bash
   npm start
   ```

## Step-by-Step Guide

### Step 1: Join a Meeting

The application will:
1. Launch a browser window
2. Navigate to your Google Meet URL
3. Automatically turn off camera and microphone
4. Click the "Join" button
5. Enable live captions

### Step 2: Monitoring Begins

Once joined, you'll see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║          🎤 Google Meet Tone Monitor v1.0.0              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Meeting Rules of Engagement
───────────────────────────
1. Be respectful and professional
2. No personal attacks or insults
3. No condescending or dismissive language
4. Listen actively without interrupting
5. Focus on ideas, not individuals
6. Keep discussions constructive

🎤 Tone Monitor Active
Meeting: https://meet.google.com/abc-defg-hij
Monitoring for tone violations...
```

### Step 3: Real-time Caption Monitoring

As people speak, captions will be logged:
```
[Alice]: I think we should consider the alternative approach
[Bob]: That makes sense, let me add to that idea
[Charlie]: I disagree, but here's why...
```

### Step 4: Violation Detection

When a violation is detected, you'll see:
```
================================================================================
⚠️ WARNING: Toxic language detected. Please maintain respectful communication.
Speaker: Bob
Text: "That's a stupid suggestion"
Violations: toxic_pattern
Sentiment Score: -4
Time: 2:30:45 PM
================================================================================
```

Plus:
- Desktop notification
- Audio beep (if enabled)

### Step 5: Taking Action

When an alert fires:
1. The violating text is highlighted in the console
2. A desktop notification appears
3. You can:
   - Speak up in the meeting
   - Use the meeting chat to remind about rules
   - Take note for follow-up
   - Adjust sensitivity if needed

### Step 6: Stopping the Monitor

Press `Ctrl+C` to stop:
```
^C
🛑 Shutting down gracefully...
ℹ Stopping monitoring...
✓ Cleanup completed
```

## Common Scenarios

### Scenario 1: Team Meeting with Known Issues

Your team has had communication problems. Set up strict monitoring:

```bash
# .env
MEET_URL=https://meet.google.com/team-meeting
CHECK_INTERVAL_MS=1000
MAX_NEGATIVE_SCORE=-1
ENABLE_SOUND=true
```

```json
// config/rules.json
{
  "thresholds": {
    "sentimentScore": -1,
    "toxicityCount": 1,
    "condescendingCount": 1,
    "dismissiveCount": 1
  }
}
```

### Scenario 2: Client Meeting (Relaxed Monitoring)

For professional external meetings with less aggressive monitoring:

```bash
# .env
MEET_URL=https://meet.google.com/client-call
CHECK_INTERVAL_MS=3000
MAX_NEGATIVE_SCORE=-4
ENABLE_SOUND=false
```

```json
// config/rules.json
{
  "thresholds": {
    "sentimentScore": -4,
    "toxicityCount": 2,
    "condescendingCount": 3,
    "dismissiveCount": 3
  }
}
```

### Scenario 3: Training/Workshop Monitoring

Monitor for disruptive behavior during training:

```bash
npm start -- --url https://meet.google.com/workshop --no-sound
```

Focus on dismissive patterns:
```json
{
  "thresholds": {
    "dismissiveCount": 1
  }
}
```

## Customizing Patterns

### Adding Custom Toxic Phrases

Edit `config/rules.json`:

```json
{
  "toxicPatterns": [
    "stupid",
    "idiot",
    "your custom phrase",
    "another phrase to detect"
  ]
}
```

### Adding Industry-Specific Terms

For technical teams:

```json
{
  "condescendingPatterns": [
    "obviously",
    "read the manual",
    "rtfm",
    "that's basic stuff",
    "any junior dev would know"
  ]
}
```

### Creating Warning Messages

Customize alerts:

```json
{
  "warnings": {
    "toxic": "🚫 Please maintain professional language",
    "condescending": "💼 Let's keep communication respectful",
    "dismissive": "🤝 Every contribution matters",
    "negative": "😊 Let's stay positive and constructive"
  }
}
```

## Advanced Configuration

### Running Multiple Monitors

Monitor multiple meetings simultaneously:

**Terminal 1:**
```bash
MEET_URL=https://meet.google.com/meeting-1 npm start
```

**Terminal 2:**
```bash
MEET_URL=https://meet.google.com/meeting-2 npm start
```

### Logging to File

Redirect output to a file:

```bash
npm start 2>&1 | tee meeting-log-$(date +%Y%m%d-%H%M%S).txt
```

### Silent Background Mode

Run without any visual browser or console output:

```bash
npm start -- --headless --no-sound --no-desktop > /dev/null 2>&1 &
```

### Automation with Cron

Schedule automatic monitoring:

```bash
# crontab -e
0 9 * * 1-5 cd /path/to/project && npm start
```

## Interpreting Results

### Sentiment Scores

- **+5 to +10**: Very positive, enthusiastic
- **0 to +5**: Neutral to positive
- **0 to -2**: Slightly negative (usually okay)
- **-2 to -5**: Negative (warning threshold)
- **-5 or lower**: Very negative (alert!)

### Violation Patterns

| Pattern | Example | Action |
|---------|---------|--------|
| Toxic | "That's idiotic" | Immediate alert |
| Condescending | "Obviously you don't understand" | Alert after threshold |
| Dismissive | "Whatever, moving on" | Alert after threshold |
| Profanity | Filtered automatically | Immediate alert |

## Best Practices

1. **Pre-meeting Setup**
   - Test with a dummy meeting first
   - Adjust thresholds based on team culture
   - Inform participants about monitoring (transparency)

2. **During Monitoring**
   - Keep the console visible
   - Review patterns, not just alerts
   - Take notes on false positives

3. **Post-meeting Review**
   - Review logged violations
   - Adjust rules if needed
   - Share feedback with team (anonymously)

4. **Privacy Considerations**
   - Get consent from participants
   - Don't record without permission
   - Use for improvement, not punishment

## Troubleshooting Tips

### Captions Not Working
```bash
# Increase wait time for captions to load
# Edit src/meetMonitor.js line 123:
await this.page.waitForTimeout(8000); // Increase from 5000
```

### Too Many False Positives
```json
// Increase thresholds in config/rules.json
{
  "thresholds": {
    "sentimentScore": -5,
    "toxicityCount": 3
  }
}
```

### Missing Violations
```json
// Decrease thresholds and add more patterns
{
  "thresholds": {
    "sentimentScore": -1,
    "toxicityCount": 1
  },
  "toxicPatterns": [
    "add more phrases here"
  ]
}
```

## Getting Help

If you need assistance:

1. Check this guide first
2. Review README.md
3. Check config/rules.json examples
4. Open an issue on GitHub

## Example Session Output

```
╔═══════════════════════════════════════════════════════════╗
║          🎤 Google Meet Tone Monitor v1.0.0              ║
╚═══════════════════════════════════════════════════════════╝

📋 Configuration:
   Meeting URL: https://meet.google.com/abc-defg-hij
   Check Interval: 2000ms
   Headless Mode: No
   Sound Alerts: Yes
   Desktop Notifications: Yes

ℹ Launching browser...
✓ Browser initialized
ℹ Navigating to https://meet.google.com/abc-defg-hij...
✓ Clicked join button
ℹ Enabling live captions...
✓ Captions enabled
✓ Successfully joined meeting

Meeting Rules of Engagement
───────────────────────────
1. Be respectful and professional
2. No personal attacks or insults
...

🎤 Tone Monitor Active
Monitoring for tone violations...

[Alice]: Welcome everyone to today's standup
[Bob]: Thanks Alice, I'll start with my updates
[Charlie]: I have some concerns about the timeline
[Bob]: That's a stupid concern, we discussed this

================================================================================
⚠️ WARNING: Toxic language detected. Please maintain respectful communication.
Speaker: Bob
Text: "That's a stupid concern, we discussed this"
Violations: toxic_pattern
Sentiment Score: -3
Time: 10:15:23 AM
================================================================================

[Alice]: Let's keep it constructive please
[Bob]: Sorry, I meant I disagree because...
[Charlie]: Thanks, I appreciate that

^C
🛑 Shutting down gracefully...
✓ Cleanup completed
```
