import { updateDatabase } from "./database.js";
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
            currentTime: 0,         // seconds
            file: file
        });
        saveToStorage();
        updateDatabase();
        console.log(downloads);

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
export function saveToStorage() {
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
        downloadsPlaylist.songs = [...downloads];       // copying values of downloads array to the songs array of the downloads playlist
        savePlaylists();
    }
}


export function removeSongFromDownloads(songId) {
    for (let i = 0; i < downloads.length; i++) {
        if (downloads[i].id === songId) {
            downloads.splice(i, 1);
            break;
        }
    }
    saveToStorage();
}