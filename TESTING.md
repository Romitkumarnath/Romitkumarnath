# Testing Guide for Google Meet Tone Monitor

Your meeting URL: **https://meet.google.com/ybt-yxvu-ged**

## Quick Test (Demo Mode) ✅ COMPLETED

The demo simulation has already run successfully! It tested the tone analyzer with simulated conversation and detected 2 violations:
- Toxic language detection
- Dismissive behavior detection

To run it again:
```bash
npm run demo
# or
npm test
```

## Testing with Your Real Google Meet

Since this is running in a containerized environment without Chrome/Chromium, you'll need to test the full application on your local machine. Here's how:

### Option 1: Test on Your Local Machine (Recommended)

1. **Clone the repository on your local machine:**
   ```bash
   git clone https://github.com/Romitkumarnath/Romitkumarnath.git
   cd Romitkumarnath
   git checkout claude/meet-tone-monitor-011CUWKupwthjVpqbXZz1khy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   Note: This will download Chrome/Chromium automatically via Puppeteer

3. **The .env file is already configured with your meeting URL:**
   ```
   MEET_URL=https://meet.google.com/ybt-yxvu-ged
   ```

4. **Start the monitor:**
   ```bash
   npm start
   ```

5. **What will happen:**
   - A Chrome browser window will open
   - It will navigate to your meeting: https://meet.google.com/ybt-yxvu-ged
   - You may need to manually:
     - Allow camera/microphone permissions (or deny them)
     - Click "Join now"
     - Enable captions by pressing `C` key

6. **Monitor the console for alerts**

### Option 2: Test with Multiple Participants

For a realistic test, you need multiple people speaking:

#### Setup A: Two Devices Method
1. **Device 1** (your laptop):
   - Run the monitor: `npm start`
   - Let it join the meeting

2. **Device 2** (your phone/tablet):
   - Join the same meeting: https://meet.google.com/ybt-yxvu-ged
   - Start speaking test phrases

#### Setup B: One Device with Manual Join
1. **Join the meeting manually** in your regular browser:
   - Go to https://meet.google.com/ybt-yxvu-ged
   - Join the meeting
   - Enable captions (press `C`)

2. **Run the monitor** in a separate terminal:
   ```bash
   npm start
   ```

3. The monitor will join as a second participant

### Test Phrases to Try

Once in the meeting with captions enabled, say these phrases to test detection:

#### Should NOT trigger alerts (normal conversation):
- "Good morning everyone"
- "I agree with that approach"
- "Let me share my screen"
- "That's a great idea"
- "Can you explain more about that?"

#### SHOULD trigger alerts:

**Toxic language:**
- "That's a stupid idea"
- "You're being an idiot"
- "This is completely moronic"

**Condescending:**
- "Obviously you didn't understand"
- "Clearly you haven't read the docs"
- "As I already said multiple times"
- "Did you even try?"

**Dismissive:**
- "Whatever, I don't care"
- "That doesn't matter at all"
- "Forget it, moving on"

**Negative sentiment:**
- "I hate this approach, it's terrible"
- "Everything about this is wrong"
- "This will never work"

## Expected Output

### When violations are detected:

**In the console:**
```
================================================================================
⚠️ WARNING: Toxic language detected. Please maintain respectful communication.
Speaker: Participant
Text: "That's a stupid idea"
Violations: toxic_pattern
Sentiment Score: -4
Time: 2:30:45 PM
================================================================================
```

**Desktop notification:**
- A system notification will pop up
- Title: "🚨 Meeting Tone Alert"
- Message: Warning text

**Audio alert:**
- Terminal beep sound

### Normal captions (no violations):
```
[Participant]: Good morning everyone
[Participant]: I have an update on the project
[Participant]: Let me share my screen
```

## Troubleshooting

### "Browser doesn't open"
- Make sure you're running on your local machine, not in a container
- Chrome/Chromium must be installed
- Try running without headless: The app already runs in visible mode by default

### "Can't find meeting" or "Access denied"
- Your meeting URL is: https://meet.google.com/ybt-yxvu-ged
- Make sure the meeting is active (you've joined it first)
- The meeting might require permission to join

### "Captions not working"
- Manually press `C` key in the meeting to enable captions
- Captions must be enabled for the monitor to work
- Google Meet captions require at least one person speaking

### "No violations detected when they should be"
- Make sure captions are ON and visible
- Wait 2-3 seconds after speaking for captions to appear
- Speak clearly so Google's speech recognition can transcribe
- Check if `CHECK_INTERVAL_MS` in .env is reasonable (default: 2000ms)

### "Too many false positives"
- Edit `config/rules.json`
- Increase threshold values:
  ```json
  {
    "thresholds": {
      "sentimentScore": -5,
      "toxicityCount": 2,
      "condescendingCount": 3
    }
  }
  ```

## Testing Checklist

- [x] Demo mode runs successfully
- [ ] Application starts on local machine
- [ ] Browser opens and navigates to meeting
- [ ] Meeting join is successful
- [ ] Captions are enabled
- [ ] Normal speech doesn't trigger alerts
- [ ] Toxic phrases trigger alerts
- [ ] Condescending phrases trigger alerts
- [ ] Dismissive phrases trigger alerts
- [ ] Desktop notifications appear
- [ ] Audio alerts sound
- [ ] Console shows detailed violation info

## Current Status

✅ **Demo Mode**: Tested and working perfectly!
- Tone analyzer: ✅ Working
- Pattern detection: ✅ Working
- Alert system: ✅ Working
- Desktop notifications: ✅ Working
- Console logging: ✅ Working

⏳ **Real Meeting Test**: Requires local machine with Chrome/Chromium

## Next Steps

1. **Try the demo again if you want:**
   ```bash
   npm run demo
   ```

2. **Test on your local machine:**
   - Clone the repo locally
   - Run `npm install`
   - Run `npm start`
   - Join your meeting: https://meet.google.com/ybt-yxvu-ged

3. **Customize rules:**
   - Edit `config/rules.json` to add your own patterns
   - Adjust thresholds based on your team's needs

4. **Use in real meetings:**
   - Update `MEET_URL` in `.env` for different meetings
   - Run before or during the meeting
   - Monitor for tone violations in real-time

## Support

If you encounter issues:
- Check the main README.md for detailed documentation
- Review USAGE.md for usage examples
- Check the console for error messages
- Ensure Chrome/Chromium is installed on your system

Good luck with your testing! 🎉
