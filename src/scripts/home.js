import { downloads } from "../../data/downloads.js";

handleDownloadButton();
handleFileSelection();

function handleDownloadButton() {
    const downloadButton = document.getElementById('js-download-button');
    downloadButton.addEventListener('click', () => {
        // We click the actual file input element that is hidden on the page
        const fileInput = document.getElementById('js-file-input');
        fileInput.click();
    });
}

function handleFileSelection() {
    const fileInput = document.getElementById('js-file-input');
    fileInput.addEventListener('change', (event) => {
        // we check the files property of the input element
        if (event.target.files[0]) {
            // we add the selected file to the downloads array
            const selectedFile = event.target.files[0];
            addFileToDownloads(selectedFile);
            localStorage.setItem('downloads', JSON.stringify(downloads));
        }
        console.log(downloads);
    });
}

function addFileToDownloads(file) {
    // Adds metada of the file object to the downloads 
    downloads.push({
        name: file.name,
        type: file.type,
        size: file.size
    });
}