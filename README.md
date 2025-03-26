# FocusFlow - Virtual Coworking Chrome Extension

FocusFlow is a Chrome extension that creates a virtual coworking environment to combat remote-work isolation and improve productivity.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-brightgreen)
![License](https://img.shields.io/badge/license-UNLICENSED-red)

## Version 1.1.0 Updates

- ✅ Modular, production-ready code structure
- ✅ Improved error handling throughout the application
- ✅ Enhanced accessibility for all UI elements
- ✅ Dark mode support added
- ✅ Better storage management with error recovery
- ✅ More reliable notification system
- ✅ Loading screens and error states
- ✅ Unit test infrastructure added (Jest)
- ✅ Strict Content Security Policy
- ✅ Service worker improvements
- ✅ Comprehensive documentation

## Features

### Free Tier
- **Virtual Coworking Rooms**: Join public rooms to work alongside others
- **Basic Pomodoro Timer**: Use the popular Pomodoro technique to manage your focus and breaks
- **Goal Setting**: Track your daily tasks and goals
- **Basic Analytics**: See simple statistics about your productivity
- **Limited Integrations**: Connect with popular tools like Trello, Asana, and Google Calendar

### Premium Tier ($5/month or $50 one-time)
- **Private Rooms**: Create and customize your own coworking spaces
- **Advanced Analytics**: Get detailed insights into your productivity patterns
- **Unlimited Integrations**: Connect with a wide range of productivity tools
- **Priority Matching**: Get matched with like-minded coworkers
- **Exclusive Content**: Access premium productivity guides and webinars

## Development

### Project Structure
- `manifest.json`: Chrome extension manifest file (V3)
- `popup.html`: Main extension popup interface
- `css/popup.css`: Styles for the popup
- `js/popup.js`: JavaScript for the popup functionality
- `background.js`: Background service worker for the extension
- `images/`: Icons and images used by the extension

### Local Development
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked" and select the project directory
5. The extension should now be installed and visible in your Chrome toolbar

### Building for Production
To build the extension for production:

1. Make sure all files are up to date and tests pass
   ```bash
   npm run validate
   ```

2. Build the production zip file
   ```bash
   npm run build
   ```

3. The zip file will be created in the `build/` directory with the version number
   ```
   build/focusflow-v1.1.0.zip
   ```

4. This file can be uploaded to the Chrome Web Store

### Development Build

For development testing, you can create a development build:

```bash
npm run build:dev
```

This will create `build/focusflow-dev.zip` which can be used for testing.

### Version Management

To bump the version number:

1. Update the version in `package.json`
2. Run the version script to update all files
   ```bash
   npm run version
   ```

## Publishing to the Chrome Web Store

1. Create a developer account at the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay the one-time developer registration fee ($5)
3. Create a new item and upload your zip file
4. Fill in all the required store listing information
5. Submit for review

See the [Publishing Guide](PUBLISHING.md) for detailed instructions.

## Implementing Monetization

This extension uses a freemium model:
1. Basic features are available for free
2. Premium features require a paid subscription
3. Payments are processed through the Chrome Web Store payments API
4. User authentication is handled through Firebase Authentication

See the [Monetization Guide](MONETIZATION.md) for implementation details.

## License

Copyright © 2025 FocusFlow. All rights reserved.