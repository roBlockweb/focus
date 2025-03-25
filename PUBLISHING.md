# FocusFlow Chrome Extension - Publishing Guide

This guide provides step-by-step instructions on how to publish the FocusFlow Chrome extension to the Chrome Web Store.

## Prerequisites

1. A Google account (use `roblockweb@gmail.com`)
2. $5 one-time developer registration fee
3. High-quality icon images and screenshots
4. Complete extension code (all features implemented and tested)

## Step 1: Prepare Your Extension

Before publishing, ensure your extension is properly packaged:

1. Update version number in `manifest.json` if needed
2. Make sure all files are included (manifest.json, HTML, CSS, JS, images)
3. Test the extension thoroughly in Developer Mode
4. Create eye-catching screenshots and promotional images

### Required Images

For the Chrome Web Store listing, you'll need:

- **Icon**: 128x128 PNG (already in your images folder)
- **Screenshots**: At least 1, preferably 3-5 screenshots (1280x800 or 640x400)
- **Promotional Images** (optional but recommended):
  - Small Promotional Tile: 440x280 PNG
  - Large Promotional Tile: 920x680 PNG
  - Marquee Promotional Tile: 1400x560 PNG

To create screenshots, open your extension and use your system's screenshot tool to capture the popup interface.

## Step 2: Create a ZIP File

1. Select all files and folders in your extension directory:
   - `manifest.json`
   - `popup.html`
   - `background.js`
   - `css/` directory
   - `js/` directory
   - `images/` directory
   - Any other files needed by your extension

2. Create a ZIP file containing these files and folders
   - On macOS: Select all files, right-click, and choose "Compress Items"
   - On Windows: Select all files, right-click, and choose "Send to > Compressed (zipped) folder"

3. Name the ZIP file `focusflow.zip`

## Step 3: Create a Chrome Web Store Developer Account

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account (`roblockweb@gmail.com`)
3. If you've never published before, you'll need to:
   - Accept the developer agreement
   - Pay the one-time $5 registration fee

## Step 4: Create a New Item

1. In the Developer Dashboard, click "New Item"
2. Upload your `focusflow.zip` file
3. Wait for the file to upload and process

## Step 5: Complete the Store Listing

You'll need to fill out several sections:

### Store Listing Tab
- **Extension Name**: "FocusFlow - Virtual Coworking"
- **Short Description** (maximum 132 characters):
  ```
  Create a virtual coworking environment to combat remote-work isolation and improve productivity.
  ```
- **Detailed Description** (maximum 16,000 characters):
  ```
  FocusFlow creates a virtual coworking environment to combat remote-work isolation and improve productivity.

  🌟 FREE FEATURES:
  • Virtual Coworking Rooms - Join public rooms to work alongside others
  • Pomodoro Timer - Use the popular Pomodoro technique with customizable durations
  • Goal Setting & Tracking - Set and track your daily tasks and goals
  • Basic Analytics - See your productivity patterns

  🚀 PREMIUM FEATURES:
  • Private Rooms - Create and customize your own coworking spaces
  • Advanced Analytics - Get detailed insights into your productivity patterns
  • Unlimited Integrations - Connect with more productivity tools 
  • Priority Matching - Get matched with like-minded coworkers
  • Exclusive Content - Access premium productivity guides and webinars

  📝 WHY FOCUSFLOW?
  • Combat isolation while working remotely
  • Increase productivity with the power of accountability
  • Build healthy work routines with Pomodoro sessions
  • Track your progress and identify productivity patterns
  • Connect with other productive professionals

  FocusFlow helps you work better by creating the feeling of working alongside others, even when you're physically alone. Join public rooms, find an accountability partner, and enhance your focus with our AI-powered productivity tools.

  Try FocusFlow for free today, or upgrade to Premium for just $5/month or $50 lifetime access!
  ```
- **Category**: Productivity
- **Language**: English
- **Screenshots**: Upload 3-5 screenshots of your extension in use

### More Information Tab
- **Website**: Leave blank or use your personal website
- **Single Purpose Description**: 
  ```
  This extension creates a virtual coworking environment to help users be more productive while working remotely. It offers virtual rooms, a Pomodoro timer, goal tracking, and productivity analytics.
  ```
- **Permissions Justification**:
  ```
  - Storage: To save user preferences, goals, and analytics data
  - Alarms: To track Pomodoro sessions and send notifications
  - Notifications: To alert users when Pomodoro sessions end
  - Identity: For user authentication (optional premium features)
  ```

## Step 6: Set Up Pricing and Distribution

### Pricing Tab
1. Choose "Free" as the base app type
2. For monetization, select "In-app purchase with Chrome Web Store Payments"
3. Add in-app items:
   - **Monthly Premium**: $5/month
   - **Lifetime Premium**: $50 one-time

### Distribution Tab
1. Select "Public" visibility
2. Choose which countries to publish in (usually select "All regions")

## Step 7: Submit for Review

1. Make sure all required information is filled out
2. Check that your extension complies with the [Chrome Web Store Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies/)
3. Click "Submit for Review"

The review process typically takes 1-3 business days. You'll receive an email when your extension is approved or if there are issues to address.

## After Publication

Once your extension is approved and published:

1. Share the Chrome Web Store link with potential users
2. Consider implementing a marketing strategy (social media, productivity forums, etc.)
3. Monitor user feedback and reviews
4. Address bugs and add improvements in regular updates

## Updating Your Extension

To update your extension after it's published:

1. Make your code changes
2. Increment the version number in `manifest.json`
3. Create a new ZIP file
4. Go to your item in the Chrome Web Store Developer Dashboard
5. Upload the new ZIP file
6. Update any store listing information if needed
7. Submit the update for review

## Monitoring Performance

Use the Chrome Web Store Developer Dashboard to:
- Track installations
- View user reviews and ratings
- Monitor in-app purchase conversions
- Identify and address any user issues