# 🧩 Base64 Buddy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)   
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/Kartikpatkar/base64-buddy)   
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ifliljlnfdnmagdgmomglfoimjcnpinb?label=Chrome%20Web%20Store&logo=google-chrome)](https://chromewebstore.google.com/detail/base64-buddy/pbaojpkalnecabmgnkgdpfonmafpfphh)

> **Tagline:** _Encode. Decode. Simplify._

## ✨ Overview

**Base64 Buddy** is a modern, privacy-focused Chrome Extension that allows developers and designers to **encode and decode files into Base64 format** directly within the browser.  

Whether you’re working on web integrations, Salesforce configurations, or API payloads, Base64 Buddy simplifies the entire process with a clean, responsive, and developer-friendly interface.  

You can **upload files, preview them instantly, generate Base64 strings, decode existing data**, and even copy or clear results with a single click — all while staying fully offline.  

It’s built to be fast, intuitive, and visually consistent across devices, with features like:  
- Dual panels for encoding and decoding  
- Real-time image/file preview  
- Auto-generated file info (type, size, resolution)  
- URI toggling and copy-to-clipboard support  
- Dark/light theme with smooth UI transitions  
- Persistent history and preferences stored locally  

> 🚀 **Base64 Buddy** — your trusted companion for Base64 encoding and decoding, built for precision, performance, and privacy.

---

## 🚀 Features

### 🔹 Image & Text Encoding
- **File Upload & Drag-and-Drop**: Load any file (images, documents, archives, multimedia) instantly.
- **Instant Base64 Conversion**: Converts files to clean Base64 or Data URI format immediately.
- **Global Clipboard Paste**: Press `Ctrl+V` / `Cmd+V` from anywhere to paste screenshots or files, auto-navigate to the Encode tab, and encode them instantly.
- **Payload & Size Statistics**: Real-time stats panel showing original size, Base64 size, percentage inflation, and exact character counts.
- **Download to Text**: Save the output Base64 payload directly as `_base64.txt`.
- **Dynamic Previews**: Displays image content and complete file properties (name, size, type, resolution, depth).
- **Visual Feedback**: Copy buttons animate state (`📋 Copy` -> `✅ Copied` in vibrant green for 2 seconds).

### 🔹 Image & Text Decoding
- **Automatic MIME Detection**: Extended binary parser that reads byte signatures for PNG, JPEG, GIF, SVG, WebP, PDF, BMP, ICO, ZIP, MP3, and MP4.
- **Interactive Decoded Preview**: Auto-renders plaintext contents (TXT, JSON, XML, HTML, CSV, SVG) in a monospace viewer instead of a raw download prompt.
- **JSON Format & Compress**: Format JSON structures with a built-in `Beautify JSON` / `Minify JSON` toggle.
- **Instant Binary Downloads**: Decodes files back to original binary state, automatically offering download links with proper filename extensions.
- **Real-Time History Search**: Added a search input above history lists to filter logs dynamically by filename or type.
- **Logs Exporter Utility**: Export past histories into a downloadable local JSON file.
- **One-Click Actions**: Quick copy buttons and clean interface reset buttons.

### 🔹 Smart UI/UX
- **Modern Vector Theme**: Beautiful UI powered by **Google Material Symbols (Outlined)** icons.
- **Header Actions & Help Guide**: Added a Help guide dialog overlay displaying user shortcut commands.
- **Keyboard Shortcuts Navigation**: Switch tabs instantly using `Alt+E` (Encode), `Alt+D` (Decode), `Alt+H` (History), and quick-copy active outputs using `Alt+C`.
- **Vibrant Aesthetic**: Smooth linear gradients and micro-animations with standard Inter typography.
- **Light/Dark Toggle**: Implements modern theme states with persistent local preferences.
- **Mobile Responsive**: Fully adaptive grids and side-by-side previews for small screen sizes.

---

## 📸 Screenshots

> Real screenshots from the live Chrome Extension

### 🔷 Light Mode

![Main Page - Light Theme](./assets/Main%20Page%20-%20Light%20Theme.png)
![Keyboard Shortcut - Light Theme](./assets/Keyboard%20Shortcut%20-%20Light%20Theme.png)
![History Page - Light Theme](./assets/History%20Screen%20-%20Light%20Theme.png)
![Decode Screen - Light Theme](./assets/Decode%20Screen%20-%20Light%20Theme.png)

### 🌑 Dark Mode

![Main Page - Dark Theme](./assets/Main%20Page%20-%20Dark%20Theme.png)

---

## 🛠 Built With

| Layer | Technology |
|--------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6 Modules) |
| **Design** | Custom CSS, Flexbox, Grid, Mobile Responsive Layout |
| **Storage** | `chrome.storage.local` (for history/theme retention) |
| **Icons** | Font Awesome |

---

## 📦 Installation

### ✅ Option 1: [Chrome Web Store](#)

You can install **Base64 Buddy** directly from the Chrome Web Store:

👉 [Install from Chrome Web Store](https://chromewebstore.google.com/detail/base64-buddy/pbaojpkalnecabmgnkgdpfonmafpfphh)

Once installed:
- Click the extension icon in your browser 

> ✅ No login or setup required. Works 100% offline.

### 🔧 Option 2: Load Base64 Buddy Manually in Chrome

Until it's available in the Chrome Web Store, you can load Base64 Buddy manually for development or testing:

1. **Clone or Download this Repository:**

   ```bash
   git clone https://github.com/Kartikpatkar/base64-buddy
   ```

   Or download the ZIP from GitHub and extract it.

2. **Open Chrome and go to the Extensions page:**

   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode:**

   Toggle the **Developer mode** switch in the top right corner.

4. **Click "Load unpacked":**

   - Select the root folder of the project (the one containing `manifest.json`).

5. **Done!**

    - You’ll now see Base64 Buddy in your extensions bar.
    - Click the icon to launch the extension!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork the repository and submit pull requests.

Please adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) and review [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🧠 Author Info

Built by **Kartik Patkar**  
🔗 [GitHub](https://github.com/Kartikpatkar) • [LinkedIn](https://linkedin.com/in/kartik-patkar) • [Trailhead](https://www.salesforce.com/trailblazer/kpatkar1)

---

## 📜 License

MIT License – free to use, modify, and distribute.

---

> Built for developers, by developers.  
> Base64 Buddy helps you encode and decode files seamlessly!
