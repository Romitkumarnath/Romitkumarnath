# Google Meet Tone Monitor

An intelligent application that monitors Google Meet conversations in real-time, detects tone violations, and alerts participants when rules of engagement are being broken.

## Features

- **Real-time Tone Analysis**: Monitors live captions in Google Meet for toxic, condescending, or dismissive language
- **Sentiment Analysis**: Tracks overall sentiment and negativity levels in conversations
- **Rule Violation Detection**: Identifies when participants violate predefined rules of engagement
- **Multi-channel Alerts**: Sends notifications via desktop, console, and audio alerts
- **Customizable Rules**: Configure your own rules of engagement and violation thresholds
- **Privacy-focused**: Runs locally on your machine with no external data sharing

## How It Works

1. The application uses Puppeteer to automate a browser and join your Google Meet session
2. It enables live captions to capture conversation text in real-time
3. Each caption is analyzed for:
   - Toxic language and profanity
   - Condescending phrases
   - Dismissive behavior
   - Overall negative sentiment
4. When violations are detected, alerts are sent immediately via:
   - Desktop notifications
   - Console warnings with details
   - Audio beeps (optional)

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Google Chrome or Chromium browser
- A Google Meet session URL

## Installation

1. Clone this repository:
```bash
git clone https://github.com/Romitkumarnath/Romitkumarnath.git
cd Romitkumarnath
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the example:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
MEET_URL=https://meet.google.com/your-meeting-code
GOOGLE_EMAIL=your-email@gmail.com
GOOGLE_PASSWORD=your-password

ALERT_THRESHOLD=3
CHECK_INTERVAL_MS=2000
MAX_NEGATIVE_SCORE=-2

ENABLE_SOUND=true
ENABLE_DESKTOP_NOTIFICATIONS=true
ENABLE_CONSOLE_LOGS=true
```

## Usage

### Basic Usage

Start monitoring a Google Meet session:

```bash
npm start
```

### Advanced Usage

**Specify a different meeting URL:**
```bash
npm start -- --url https://meet.google.com/abc-defg-hij
```

**Run in headless mode (no visible browser):**
```bash
npm start -- --headless
```

**Disable sound alerts:**
```bash
npm start -- --no-sound
```

**Custom check interval:**
```bash
npm start -- --interval 1000
```

**Combine multiple options:**
```bash
npm start -- --url https://meet.google.com/xyz --headless --no-sound
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-u, --url <url>` | Google Meet URL to monitor | From `.env` |
| `-h, --headless` | Run browser in headless mode | `false` |
| `--no-sound` | Disable sound alerts | `false` |
| `--no-desktop` | Disable desktop notifications | `false` |
| `-i, --interval <ms>` | Caption check interval | `2000` |
| `--help` | Display help message | - |

## Configuration

### Rules of Engagement

Edit `config/rules.json` to customize detection rules:

```json
{
  "rulesOfEngagement": {
    "title": "Meeting Rules of Engagement",
    "rules": [
      "Be respectful and professional",
      "No personal attacks or insults",
      "No condescending or dismissive language"
    ]
  },
  "toxicPatterns": [
    "stupid", "idiot", "moron"
  ],
  "condescendingPatterns": [
    "obviously", "clearly you don't understand"
  ],
  "dismissivePatterns": [
    "whatever", "I don't care"
  ],
  "thresholds": {
    "sentimentScore": -2,
    "toxicityCount": 1,
    "condescendingCount": 2
  }
}
```

### Detection Thresholds

Adjust sensitivity in `config/rules.json`:

- `sentimentScore`: Minimum sentiment score before alerting (lower = more negative)
- `toxicityCount`: Number of toxic patterns before alerting
- `condescendingCount`: Number of condescending patterns before alerting
- `dismissiveCount`: Number of dismissive patterns before alerting

## Alert Types

### Console Alerts
Detailed violation information printed to the terminal:
```
================================================================================
⚠️ WARNING: Toxic language detected. Please maintain respectful communication.
Speaker: John Doe
Text: "That's a stupid idea"
Violations: toxic_pattern
Sentiment Score: -3
Time: 2:30:45 PM
================================================================================
```

### Desktop Notifications
System notifications that appear on your screen with violation summary.

### Audio Alerts
Terminal beep sounds to immediately grab your attention.

## Project Structure

```
.
├── src/
│   ├── index.js           # Main application entry point
│   ├── meetMonitor.js     # Google Meet automation and monitoring
│   ├── toneAnalyzer.js    # Tone and sentiment analysis engine
│   └── notifier.js        # Alert and notification system
├── config/
│   └── rules.json         # Rules of engagement configuration
├── .env.example           # Environment variables template
├── package.json           # Project dependencies
└── README.md             # This file
```

## Architecture

```
┌─────────────────┐
│  Google Meet    │
│  (Live Captions)│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  MeetMonitor    │  ← Puppeteer automation
│  (meetMonitor.js)│  ← Caption extraction
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  ToneAnalyzer   │  ← Sentiment analysis
│ (toneAnalyzer.js)│  ← Pattern matching
└────────┬────────┘  ← Violation detection
         │
         ↓
┌─────────────────┐
│   Notifier      │  ← Desktop alerts
│  (notifier.js)  │  ← Console logs
└─────────────────┘  ← Audio beeps
```

## How to Enable Live Captions in Google Meet

The application attempts to enable captions automatically, but you can also do it manually:

1. Join the meeting
2. Click the three dots menu (⋮) at the bottom
3. Select "Turn on captions" or press `C` on your keyboard
4. Captions will appear at the bottom of the screen

## Privacy & Security

- All processing happens locally on your machine
- No data is sent to external servers
- Credentials are stored in `.env` file (never commit this!)
- The browser runs with your Google account (if credentials provided)

## Limitations

- Requires Google Meet's live captions feature to be available
- Only monitors text from captions (not audio directly)
- Caption accuracy depends on Google's speech recognition
- May miss very fast-paced conversations
- Requires the meeting to have captions enabled

## Troubleshooting

### Browser doesn't join the meeting
- Make sure your Google credentials are correct in `.env`
- Try running without headless mode to see what's happening
- Check if you need to accept meeting permissions manually

### Captions not detected
- Manually enable captions in the meeting (press `C`)
- Increase `CHECK_INTERVAL_MS` if captions are being missed
- Check browser console for errors

### Alerts not showing
- For desktop notifications, grant permission when prompted
- Check notification settings in your OS
- Verify `ENABLE_DESKTOP_NOTIFICATIONS=true` in `.env`

### High false positive rate
- Adjust thresholds in `config/rules.json`
- Remove overly sensitive patterns
- Increase threshold values to make detection less sensitive

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Direct audio processing (without relying on captions)
- [ ] Support for other video conferencing platforms (Zoom, Teams)
- [ ] Machine learning-based tone detection
- [ ] Web dashboard for monitoring multiple meetings
- [ ] Real-time meeting analytics and reports
- [ ] Integration with Slack/Discord for alerts
- [ ] Mobile app support

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Puppeteer](https://pptr.dev/) - Browser automation
- [Sentiment](https://github.com/thisandagain/sentiment) - Sentiment analysis
- [bad-words](https://github.com/web-mech/badwords) - Profanity filtering
- [node-notifier](https://github.com/mikaelbr/node-notifier) - Desktop notifications

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the troubleshooting section above

## Disclaimer

This tool is for educational and professional development purposes. Always respect privacy and obtain consent before monitoring conversations. Use responsibly and in accordance with your organization's policies and applicable laws.
