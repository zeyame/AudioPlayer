export function playAudioFile(file) {
    const audioContainer = document.getElementById('js-track-playing');
    const blobUrl = URL.createObjectURL(file);
    audioContainer.innerHTML = `
        <audio controls src=${blobUrl}></audio>
    `;
}

