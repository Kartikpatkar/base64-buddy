import * as CONSTANTS from '../utils/constants.js';
import { encodeFileToBase64, decodeBase64ToBlob, detectMimeTypeFromBase64 } from '../utils/base64.js';
// -------------------------------
// State
// -------------------------------
let currentFile = null;
let decodedObjectUrl = null;
let history = [];

// -------------------------------
// Initialize
// -------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    initTabs();
    await initTheme();
    initFileHandling();
    await loadHistory();
    initFloatingButtons();
    initClearButtons();

    // Paste handler for decode textarea
    const base64Input = document.getElementById('base64Input');
    if (base64Input) {
        base64Input.addEventListener('paste', e => {
            setTimeout(() => {
                updateDecodePreview();
                updateFloatingButton('base64Input', 'copyDecoded');
            }, 100);
        });
    }
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    initFooter();
});

// -------------------------------
// Tabs
// -------------------------------
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const sections = document.querySelectorAll('.section');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(`${target}Section`).classList.add('active');
        });
    });
}

// -------------------------------
// Theme Toggle
// -------------------------------
async function initTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    const { theme = 'light' } = await chrome.storage.local.get('theme');

    if (theme === 'dark') {
        document.body.classList.add('dark');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', async () => {
        const isDark = themeSwitch.checked;
        document.body.classList.toggle('dark', isDark);
        await chrome.storage.local.set({ theme: isDark ? 'dark' : 'light' });
    });
}

// -------------------------------
// File Handling
// -------------------------------
function initFileHandling() {
    const encodeDrop = document.getElementById('encodeDrop');
    const decodeDrop = document.getElementById('decodeDrop');
    const fileInput = document.getElementById('fileInput');

    encodeDrop.addEventListener('click', () => fileInput.click());
    encodeDrop.addEventListener('dragover', e => dragOver(e));
    encodeDrop.addEventListener('dragleave', e => dragLeave(e));
    encodeDrop.addEventListener('drop', e => encodeDropFile(e));

    decodeDrop.addEventListener('dragover', e => dragOver(e));
    decodeDrop.addEventListener('dragleave', e => dragLeave(e));
    decodeDrop.addEventListener('drop', e => decodeDropFile(e));
    decodeDrop.addEventListener('click', () => openDecodeFile());

    fileInput.addEventListener('change', e => processFile(e.target.files[0]));
    document.getElementById('decodeButton').addEventListener('click', decodeBase64);
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
    document.getElementById('downloadEncoded').addEventListener('click', downloadBase64);
}

// -------------------------------
// Floating Buttons
// -------------------------------
function initFloatingButtons() {
    const encodeTextarea = document.getElementById('base64Output');
    const copyEncodedBtn = document.getElementById('copyEncoded');
    const dataUriToggle = document.getElementById('dataUriToggle');

    // Data URI Toggle for Encode
    dataUriToggle.dataset.active = 'false';
    dataUriToggle.addEventListener('click', () => {
        const isActive = dataUriToggle.dataset.active === 'true';
        dataUriToggle.dataset.active = (!isActive).toString();
        dataUriToggle.classList.toggle('active', !isActive);
        showToast(`Data URI ${!isActive ? 'enabled' : 'disabled'}`, 'info');

        // Update output if a file is already loaded
        if (currentFile) processFile(currentFile);
    });

    setupFloatingButton(encodeTextarea, copyEncodedBtn);

    // -------------------------------
    // Decode section
    const decodeTextarea = document.getElementById('base64Input');
    const copyDecodedBtn = document.getElementById('copyDecoded');

    const decodeUriToggle = document.getElementById('decodeDataUriToggle');
    decodeUriToggle.dataset.active = 'false';
    decodeUriToggle.addEventListener('click', () => {
        const isActive = decodeUriToggle.dataset.active === 'true';
        decodeUriToggle.dataset.active = (!isActive).toString();
        decodeUriToggle.classList.toggle('active', !isActive);
        showToast(`Data URI ${!isActive ? 'enabled' : 'disabled'}`, 'info');

        const textarea = document.getElementById('base64Input');
        if (!textarea.value.trim()) return;

        let val = textarea.value.trim();

        if (!isActive) {
            if (!val.startsWith('data:')) val = `data:image/jpeg;base64,${val}`;
        } else {
            if (val.startsWith('data:')) val = val.split(',')[1];
        }

        textarea.value = val;
        updateFloatingButton('base64Input', 'copyDecoded');
    });


    setupFloatingButton(decodeTextarea, copyDecodedBtn);
}

// Generic floating copy button
function setupFloatingButton(textarea, button) {
    const toggleButton = () => {
        button.style.display = textarea.value.trim() ? 'block' : 'none';
    };
    textarea.addEventListener('input', () => {
        toggleButton();
        if (textarea.id === 'base64Input') updateDecodePreview();
    });
    toggleButton();

    button.addEventListener('click', () => {
        if (!textarea.value) return;
        navigator.clipboard.writeText(textarea.value)
            .then(() => showToast('Copied to clipboard!', 'success'))
            .catch(() => showToast('Copy failed', 'error'));
    });
}

// -------------------------------
// Drag & Drop Handlers
// -------------------------------
function dragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function dragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function encodeDropFile(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
}

function decodeDropFile(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById('base64Input').value = ev.target.result;
            updateFloatingButton('base64Input', 'copyDecoded');
            updateDecodePreview();
        };
        reader.readAsText(e.dataTransfer.files[0]);
    }
}

function openDecodeFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/plain';
    input.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
                document.getElementById('base64Input').value = ev.target.result;
                updateFloatingButton('base64Input', 'copyDecoded');
                updateDecodePreview();
            };
            reader.readAsText(file);
        }
    });
    input.click();
}

// Paste handler for decode textarea
// document.getElementById('base64Input').addEventListener('paste', e => {
//     setTimeout(() => {
//         updateDecodePreview();
//         updateFloatingButton('base64Input', 'copyDecoded');
//     }, 100);
// });

// -------------------------------
// Encode File
// -------------------------------
function processFile(file) {
    if (!file) return;
    currentFile = file;

    const dataUriToggle = document.getElementById('dataUriToggle');
    const includeDataUri = dataUriToggle.dataset.active === 'true';

    encodeFileToBase64(file).then(base64WithUri => {
        let output = base64WithUri;

        if (!includeDataUri && base64WithUri.startsWith('data:')) {
            // Strip Data URI prefix
            output = base64WithUri.split(',')[1];
        }

        document.getElementById('base64Output').value = output;
        showPreview(file, base64WithUri);
        addToHistory('encode', file.name, output);
        updateFloatingButton('base64Output', 'copyEncoded');
        showToast('File encoded successfully!', 'success');
    }).catch((error) => {
        console.error(error);
        showToast('Error encoding file', 'error')
    });
}

// -------------------------------
// Preview
// -------------------------------
function showPreview(file, base64) {
    const preview = document.getElementById('preview');
    const fileInfo = document.getElementById('fileInfo');

    const previewContent = preview.querySelector('.preview-content');
    previewContent.innerHTML = ''; // clear old preview

    const extension = file.name.split('.').pop() || 'bin';

    if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = base64;
        img.alt = 'Preview';
        img.onload = () => {
            previewContent.appendChild(img);

            // Show file info
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('fileType').textContent = file.type;
            document.getElementById('fileExtension').textContent = extension;
            document.getElementById('fileSizeEncode').textContent = formatFileSize(file.size);
            document.getElementById('fileResolutionEncode').textContent = `${img.naturalWidth}×${img.naturalHeight}`;
            document.getElementById('fileBitDepthEncode').textContent = 8; // assuming 8-bit per channel
            fileInfo.style.display = 'block';
        };
    } else {
        // Non-image file
        previewContent.innerHTML = `
            <div style="text-align: center; font-size: 2rem;">📄</div>
            <div style="text-align: center;"><strong>${file.name}</strong></div>
            <div style="text-align: center; color: #64748b;">${formatFileSize(file.size)}</div>
        `;

        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileType').textContent = file.type || 'application/octet-stream';
        document.getElementById('fileExtension').textContent = extension;
        document.getElementById('fileSizeEncode').textContent = formatFileSize(file.size);
        document.getElementById('fileResolutionEncode').textContent = '-';
        document.getElementById('fileBitDepthEncode').textContent = '-';
        fileInfo.style.display = 'block';
    }
}

// -------------------------------
// Copy / Download Base64
// -------------------------------
function copyBase64() {
    const output = document.getElementById('base64Output');
    if (!output.value) return;
    navigator.clipboard.writeText(output.value)
        .then(() => showToast('Base64 copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy Base64', 'error'));
}

function downloadBase64() {
    const output = document.getElementById('base64Output');
    if (!output.value) return;

    const filename = currentFile ? currentFile.name + '_base64.txt' : 'encoded_base64.txt';
    const blob = new Blob([output.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Base64 file downloaded!', 'success');
}

// -------------------------------
// Decode Base64
// -------------------------------
function decodeBase64() {
    let input = document.getElementById('base64Input').value.trim();
    const filenameInput = document.getElementById('filename').value || 'decoded-file';
    const decodeUriToggle = document.getElementById('decodeDataUriToggle');
    const includeDataUri = decodeUriToggle.dataset.active === 'true';

    if (!input) return showToast('Please enter Base64 content', 'error');

    try {
        let base64Str = input;

        // Strip Data URI prefix if toggle is OFF
        if (!includeDataUri && base64Str.includes(',')) {
            base64Str = base64Str.split(',')[1];
        }

        // Determine MIME type for preview
        let mime = detectMimeTypeFromBase64(input);

        // Always pass proper Data URI to preview
        const previewBase64 = base64Str.startsWith('data:')
            ? base64Str
            : `data:${mime};base64,${base64Str}`;

        showDecodedPreview(previewBase64, filenameInput);

        // Blob for download
        const blob = decodeBase64ToBlob(previewBase64);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filenameInput;
        a.click();
        URL.revokeObjectURL(url);

        addToHistory('decode', filenameInput, input);
        updateFloatingButton('base64Input', 'copyDecoded');
        showToast('File decoded and downloaded!', 'success');
    } catch {
        showToast('Invalid Base64 content', 'error');
    }
}

// -------------------------------
// Decode Preview + File Info
// -------------------------------
function showDecodedPreview(base64, filename) {
    const preview = document.getElementById('decodedPreview');
    const fileInfo = document.getElementById('decodedFileInfo');

    // Only target .preview-content, don't overwrite preview container
    const previewContent = preview.querySelector('.preview-content');
    previewContent.innerHTML = ''; // now safe

    try {
        const mimeType = base64.startsWith('data:') ? base64.split(':')[1].split(';')[0] : 'application/octet-stream';
        const extension = mimeType.split('/')[1] || 'bin';

        const blob = decodeBase64ToBlob(base64);
        const size = formatFileSize(blob.size);

        if (decodedObjectUrl) {
            URL.revokeObjectURL(decodedObjectUrl);
            decodedObjectUrl = null;
        }
        decodedObjectUrl = URL.createObjectURL(blob);

        if (mimeType.startsWith('image/')) {
            const img = new Image();
            img.onload = () => {
                previewContent.appendChild(img);

                // Show file info
                document.getElementById('fileResolution').textContent = `${img.naturalWidth}×${img.naturalHeight}`;
                document.getElementById('fileMimeType').textContent = mimeType;
                document.getElementById('fileExtension').textContent = extension;
                document.getElementById('fileSize').textContent = size;
                document.getElementById('fileDownloadLink').href = decodedObjectUrl;
                document.getElementById('fileDownloadLink').download = filename;
                document.getElementById('fileDownloadLink').textContent = filename;
                document.getElementById('fileBitDepth').textContent = 8;
                fileInfo.style.display = 'block';
            };
            img.onerror = () => {
                previewContent.innerHTML = `
                    <div style="font-size: 2rem; text-align: center;">⚠️</div>
                    <div style="text-align: center; color: #ef4444;"><strong>Failed to load image preview</strong></div>
                    <div style="text-align: center; color: #64748b; font-size: 0.9rem;">Invalid image data format.</div>
                `;
                fileInfo.style.display = 'none';
            };
            img.src = base64;
            img.alt = 'Decoded Preview';
        } else {
            // Check if the decoded content is plaintext
            blob.text().then(text => {
                const isText = !/[\x00-\x08\x0E-\x1F]/.test(text.slice(0, 1000));
                if (isText) {
                    previewContent.innerHTML = `
                        <div class="text-preview-container" style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                            <textarea id="decodedTextOutput" readonly class="decoded-text-area" style="width: 100%; min-height: 120px; font-family: monospace; font-size: 0.9rem; resize: vertical;"></textarea>
                            <button id="copyDecodedTextBtn" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.9rem; align-self: flex-end;">📋 Copy Text</button>
                        </div>
                    `;
                    const textarea = document.getElementById('decodedTextOutput');
                    textarea.value = text;
                    document.getElementById('copyDecodedTextBtn').addEventListener('click', () => {
                        navigator.clipboard.writeText(text)
                            .then(() => showToast('Decoded text copied!', 'success'))
                            .catch(() => showToast('Copy failed', 'error'));
                    });
                } else {
                    previewContent.innerHTML = `
                        <div style="font-size: 2rem; text-align: center;">📄</div>
                        <div style="text-align: center;"><strong>${filename}</strong></div>
                        <div style="text-align: center; color: #64748b;">Binary file - Ready to download</div>
                    `;
                }
            }).catch(() => {
                previewContent.innerHTML = `
                    <div style="font-size: 2rem; text-align: center;">📄</div>
                    <div style="text-align: center;"><strong>${filename}</strong></div>
                    <div style="text-align: center; color: #64748b;">Ready to download</div>
                `;
            });

            document.getElementById('fileResolution').textContent = '-';
            document.getElementById('fileMimeType').textContent = mimeType;
            document.getElementById('fileExtension').textContent = extension;
            document.getElementById('fileSize').textContent = size;
            document.getElementById('fileDownloadLink').href = decodedObjectUrl;
            document.getElementById('fileDownloadLink').download = filename;
            document.getElementById('fileDownloadLink').textContent = filename;
            document.getElementById('fileBitDepth').textContent = '-';
            fileInfo.style.display = 'block';
        }
    } catch (error) {
        previewContent.innerHTML = '<div class="preview-placeholder">Enter valid Base64 string to see preview</div>';
        fileInfo.style.display = 'none';
    }
}







function updateDecodePreview() {
    const textarea = document.getElementById('base64Input');
    const val = textarea.value.trim();
    const preview = document.getElementById('decodedPreview');

    if (!val) {
        preview.innerHTML = '<div class="preview-placeholder">Decoded content preview will appear here</div>';
        return;
    }

    // Auto-detect and enable Data URI header if present
    const decodeUriToggle = document.getElementById('decodeDataUriToggle');
    if (val.startsWith('data:') && decodeUriToggle.dataset.active === 'false') {
        decodeUriToggle.dataset.active = 'true';
        decodeUriToggle.classList.add('active');
        showToast('Data URI header auto-detected and enabled!', 'success');
    }

    // Always construct a Data URI for preview
    const detectedMime = detectMimeTypeFromBase64(val);
    let previewBase64 = val.startsWith('data:') ? val : `data:${detectedMime};base64,${val.includes(',') ? val.split(',')[1] : val}`;

    showDecodedPreview(previewBase64, 'Preview');
}


// -------------------------------
// History
// -------------------------------
async function addToHistory(type, filename, content) {
    const item = {
        type,
        filename,
        content: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
        timestamp: new Date().toLocaleString()
    };
    history.unshift(item);
    if (history.length > 50) history = history.slice(0, 50);
    await chrome.storage.local.set({ base64History: history });
    await loadHistory();
}

async function loadHistory() {
    const list = document.getElementById('historyList');
    const { base64History = [] } = await chrome.storage.local.get('base64History');
    history = base64History;
    if (!history.length) {
        list.innerHTML = '<div class="preview-placeholder">No history items yet</div>';
        return;
    }
    list.innerHTML = history.map(i => `
        <div class="history-item">
            <div class="history-header">
                <span class="history-type">${i.type.toUpperCase()}</span>
                <span class="history-time">${i.timestamp}</span>
            </div>
            <div style="margin-bottom:10px;font-weight:600">${i.filename}</div>
            <div class="history-content">${i.content}</div>
        </div>
    `).join('');
}

async function clearHistory() {
    history = [];
    await chrome.storage.local.remove('base64History');
    await loadHistory();
    showToast('History cleared!', 'success');
}

// -------------------------------
// Toast Notifications
// -------------------------------
function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// -------------------------------
// Utility
// -------------------------------
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateFloatingButton(textareaId, buttonId) {
    const textarea = document.getElementById(textareaId);
    const button = document.getElementById(buttonId);
    if (!textarea || !button) return;
    button.style.display = textarea.value.trim() ? 'block' : 'none';
}


// -------------------
// Clear Data Buttons
// -------------------
function initClearButtons() {

    const clearEncodeBtn = document.getElementById('clearEncode');
    if (clearEncodeBtn) {
        clearEncodeBtn.addEventListener('click', () => {
            currentFile = null;
            const fileInput = document.getElementById('fileInput');
            fileInput.value = '';
            document.getElementById('base64Output').value = '';
            const preview = document.getElementById('preview');
            preview.innerHTML = '<div class="preview-content"><div class="preview-placeholder">File preview will appear here</div></div>';
            const fileInfo = document.getElementById('fileInfo');
            fileInfo.style.display = 'none';
            document.getElementById('fileName').textContent = '-';
            document.getElementById('fileType').textContent = '-';
            document.getElementById('fileExtension').textContent = '-';
            document.getElementById('fileSizeEncode').textContent = '-';
            document.getElementById('fileResolutionEncode').textContent = '-';
            document.getElementById('fileBitDepthEncode').textContent = '-';
            updateFloatingButton('base64Output', 'copyEncoded');
            const dataUriToggle = document.getElementById('dataUriToggle');
            dataUriToggle.dataset.active = 'false';
            dataUriToggle.classList.remove('active');
            showToast('Encode section cleared!', 'success');
        });
    }

    const clearDecodeBtn = document.getElementById('clearDecode');
    if (clearDecodeBtn) {
        clearDecodeBtn.addEventListener('click', () => {
            document.getElementById('base64Input').value = '';
            document.getElementById('filename').value = '';
            const preview = document.getElementById('decodedPreview');
            preview.innerHTML = '<div class="preview-content"><div class="preview-placeholder">File preview will appear here</div></div>';
            const fileInfo = document.getElementById('decodedFileInfo');
            fileInfo.style.display = 'none';
            document.getElementById('fileResolution').textContent = '-';
            document.getElementById('fileMimeType').textContent = '-';
            document.getElementById('fileExtension').textContent = '-';
            document.getElementById('fileSize').textContent = '-';
            document.getElementById('fileDownloadLink').href = '#';
            document.getElementById('fileDownloadLink').textContent = '-';
            document.getElementById('fileBitDepth').textContent = '-';
            updateFloatingButton('base64Input', 'copyDecoded');
            const decodeUriToggle = document.getElementById('decodeDataUriToggle');
            decodeUriToggle.dataset.active = 'false';
            decodeUriToggle.classList.remove('active');
            if (decodedObjectUrl) {
                URL.revokeObjectURL(decodedObjectUrl);
                decodedObjectUrl = null;
            }
            showToast('Decode section cleared!', 'success');
        });
    }

}

function initFooter() {
    // index.js (after DOM loaded)
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    document.getElementById('authorDisplay').textContent = CONSTANTS.AUTHOR.name;
    document.getElementById('copyright').textContent = CONSTANTS.COPYRIGHT;
    document.getElementById('footerTitle').textContent = CONSTANTS.TITLE;
    document.getElementById('tagline').textContent = CONSTANTS.TAGLINE;
    document.querySelector('.footer-link.github').href = CONSTANTS.AUTHOR.github;
    document.querySelector('.footer-link.linkedin').href = CONSTANTS.AUTHOR.linkedin;
    document.querySelector('.footer-link.trailhead').href = CONSTANTS.AUTHOR.trailhead;
    document.querySelector('.footer-link.email').href = `mailto:${CONSTANTS.AUTHOR.email}`;
}