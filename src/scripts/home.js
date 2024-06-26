import { downloads, addFileToDownloads } from "../../data/downloads.js";

console.log(downloads);
handleDownloadButton();
handleFileSelection();


// Method handles the click on the download button
function handleDownloadButton() {
    const downloadButton = document.getElementById('js-download-button');
    downloadButton.addEventListener('click', () => {
        // We click the actual file input element that is hidden on the page
        const fileInput = document.getElementById('js-file-input');
        fileInput.click();
    });
}

// Method handles the change in value of the input file element
function handleFileSelection() {
    // retrieving the selected file
    const fileInput = document.getElementById('js-file-input');
    fileInput.addEventListener('change', (event) => {
        // we check the files property of the input element
        if (event.target.files[0]) {
            // we add the selected file to the downloads array if it is not there already
            const selectedFile = event.target.files[0];
            addFileToDownloads(selectedFile);       // adds file and saves to local storage
            console.log(downloads);
        }
    });
}

function handleLibraryButton() {
    const libraryBtn = document.getElementById('js-library-button');
    libraryBtn.addEventListener('click', () => {
        
    })
}
