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

    const cleanB64 = base64.trim().replace(/^data:.*?;base64,/, '').replace(/\s/g, '');
    if (!cleanB64) return 'application/octet-stream';

    // 1. Check known base64 string prefix shortcuts first (fast paths)
    const prefix = cleanB64.slice(0, 16);
    if (prefix.startsWith('iVBORw0KG')) return 'image/png';
    if (prefix.startsWith('/9j/')) return 'image/jpeg';
    if (prefix.startsWith('R0lGOD')) return 'image/gif';
    if (prefix.startsWith('UklGR')) return 'image/webp';
    if (prefix.startsWith('JVBERi')) return 'application/pdf';
    if (prefix.startsWith('Qk0')) return 'image/bmp';
    if (prefix.startsWith('AAABAA')) return 'image/x-icon';

    // 2. Decode the first 64-80 characters safely to detect binary & text signatures
    try {
        const len = Math.floor(Math.min(cleanB64.length, 80) / 4) * 4;
        if (len > 0) {
            const decodedPrefix = atob(cleanB64.slice(0, len));
            const trimmed = decodedPrefix.trim();
            
            // Check structured text documents
            if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'application/json';
            if (trimmed.toLowerCase().startsWith('<!doctype html') || trimmed.toLowerCase().startsWith('<html')) return 'text/html';
            if (trimmed.startsWith('<?xml') || trimmed.startsWith('<xml')) {
                if (trimmed.includes('<svg')) return 'image/svg+xml';
                return 'application/xml';
            }
            if (trimmed.startsWith('<svg') || trimmed.includes('<svg')) return 'image/svg+xml';

            // Check binary signatures in decoded prefix
            // ZIP: PK\x03\x04
            if (decodedPrefix.startsWith('PK\x03\x04')) return 'application/zip';
            
            // BMP: BM
            if (decodedPrefix.startsWith('BM')) return 'image/bmp';

            // ICO: \x00\x00\x01\x00
            if (decodedPrefix.startsWith('\x00\x00\x01\x00')) return 'image/x-icon';

            // MP4 box "ftyp" check
            if (decodedPrefix.includes('ftyp')) return 'video/mp4';

            // MP3: ID3 or frame sync
            if (decodedPrefix.startsWith('ID3') || 
                decodedPrefix.startsWith('\xFF\xFB') || 
                decodedPrefix.startsWith('\xFF\xF3') || 
                decodedPrefix.startsWith('\xFF\xF2')) {
                return 'audio/mpeg';
            }
        }
    } catch (e) {
        // Fallback to raw string checks
    }

    // Secondary raw string checks as fallback
    if (prefix.startsWith('PHN2Zy') || prefix.startsWith('PD94bWwg')) return 'image/svg+xml';
    if (prefix.startsWith('UEsDBB')) return 'application/zip';
    if (prefix.startsWith('SUQz')) return 'audio/mpeg';

    return 'application/octet-stream';
}
