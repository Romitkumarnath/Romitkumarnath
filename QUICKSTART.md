# 🚀 Quick Start - Get Running in 5 Minutes

Your meeting: **https://meet.google.com/ybt-yxvu-ged**

## Copy-Paste Commands (Easiest Way)

### Mac / Linux

Open Terminal and copy-paste these commands one by one:

```bash
# 1. Go to your home directory
cd ~

# 2. Clone the repository
git clone https://github.com/Romitkumarnath/Romitkumarnath.git

# 3. Enter the directory
cd Romitkumarnath

# 4. Switch to the correct branch
git checkout claude/meet-tone-monitor-011CUWKupwthjVpqbXZz1khy

# 5. Install dependencies (takes 2-3 minutes)
npm install

# 6. Run the quick start script
chmod +x quick-start.sh
./quick-start.sh
```

### Windows

Open PowerShell and copy-paste these commands one by one:

```powershell
# 1. Go to your home directory
cd $HOME

# 2. Clone the repository
git clone https://github.com/Romitkumarnath/Romitkumarnath.git

# 3. Enter the directory
cd Romitkumarnath

# 4. Switch to the correct branch
git checkout claude/meet-tone-monitor-011CUWKupwthjVpqbXZz1khy

# 5. Install dependencies (takes 2-3 minutes)
npm install

# 6. Run the quick start script
.\quick-start.bat
```

## What the Script Does

The `quick-start` script will:
1. ✅ Check if Node.js and npm are installed
2. ✅ Check if dependencies are installed
3. 🎮 Give you two options:
   - **Option 1**: Run demo mode (simulated meeting)
   - **Option 2**: Join your real meeting

## If You Don't Have Node.js

1. Go to: https://nodejs.org/
2. Download the LTS version
3. Install it
4. Come back and run the commands above

## Manual Method (If Scripts Don't Work)

```bash
# After cloning and installing (steps 1-5 above)

# Option A: Test with demo
npm run demo

# Option B: Join real meeting
npm start
```

## What Happens When You Start

1. **Browser opens** automatically
2. **Navigates** to your meeting: https://meet.google.com/ybt-yxvu-ged
3. **Joins** the meeting
4. **You must press `C`** to enable captions!
5. **Monitor starts** watching for violations

## Test It!

Once captions are on, say these phrases:

**Should trigger alerts:**
- "That's a stupid idea"
- "Obviously you don't understand"
- "Whatever, I don't care"

**Should NOT trigger:**
- "Good morning"
- "I agree"
- "Great point"

## When Alert Triggers

You'll see:
```
================================================================================
⚠️ WARNING: Toxic language detected. Please maintain respectful communication.
Speaker: You
Text: "That's a stupid idea"
================================================================================
```

Plus desktop notification + beep!

## Stop Monitoring

Press `Ctrl+C` in the terminal

## Troubleshooting

**"command not found"**
- Install Node.js from https://nodejs.org/

**"Browser doesn't open"**
- Make sure you're on your LOCAL machine, not remote/cloud

**"No captions"**
- Press `C` key in Google Meet window

**"No alerts"**
- Make sure captions are ON and visible
- Speak clearly and wait 2-3 seconds

## Need More Help?

- Read `SETUP.md` for detailed instructions
- Read `README.md` for full documentation
- Read `TESTING.md` for testing guide

## One-Liner (After Setup)

Once you've done the setup once, next time just run:

```bash
cd ~/Romitkumarnath && npm start
```

That's it! 🎉
