export const downloads = JSON.parse(localStorage.getItem('downloads')) || [];

export function isFileInDownloads(file) {
    for (const existingFile of downloads) {
        if (existingFile.name === file.name && existingFile.type === file.type && existingFile.size === file.size) return true;
    }

    return false;
}


export function addFileToDownloads(file) {
    // Adds metada of the file object to the downloads 
    downloads.push({
        name: file.name,
        type: file.type,
        size: file.size
    });

    saveToStorage();
}

export function saveToStorage() {
    localStorage.setItem('downloads', JSON.stringify(downloads));
}