# 🧩 Base64 Buddy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)   
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/Kartikpatkar/base64-buddy)   
<!-- [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ifliljlnfdnmagdgmomglfoimjcnpinb?label=Chrome%20Web%20Store&logo=google-chrome)](https://chromewebstore.google.com/detail/icons-kit-for-salesforce/pgjeeljfclipedfnlojjchmmilddiaje) -->

<!-- > **Tagline**: *Browse, preview, customize, and copy SLDS icons like a pro.* -->

<!-- ## ✨ Overview

**Icons Kit for Salesforce Developer** is a full-tab Chrome Extension built for Salesforce Admins, Developers, and Architects. It provides a lightning-fast, beautifully designed interface to explore the full SLDS icon set — including Utility, Standard, Action, Custom, and Doctype categories.

No more hunting down SVGs, guessing `icon-name`s, or fiddling with styling. With this tool, you can **instantly preview**, **customize**, and **copy** icons in LWC, Aura, or raw HTML/SVG formats.

--- -->

## 🚀 Features

### 🔹 Image & Text Encoding
- Upload any image file (JPG, PNG, GIF, etc.) or enter text manually  
- Instantly convert to Base64 format  
- Displays real-time **file details** (name, size, type, dimensions)  
- Responsive **image preview** with correct aspect ratio  
- Copy Base64 output with one click  
- Clear data option to reset everything cleanly

### 🔹 Image & Text Decoding
- Paste Base64 string or upload `.txt` files containing encoded data  
- Auto-detects and decodes Base64 into image or text  
- Displays decoded **image preview and metadata**  
- Error handling and visual toasts for invalid data  
- Clear data option to start fresh

### 🔹 Smart UI/UX
- Fully **mobile responsive** preview and layout  
- Intuitive tab switching for Encode / Decode modes  
- Real-time toast notifications for user feedback  
- Modern dark-themed interface  
- Detailed footer with author info and social links

---

## 📸 Screenshots

> Real screenshots from the live Chrome Extension

### 🔷 Light Mode

![Light Mode - Icon Browser](./assets/screenshots/icon-browser-light.png)
![Light Mode - Icon Details](./assets/screenshots/icon-details-light.png)

### 🌑 Dark Mode

![Dark Mode - Icon Browser](./assets/screenshots/icon-browser-dark.png)
![Dark Mode - Code Customizer](./assets/screenshots/code-customizer-dark.png)

---

## 🛠 Built With

| Layer | Technology |
|--------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6 Modules) |
| **Design** | Custom CSS, Flexbox, Grid, Mobile Responsive Layout |
| **Storage** | `localStorage` (for history retention) |
| **Icons** | Font Awesome |

---

## 📦 Installation

### ✅ Option 1: [Chrome Web Store](#)

You can install **Base64 Buddy** directly from the Chrome Web Store:

👉 [Install from Chrome Web Store](https://chrome.google.com/webstore/detail/icons-kit-for-salesforce/pgjeeljfclipedfnlojjchmmilddiaje)

Once installed:
- Click the extension icon in your browser 

> ✅ No login or setup required. Works 100% offline.

### 🔧 Option 2: Load Base64 Buddy Manually in Chrome

Until it's available in the Chrome Web Store, you can load SLDS Icons Kit manually for development or testing:

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
   - Click the icon to launch and start generating Apex!

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

> Built for Salesforce developers, by Salesforce developers.  
> Icon Kit helps you make better Salesforce Components, faster!