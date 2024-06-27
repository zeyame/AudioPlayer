import { downloads, addFileToDownloads } from "../../data/downloads.js";
// import { updateDatabase } from "./dataHandling.js";

// updateDatabase();


// function handles the click on the download button
function handleDownloadButton() {
    const downloadButton = document.getElementById('js-download-button');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            // We click the actual file input element that is hidden on the page
            const fileInput = document.getElementById('js-file-input');
            fileInput.click();
        });
    }
}

// function handles the change in value of the input file element
function handleFileSelection() {
    // retrieving the selected file
    const fileInput = document.getElementById('js-file-input');

    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            // we check the files property of the input element
            if (event.target.files[0]) {
                const selectedFile = event.target.files[0];
                addFileToDownloads(selectedFile);       // adds the new file to downloads, saves to storage, updates database
                // console.log(downloads);
            }
        });
    }
}


export function displayDownloadMessage(songName, success) {
    const messageElement = document.getElementById('js-download-message');
    success ? messageElement.innerHTML = `You have successfully downloaded ${songName}` : messageElement.innerHTML = `Could not download ${songName}`;
}

export function hideDownloadMessage() {
    const messageElement = document.getElementById('js-download-message');
    messageElement.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    handleFileSelection();
    handleDownloadButton();
});

