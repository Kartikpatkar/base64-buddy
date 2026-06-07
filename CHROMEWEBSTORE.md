# Chrome Web Store Listing — Base64 Buddy

> Last Updated: 2026-06-08

## Store Listing

**Extension Name**
Base64 Buddy

**Short Description**
Encode and decode files in Base64 directly within your browser. Clean, fast, mobile-friendly, and operates 100% offline.

**Detailed Description**
Base64 Buddy is a modern, privacy-focused Chrome Extension that allows developers and designers to encode and decode files into Base64 format directly within the browser.

Features include:
- File Encoding: Drag, drop, or select files (images, documents, PDFs) to instantly convert them to Base64 format.
- File Decoding: Paste Base64 content or select a .txt file containing Base64 text to decode back to original files.
- Smart MIME Type Auto-Detection: Automatically parses common base64 headers for SVG, PNG, JPEG, GIF, WebP, PDF, BMP, and ICO to show correct previews.
- Plaintext Text Preview: Renders decoded plaintext files (JSON, HTML, text configs) directly in a scrollable viewer with a quick Copy Text button.
- Local Extension Storage: Asynchronously retains your theme selections and history locally using chrome.storage.local without blocking performance.
- Download Options: Save Base64 encodings as .txt files or download decoded binary items with custom filenames.
- Rich UI Aesthetics: Fully responsive layout with custom light/dark theme adaptation utilizing Google Material Symbols Outlined icons.
- Full Privacy & Offline First: Runs 100% locally on your machine. Absolutely zero analytics, tracking, or network requests are executed.

How to use it:
1. Launch Base64 Buddy from your extensions toolbar.
2. In the Encode tab, click or drop a file to convert it, then copy or download the resulting Base64 string.
3. In the Decode tab, paste a Base64 string or drop a text file. The extension auto-detects if a Data URI prefix is present or identifies the matching MIME type to preview it. Click Download to save the decoded file.

Base64 Buddy respects user privacy and runs with zero remote assets. It requests only local storage permissions to preserve theme and history preferences across sessions. No browser history or web traffic data is accessed.

For support, issues, or contributions, please visit the project's official GitHub repository at https://github.com/Kartikpatkar/base64-buddy.

**Category**
Developer Tools

**Single Purpose**
Encode and decode files in Base64 locally within the browser.

**Primary Language**
English


## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ✅ Ready | icons/icon.png |
| Screenshot 1 | 1280×800 or 640×400 | ✅ Ready | assets/base64-buddy-encode.png |
| Screenshot 2 | 1280×800 or 640×400 | ✅ Ready | assets/base64-buddy-encode-file.png |
| Screenshot 3 | 1280×800 or 640×400 | ✅ Ready | assets/base64-buddy-decode-view.png |
| Screenshot 4 | 1280×800 or 640×400 | ✅ Ready | assets/base64-buddy-history-view.png |
| Screenshot 5 | 1280×800 or 640×400 | ✅ Ready | assets/base64-buddy-dark-theme-view.png |

### Screenshot Notes
- **Screenshot 1 (Encode tab - Empty):** Shows the clean layout of the Encode tab ready for drag-and-drop.
- **Screenshot 2 (Encode tab - Image Loaded):** Shows an image file successfully converted to Base64 with size, dimension metrics, and the preview panel.
- **Screenshot 3 (Decode tab):** Shows Base64 input pasted, the Data URI auto-detected, and the decoded vector/image preview visible.
- **Screenshot 4 (History tab):** Shows recent history logs stored locally with correct timestamps.
- **Screenshot 5 (Dark Mode):** Highlights the dark theme aesthetic with active Material Symbols.


## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| storage | permissions | Required to store the user's theme selection (light/dark mode) and history logs of encoded/decoded files locally and asynchronously. |
| clipboardWrite | permissions | Needed to let users copy generated Base64 strings or decoded text blocks directly to their clipboard with one click. |


## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes


## Privacy Policy

**Privacy Policy URL**
https://github.com/Kartikpatkar/base64-buddy/blob/main/PRIVACY.md


## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free


## Developer Info

**Publisher Name**
Kartik Patkar

**Contact Email**
kartikkp.assets@gmail.com

**Support URL / Email**
https://github.com/Kartikpatkar/base64-buddy/issues

**Homepage URL**
https://github.com/Kartikpatkar/base64-buddy


## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0 | 2026-06-08 | Initial MV3 release featuring safe decoding previews, memory leak protection, async extension storage, and Material Symbols styling. | Draft |


## Review Notes

### Known Issues / Limitations
- None. Fully offline capability.
