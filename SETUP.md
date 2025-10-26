# Local Setup Guide - Google Meet Tone Monitor

Follow these steps to run the app on your local machine and join your meeting.

## Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js installed (version 18 or higher)
- [ ] npm installed (comes with Node.js)
- [ ] Git installed
- [ ] Your meeting is active: https://meet.google.com/ybt-yxvu-ged

### Check Your Node.js Version

Open terminal/command prompt and run:
```bash
node --version
```
Should show v18.0.0 or higher.

If you don't have Node.js, download it from: https://nodejs.org/

## Step-by-Step Setup

### Step 1: Clone the Repository

Open terminal/command prompt and run:

**On Mac/Linux:**
```bash
cd ~
git clone https://github.com/Romitkumarnath/Romitkumarnath.git
cd Romitkumarnath
git checkout claude/meet-tone-monitor-011CUWKupwthjVpqbXZz1khy
```

**On Windows (PowerShell):**
```powershell
cd $HOME
git clone https://github.com/Romitkumarnath/Romitkumarnath.git
cd Romitkumarnath
git checkout claude/meet-tone-monitor-011CUWKupwthjVpqbXZz1khy
```

### Step 2: Install Dependencies

This will take 2-3 minutes as it downloads Chrome/Chromium:

```bash
npm install
```

You should see:
```
added 175 packages...
```

If you see any errors, try:
```bash
npm install --legacy-peer-deps
```

### Step 3: Verify Configuration

The `.env` file is already configured with your meeting URL. Check it:

**On Mac/Linux:**
```bash
cat .env
```

**On Windows:**
```powershell
type .env
```

Should show:
```
MEET_URL=https://meet.google.com/ybt-yxvu-ged
```

### Step 4: Test with Demo Mode (Optional)

Test that everything works before joining the real meeting:

```bash
npm run demo
```

You should see simulated conversation with violation alerts. If this works, you're ready!

### Step 5: Join Your Real Meeting

Make sure your meeting is active at https://meet.google.com/ybt-yxvu-ged, then run:

```bash
npm start
```

### What Happens Next

1. **Chrome window opens** - You'll see a browser window open automatically
2. **Navigates to meeting** - Goes to https://meet.google.com/ybt-yxvu-ged
3. **Joins meeting** - Attempts to join automatically
4. **You may need to:**
   - Click "Join now" if it doesn't auto-join
   - Accept camera/microphone permissions (or deny them)
   - **Press `C` key to enable captions** (REQUIRED!)

5. **Console shows monitoring**:
   ```
   ╔═══════════════════════════════════════════════════════════╗
   ║          🎤 Google Meet Tone Monitor v1.0.0              ║
   ╚═══════════════════════════════════════════════════════════╝

   🎤 Tone Monitor Active
   Monitoring for tone violations...
   ```

### Step 6: Test the Detection

Once monitoring is active and captions are ON, speak these test phrases:

**Should NOT trigger alerts:**
- "Good morning everyone"
- "I have an update to share"
- "That's a great idea"

**SHOULD trigger alerts:**
- "That's a stupid suggestion"
- "Obviously you don't understand"
- "Whatever, I don't care"

### Step 7: See the Alerts

When a violation is detected, you'll see:

**In the terminal:**
```
================================================================================
⚠️ WARNING: Toxic language detected. Please maintain respectful communication.
Speaker: You
Text: "That's a stupid suggestion"
Violations: toxic_pattern
Sentiment Score: -4
Time: 2:30:45 PM
================================================================================
```

**On your screen:**
- Desktop notification popup
- Audio beep

### Step 8: Stop Monitoring

When done, press `Ctrl+C` in the terminal to stop.

## Troubleshooting

### Problem: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Problem: "git: command not found"
**Solution:** Install Git from https://git-scm.com/

### Problem: Browser doesn't open
**Solution:**
- Make sure you're on your local machine, not in a container
- Try running: `npm start -- --headless=false`

### Problem: Can't join meeting / Access denied
**Solution:**
1. Make sure the meeting is active
2. Join manually in another tab first
3. The bot will appear as a second participant
4. Accept the join request if needed

### Problem: No captions showing
**Solution:**
- **Press `C` key** in the Google Meet window to enable captions
- Captions are REQUIRED for monitoring to work
- Make sure someone is speaking

### Problem: No violations detected
**Solution:**
- Verify captions are ON and visible at bottom of screen
- Speak clearly and wait 2-3 seconds for caption to appear
- Try the test phrases listed in Step 6

### Problem: Too many false positives
**Solution:**
Edit `config/rules.json` and increase thresholds:
```json
{
  "thresholds": {
    "sentimentScore": -5,
    "toxicityCount": 2,
    "condescendingCount": 3
  }
}
```

### Problem: "Error: Failed to launch chrome"
**Solution:**
- On Linux: `sudo apt-get install chromium-browser`
- On Mac: Chrome should install automatically
- On Windows: Chrome should install automatically

### Problem: Node version too old
**Solution:**
Update Node.js to version 18+:
- Visit https://nodejs.org/
- Download and install the LTS version
- Restart terminal and try again

## Quick Command Reference

```bash
# Install dependencies
npm install

# Run demo (simulated)
npm run demo

# Join real meeting
npm start

# Join with custom URL
npm start -- --url https://meet.google.com/your-code

# Run in headless mode (no visible browser)
npm start -- --headless

# Run without sound alerts
npm start -- --no-sound
```

## Testing Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Demo mode works (`npm run demo`)
- [ ] Meeting is active: https://meet.google.com/ybt-yxvu-ged
- [ ] App starts (`npm start`)
- [ ] Browser opens
- [ ] Joins meeting
- [ ] Captions enabled (press `C`)
- [ ] Test phrases trigger alerts
- [ ] Desktop notifications appear

## Next Steps After Setup

1. **Customize rules**: Edit `config/rules.json`
2. **Adjust sensitivity**: Change threshold values
3. **Add custom phrases**: Add your own violation patterns
4. **Use in real meetings**: Update `MEET_URL` in `.env`

## Video Tutorial (Steps)

1. Open terminal
2. Run: `git clone https://github.com/Romitkumarnath/Romitkumarnath.git`
3. Run: `cd Romitkumarnath`
4. Run: `git checkout claude/meet-tone-monitor-011CUWKupwthjVpqbXZz1khy`
5. Run: `npm install` (wait 2-3 minutes)
6. Run: `npm start`
7. Wait for browser to open
8. Press `C` in Google Meet to enable captions
9. Start speaking test phrases
10. Watch for alerts!

## Getting Help

If you get stuck:
1. Check this guide again
2. Read README.md for more details
3. Check TESTING.md for testing tips
4. Make sure meeting is active
5. Verify captions are enabled

## Success Criteria

You'll know it's working when:
- ✅ Browser opens automatically
- ✅ Joins your meeting
- ✅ Console shows "Tone Monitor Active"
- ✅ Speaking "That's stupid" triggers an alert
- ✅ Desktop notification pops up

Good luck! 🚀
