// -------------------------------
// State
// -------------------------------
let currentFile = null;
let history = JSON.parse(localStorage.getItem('base64History') || '[]');

// -------------------------------
// Initialize
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initTheme();
    initFileHandling();
    loadHistory();

    // Delay floating button init to ensure DOM is ready
    setTimeout(initFloatingButtons, 100);
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
function initTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', () => {
        const isDark = themeSwitch.checked;
        document.body.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
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

    document.getElementById('copyBase64').addEventListener('click', copyBase64);
    document.getElementById('downloadBase64').addEventListener('click', downloadBase64);
    document.getElementById('decodeButton').addEventListener('click', decodeBase64);
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
}

function initFloatingButtons() {
    const pairs = [
        { textarea: 'base64Output', button: 'copyEncoded' },
        { textarea: 'base64Input', button: 'copyDecoded' }
    ];

    pairs.forEach(({ textarea: tId, button: bId }) => {
        const textarea = document.getElementById(tId);
        const button = document.getElementById(bId);

        if (!textarea || !button) return;

        // Show/hide button when content changes
        const toggleButton = () => {
            button.style.display = textarea.value.trim() ? 'block' : 'none';
        };

        textarea.addEventListener('input', toggleButton);
        toggleButton(); // initial check

        // Copy functionality
        button.addEventListener('click', () => {
            if (!textarea.value) return;
            navigator.clipboard.writeText(textarea.value)
                .then(() => showToast('Copied to clipboard!', 'success'))
                .catch(() => showToast('Copy failed', 'error'));
        });
    });
}

function updateFloatingButton(textareaId, buttonId) {
    const textarea = document.getElementById(textareaId);
    const button = document.getElementById(buttonId);
    if (!textarea || !button) return;

    button.style.display = textarea.value.trim() ? 'block' : 'none';
}

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
        reader.onload = (ev) => document.getElementById('base64Input').value = ev.target.result;
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
            };
            reader.readAsText(file);
        }
    });
    input.click();
}

document.getElementById('base64Input').addEventListener('paste', e => {
    setTimeout(() => {
        const val = e.target.value.trim();
        if (val.startsWith('data:image/')) showDecodedPreview(val, 'Preview');
        updateFloatingButton('base64Input', 'copyDecoded');
    }, 100);
});

// -------------------------------
// Encode File
// -------------------------------
function processFile(file) {
    if (!file) return;

    currentFile = file;
    const includeDataUri = document.getElementById('includeDataUri').checked;

    encodeFileToBase64(file).then(base64 => {
        let output = base64;
        if (includeDataUri && file.type) {
            output = `data:${file.type};base64,${base64}`;
        }

        document.getElementById('base64Output').value = output;
        showPreview(file, output);
        addToHistory('encode', file.name, output);
        updateFloatingButton('base64Output', 'copyEncoded');
        showToast('File encoded successfully!', 'success');
    }).catch(() => showToast('Error encoding file', 'error'));
}

// -------------------------------
// Preview
// -------------------------------
function showPreview(file, base64) {
    const preview = document.getElementById('preview');
    if (file.type.startsWith('image/')) {
        preview.innerHTML = `<img src="${base64}" alt="Preview">`;
    } else {
        preview.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 10px;">📄</div>
                <div><strong>${file.name}</strong></div>
                <div style="color: #64748b; font-size: 0.9rem;">${formatFileSize(file.size)}</div>
            </div>
        `;
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

    const filename = currentFile ? currentFile.name + '.base64' : 'encoded.base64';
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
    const hasDataUri = document.getElementById('decodeHasDataUri').checked;

    if (!input) return showToast('Please enter Base64 content', 'error');

    try {
        if (hasDataUri && input.includes(',')) {
            input = input.split(',')[1]; // strip data:image/...;base64,
        }

        const blob = decodeBase64ToBlob(input);
        showDecodedPreview(input, filenameInput);

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

function showDecodedPreview(base64, filename) {
    const preview = document.getElementById('decodedPreview');
    if (base64.startsWith('data:image/')) {
        preview.innerHTML = `<img src="${base64}" alt="Decoded Preview">`;
    } else {
        preview.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 10px;">✅</div>
                <div><strong>${filename}</strong></div>
                <div style="color: #64748b; font-size: 0.9rem;">Ready to download</div>
            </div>
        `;
    }
}

// -------------------------------
// History
// -------------------------------
function addToHistory(type, filename, content) {
    const item = {
        type,
        filename,
        content: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
        timestamp: new Date().toLocaleString()
    };
    history.unshift(item);
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem('base64History', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const list = document.getElementById('historyList');
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

function clearHistory() {
    history = [];
    localStorage.removeItem('base64History');
    loadHistory();
    showToast('History cleared!', 'success');
}

// -------------------------------
// Toast Notifications (New)
// -------------------------------
function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    // Auto remove after animation
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
