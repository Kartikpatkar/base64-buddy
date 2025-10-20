// utils/base64.js
function encodeFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject('Error reading file');
        reader.readAsDataURL(file);
    });
}

function decodeBase64ToBlob(base64) {
    const byteString = atob(base64.split(',')[1] || base64);
    const mimeString = base64.split(',')[0].split(':')[1]?.split(';')[0] || '';
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}
