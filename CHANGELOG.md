# Changelog

All notable changes to this project are documented in this file.

## [1.0.0] - 2026-06-08

### Added
- **Google Material Symbols (Outlined)**: Swapped out all system emojis with polished vector icons for a premium UI aesthetic.
- **Plaintext Decoded Preview**: Added an auto-rendering plaintext preview textarea with a quick "Copy Text" button for decoded textual strings (TXT, JSON, XML, HTML, CSV, SVG).
- **JSON Beautifier & Minifier Toggle**: Added formatting utility directly inside the plaintext preview box to format or compress decoded JSON structures.
- **Global Clipboard File Paste**: Integrated global paste (`Ctrl+V` / `Cmd+V`) file handling that automatically shifts focus to the Encode tab, generates previews, computes size/char metrics, and runs Base64 encoding.
- **Detailed Size & Character Statistics**: Introduced a grid statistics panel showing original size, Base64 size, percentage payload inflation, and base64 character counts.
- **Copy Success Animations**: Animated all copy button feedback visually (`📋 Copy` -> `✅ Copied` in vibrant green for 2 seconds).
- **Keyboard Shortcuts Interface**: Integrated quick navigation and command mappings: `Alt+E` (Encode), `Alt+D` (Decode), `Alt+H` (History), and `Alt+C` (Copy Output).
- **Shortcuts Help Guide Modal**: Placed a new help icon button in the header that opens an overlay modal showing active keyboard mappings.
- **Real-Time History Filtering**: Added a history search input to filter stored log items instantly by filename or type.
- **JSON Log History Exporter**: Introduced an Export History utility to download the past logs list locally as a JSON file.
- **Download Encoded Base64 File**: Added a button under the Encode tab actions that downloads generated Base64 strings directly as `[filename]_base64.txt`.
- **MIME Type Auto-Detection**: Implemented an advanced base64 signature parser matching PNG, JPEG, GIF, SVG, WebP, PDF, BMP, ICO, ZIP, MP3, and MP4.
- **Data URI Auto-Detection**: Paste standard base64 strings containing Data URIs and the extension will automatically highlight and toggle the URI settings.

### Changed
- **Chrome Storage Migration**: Migrated theme configuration and encoding/decoding logs from synchronous web `localStorage` to asynchronous extension `chrome.storage.local`.
- **Modern ES6 Modular Architecture**: Converted `utils/base64.js` to an ES module and imported it directly inside `app/index.js`, removing the global script element wrapper in `app/index.html`.

### Fixed
- **macOS Alt-Key Conflict Resolution**: Switched key event parsing from layout-dependent `event.key` to physical key `event.code` checks to prevent Mac dead-key (accent characters) override issues.
- **Non-Image Size Display Cleanup**: Removed the duplicate file size label inside the left preview panel for non-image files.
- **atob() Input Crashes**: Wrapped decoding inside `showDecodedPreview` in a `try-catch` block, preventing unhandled `DOMException` failures while typing.
- **Object URL Memory Leaks**: Implemented transition state tracking to revoke old Object URLs (`URL.revokeObjectURL(url)`) when previews change or clear actions are executed.
- **Static Toast Page-Load Shifts**: Removed redundant empty static toast markup inside `index.html` that caused empty layout flashes on initial page load.
- **Permissions Cleanup**: Scoped manifest permissions to follow CWS Least Privilege guidelines (removed unnecessary `"tabs"` and `web_accessible_resources` configurations).
- **Salesforce Leftovers**: Cleansed the codebase docs (`README.md`, `PRIVACY.md`, and `CONTRIBUTING.md`) of SLDS Icon Kit and Apex-generation copy-paste remnants.
- **Font & Asset Localization**: Localized the Google Material Symbols font file (`material-symbols-outlined.ttf`) and replaced Font Awesome with lightweight inline SVGs (for brand icons) and native Material Symbols. This completely removes external CDNs and secures 100% offline functionality under Manifest V3 CSP.
- **DOM XSS Sanitization**: Introduced an HTML escaping helper utility and secured all dynamic variable assignments via `innerHTML` (`file.name`, `filename`, `history.filename`, `history.content`, and `toast` messages) to pass security audits.
