/**
 * Version bump script for FocusFlow
 * Updates the version number in manifest.json, popup.html, and other related files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the package.json version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const newVersion = packageJson.version;

console.log(`Updating files to version ${newVersion}`);

// Update manifest.json
const manifestPath = path.join(__dirname, '..', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✓ Updated manifest.json to version ${newVersion}`);

// Update popup.html
const popupHtmlPath = path.join(__dirname, '..', 'popup.html');
let popupHtml = fs.readFileSync(popupHtmlPath, 'utf8');
popupHtml = popupHtml.replace(/<meta name="version" content="(.*?)"/, `<meta name="version" content="${newVersion}"`);
popupHtml = popupHtml.replace(/<span>FocusFlow v(.*?)<\/span>/, `<span>FocusFlow v${newVersion}</span>`);
fs.writeFileSync(popupHtmlPath, popupHtml, 'utf8');
console.log(`✓ Updated popup.html to version ${newVersion}`);

// Update popup.js
const popupJsPath = path.join(__dirname, '..', 'js', 'popup.js');
let popupJs = fs.readFileSync(popupJsPath, 'utf8');
popupJs = popupJs.replace(/\/\/ Version (.*?) - Production Ready/, `// Version ${newVersion} - Production Ready`);
popupJs = popupJs.replace(/version: ['"].*?['"]/, `version: '${newVersion}'`);
fs.writeFileSync(popupJsPath, popupJs, 'utf8');
console.log(`✓ Updated js/popup.js to version ${newVersion}`);

// Update background.js
const backgroundJsPath = path.join(__dirname, '..', 'background.js');
let backgroundJs = fs.readFileSync(backgroundJsPath, 'utf8');
backgroundJs = backgroundJs.replace(/\/\/ Version (.*?) - Production Ready/, `// Version ${newVersion} - Production Ready`);
backgroundJs = backgroundJs.replace(/version: ['"].*?['"]/, `version: '${newVersion}'`);
backgroundJs = backgroundJs.replace(/v[0-9]+\.[0-9]+\.[0-9]+/g, `v${newVersion}`);
fs.writeFileSync(backgroundJsPath, backgroundJs, 'utf8');
console.log(`✓ Updated background.js to version ${newVersion}`);

// Update CSS version comment
const cssPath = path.join(__dirname, '..', 'css', 'popup.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/\/\* FocusFlow Popup Styles - v(.*?) \*\//, `/* FocusFlow Popup Styles - v${newVersion} */`);
fs.writeFileSync(cssPath, css, 'utf8');
console.log(`✓ Updated css/popup.css to version ${newVersion}`);

console.log('Version bump complete! 🚀');