import { updateDatabase } from "../src/scripts/dataHandling.js";
import { displayDownloadMessage, hideDownloadMessage } from "../src/scripts/home.js";
import { getPlaylistById, savePlaylists } from "./playlists.js";
import { downloads } from "./downloadsData.js";

// unique id for every song in the downloads array
let running_id = JSON.parse(localStorage.getItem('running_id')) || 1;


function isFileInDownloads(file) {
    return downloads.some(existingFile => existingFile.title === file.name);     // returns true if file already exists
}


// Adds a given file to downloads
export function addFileToDownloads(file) {
    // Adds metada of the file object to the downloads 
    if (!isFileInDownloads(file)) {
        downloads.push(
            {
            id: running_id,
            title: file.name,
            file: file
        });
        saveToStorage();
        updateDatabase();

        // display successful download message for 3 seconds
        displayDownloadMessage(file.name, true);
        setTimeout(() => {
            hideDownloadMessage();
        }, 3000);

        // incrementing running id for the next song added to downloads
        running_id += 1;
        localStorage.setItem('running_id', JSON.stringify(running_id));
    }
    else {
        // display failed download message for 3 seconds
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

export function updateDownloadsPlaylist() {
    const downloadsPlaylist = getPlaylistById(1);
    
    if (downloadsPlaylist) {
        downloadsPlaylist.songs = [...downloads];
        savePlaylists();
    }
}