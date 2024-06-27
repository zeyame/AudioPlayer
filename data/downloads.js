import { updateDatabase } from "../src/scripts/dataHandling.js";
import { displayDownloadMessage, hideDownloadMessage } from "../src/scripts/home.js";

export const downloads = JSON.parse(localStorage.getItem('downloads')) || [];

function isFileInDownloads(file) {
    return downloads.some(existingFile => existingFile.title === file.name);     // returns true if file already exists
}


// Adds a given file to downloads
export function addFileToDownloads(file) {
    // Adds metada of the file object to the downloads 
    if (!isFileInDownloads(file)) {
        downloads.push(
            {
            title: file.name,
            file: file
        });
        saveToStorage();
        updateDatabase();
        displayDownloadMessage(file.name, true);
        setTimeout(() => {
            hideDownloadMessage();
        }, 3000);
    }
    else {
        displayDownloadMessage(file.name, false);
        setTimeout(() => {
            hideDownloadMessage();
        }, 3000);
    }
}

// saves downloads array
function saveToStorage() {
    localStorage.setItem('downloads', JSON.stringify(downloads));
}

// creates a new blob url for a given file
export function renderURL(file) {
    const blobUrl = URL.createObjectURL(file);
    return blobUrl;
}
