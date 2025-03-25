# FocusFlow Chrome Extension - Testing Guide

This document explains how to test the FocusFlow Chrome extension during development.

## Manual Testing

### Loading the Extension in Chrome

1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the project directory
6. The extension should now be installed and visible in your Chrome toolbar

### Testing Features

After loading the extension, test the following features:

#### Basic Functionality
- [ ] Extension icon appears in toolbar
- [ ] Clicking the icon opens the popup
- [ ] UI renders correctly (no visual glitches)
- [ ] Tabs switch correctly when clicked

#### Focus Room
- [ ] Room dropdown shows available rooms
- [ ] Joining a room updates the current room name
- [ ] Chat input and send button work
- [ ] Messages appear in the chat area
- [ ] Premium rooms prompt for upgrade when not premium

#### Pomodoro Timer
- [ ] Timer displays correctly
- [ ] Start button begins countdown
- [ ] Pause button stops countdown
- [ ] Reset button resets the timer
- [ ] Settings fields update correctly
- [ ] Timer completes and switches modes (focus to break, etc.)

#### Goals
- [ ] Default goals appear in the list
- [ ] Adding a new goal updates the list
- [ ] Checking/unchecking goals works
- [ ] Progress bar updates correctly
- [ ] Statistics display properly

#### Analytics
- [ ] Chart displays correctly
- [ ] AI insights are shown
- [ ] Integration buttons are clickable
- [ ] Premium features prompt for upgrade

#### Premium Upgrade
- [ ] Upgrade button shows the upgrade modal
- [ ] Plan options display correctly
- [ ] UI indicates premium restrictions appropriately

#### Authentication
- [ ] User profile shows login state correctly
- [ ] Clicking when logged out shows auth modal
- [ ] Form inputs function correctly

### Testing Scenarios

Test these specific scenarios:

1. **New User Flow**:
   - Load extension for the first time
   - Browse each tab without logging in
   - Try premium features and see appropriate upgrade prompts
   - Sign up for an account
   - Verify default settings are applied

2. **Pomodoro Session**:
   - Start a pomodoro session
   - Join a focus room
   - Add goals during the session
   - Complete a full pomodoro cycle (focus + break)
   - Check analytics after session

3. **Premium Upgrade**:
   - Trigger upgrade prompt by attempting premium feature
   - Go through upgrade flow (without completing purchase)
   - Verify UI changes after simulating premium access

## Automated Testing

While full automated testing is beyond the scope of the initial implementation, here are some testing commands you can use:

### Running Linting

Lint your JavaScript code:

```bash
npm run lint
```

### Building the Extension

Create a production ZIP file:

```bash
npm run build
```

The ZIP file will be created in the `build/` directory.

## Chrome Extension Testing Best Practices

1. **Cross-browser testing**: While designed for Chrome, you can test compatibility with other Chromium-based browsers (Edge, Opera, etc.)

2. **Responsive testing**: Test the popup at different sizes by resizing the popup window

3. **Storage testing**: Test that data persists between browser sessions
   - Set some goals and preferences
   - Close the browser completely
   - Reopen and verify the data is still there

4. **Performance testing**: Monitor CPU and memory usage
   - Open Chrome Task Manager (More tools > Task Manager)
   - Look for any unusual resource usage from your extension

5. **Permission testing**: Ensure the extension works with only the permissions it needs
   - Check that notifications appear when they should
   - Verify storage works correctly

## Troubleshooting

If you encounter issues during testing:

1. Check the console for errors:
   - Right-click on the extension popup
   - Select "Inspect"
   - Look at the Console tab for error messages

2. Reload the extension:
   - Go to `chrome://extensions/`
   - Find your extension
   - Click the refresh icon

3. Clear extension data:
   - Go to `chrome://extensions/`
   - Find your extension
   - Click "Details"
   - Scroll down and click "Clear Data"
   - Reload the extension

4. Check background page console:
   - Go to `chrome://extensions/`
   - Find your extension
   - Click "Details"
   - Find "Inspect views" and click on "service worker"
   - Look at the Console tab for error messages

## Test Results Tracking

Keep track of testing results using this format:

```
Test Date: YYYY-MM-DD
Chrome Version: XX.X.XXXX.XX
Tester: [Name]

Issues Found:
1. [Issue description] - [Priority: High/Medium/Low]
2. [Issue description] - [Priority: High/Medium/Low]

Fixed Issues:
1. [Issue description] - Fixed in commit [commit hash]
```

## Pre-Release Checklist

Before submitting to the Chrome Web Store:

- [ ] All critical functionality works without errors
- [ ] UI renders correctly in light and dark mode
- [ ] Extension handles network errors gracefully
- [ ] All text is properly displayed (no overflow issues)
- [ ] Icons and images are properly sized and displayed
- [ ] Version number in manifest.json is correct
- [ ] Description and metadata are complete and accurate
- [ ] Premium feature restrictions work correctly
- [ ] No console errors or warnings during normal operation