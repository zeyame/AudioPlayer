import { updateDatabase } from "../src/scripts/dataHandling.js";

let running_id = JSON.parse(localStorage.getItem('running_id')) || 1;

export const downloads = JSON.parse(localStorage.getItem('downloads')) || [];

export function isFileInDownloads(file) {
    return downloads.some(existingFile => existingFile.name === file.name);
}


export function addFileToDownloads(file) {
    // Adds metada of the file object to the downloads 
    if (!isFileInDownloads(file)) {
        downloads.push(
            {
            id: running_id,
            playlist_id: downloads.id,
            title: file.name,
            file: file
        });
        saveToStorage();
        updateDatabase();
        running_id += 1;
        localStorage.setItem('running_id', JSON.stringify(running_id));
    }
}

function saveToStorage() {
    localStorage.setItem('downloads', JSON.stringify(downloads));
}


export function renderURL(file) {
    const blobUrl = URL.createObjectURL(file);
    return blobUrl;
}