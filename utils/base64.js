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
