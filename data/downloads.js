let running_id = JSON.parse(localStorage.getItem('running_id')) || 1;

export const downloads = JSON.parse(localStorage.getItem('downloads')) || [];

export function isFileInDownloads(file) {
    for (const existingFile of downloads) {
        if (existingFile.title === file.name) return true;
    }
    return false;
}


export function addFileToDownloads(file) {
    // Adds metada of the file object to the downloads 
    console.log(isFileInDownloads(file));
    if (!isFileInDownloads(file)) {
        downloads.push({
            id: running_id,
            title: file.name,
            type: file.type,
            size: file.size,
            url: getURL(file)
        });
        saveToStorage();
        running_id += 1;
        localStorage.setItem('running_id', JSON.stringify(running_id));
    }
}

export function saveToStorage() {
    localStorage.setItem('downloads', JSON.stringify(downloads));
}

function getURL(file) {
    const blobUrl = URL.createObjectURL(file);
    return blobUrl;
}