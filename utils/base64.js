// utils/base64.js

/**
 * Encodes a file to a Base64 Data URL.
 * @param {File} file 
 * @returns {Promise<string>}
 */
export function encodeFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject('Error reading file');
        reader.readAsDataURL(file);
    });
}

/**
 * Decodes a Base64 string (with or without Data URI prefix) into a Blob.
 * @param {string} base64 
 * @returns {Blob}
 */
export function decodeBase64ToBlob(base64) {
    const parts = base64.split(',');
    const b64 = parts.length > 1 ? parts[1] : parts[0];
    const match = parts.length > 1 ? parts[0].match(/data:(.*);base64/) : null;
    const mime = match ? match[1] : 'application/octet-stream';

    const byteCharacters = atob(b64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
}

/**
 * Detects the MIME type of a Base64 string based on common file signatures.
 * @param {string} base64 
 * @returns {string}
 */
export function detectMimeTypeFromBase64(base64) {
    if (!base64) return 'application/octet-stream';
    
    // If it has a Data URI prefix, extract MIME directly
    if (base64.startsWith('data:')) {
        const match = base64.match(/data:(.*?);base64/);
        if (match) return match[1];
    }

    const cleanB64 = base64.trim().replace(/^data:.*?;base64,/, '');
    const prefix = cleanB64.slice(0, 16);

    // PNG: iVBORw0KG
    if (prefix.startsWith('iVBORw0KG')) return 'image/png';
    
    // JPEG: /9j/
    if (prefix.startsWith('/9j/')) return 'image/jpeg';
    
    // GIF: R0lGOD
    if (prefix.startsWith('R0lGOD')) return 'image/gif';
    
    // SVG: PHN2Zy (starts with <svg) or PD94bWwg (starts with <?xml)
    if (prefix.startsWith('PHN2Zy') || prefix.startsWith('PD94bWwg')) return 'image/svg+xml';
    
    // WebP: UklGR
    if (prefix.startsWith('UklGR')) return 'image/webp';
    
    // PDF: JVBERi
    if (prefix.startsWith('JVBERi')) return 'application/pdf';
    
    // BMP: Qk0
    if (prefix.startsWith('Qk0')) return 'image/bmp';
    
    // ICO: AAABAA
    if (prefix.startsWith('AAABAA')) return 'image/x-icon';

    return 'application/octet-stream';
}
