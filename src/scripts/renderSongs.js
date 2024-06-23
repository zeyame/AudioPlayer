import { downloads } from "../../data/downloads.js";
import { playlists } from "../../data/playlists.js";

/*
    Method handles the rendering of songs in a playlist when its clicked
    A click event listener is added to each playlist button
    When a playlist is clicked, the button id is retrieved
    We pass this id to the displaySongs function below which is responsible for the displaying part
*/

export function renderSongs() {
    const playlistsContainer = document.getElementById('js-playlists-container');
    const playlistButtons = document.querySelectorAll('.js-playlist-button');

    playlistButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const buttonId = button.id;
            playlistsContainer.innerHTML = displaySongs(buttonId);
            console.log(downloads);
        });
    });
}


/*
    Method is responsible for displaying the songs on the screen when a playlist is clicked
*/
function displaySongs(buttonId) {
    let html = '';
    const button = document.getElementById(`${buttonId}`);
    const playlistId = Number(button.dataset.playlistId);       // dataset.playlistId is a String

    // finding the clicked playlist
    playlists.forEach((playlist) => {
        if (playlist.id === playlistId) {
            html += `<h1 class="text-center">${playlist.name}</div>`;
            playlist.songs.forEach((song) => {
                html += `
                    <div>
                        <audio controls src=${song.url}>${song.name}</audio>
                    </div>
                `;
            });
        }
        console.log(html);
    });
    return html;
}