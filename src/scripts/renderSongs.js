import { downloads } from "../../data/downloads.js";
import { playlists } from "../../data/playlists.js";
import { getSongFileDB } from "./dataHandling.js";
import { renderURL } from "../../data/downloads.js";

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
        button.addEventListener('click', async () => {
            const buttonId = button.id;
            playlistsContainer.innerHTML = await displaySongs(buttonId);
            console.log(downloads);
        });
    });
}


/*
    Method is responsible for displaying the songs on the screen when a playlist is clicked
*/
async function displaySongs(buttonId) {
    let html = '';
    const button = document.getElementById(`${buttonId}`);
    const playlistId = Number(button.dataset.playlistId);       // dataset.playlistId is a String

    // finding the clicked playlist
    const playlist = playlists.find(playlist => playlist.id === playlistId);
    if (!playlist) {
        console.error("Playlist with id", playlistId, "was not found");
        return html;
    }

    html += `<h1 class="text-center">${playlist.name}</div>`;

    try {
        await processSongs(playlist);       // Wait for the songs in clicked playlist to be processed
        playlist.songs.forEach((song) => {
            html += `
                <div>
                    <audio controls src=${song.url}>${song.title}</audio>
                </div>
            `;
        });
    }
    catch (error) {
        console.error("Error processing songs for playlist with the name", playlist.name, error);
    }

    console.log(html);
    return html;
}

async function processSongs(playlist) {
    for (const song of playlist.songs) {
        try {
            const songFile = await getSongFileDB(song.id);
            if (songFile) {
                const url = renderURL(songFile);
                song.url = url;
            }
            else {
                console.log("File for song with id", song.id, "could not be found in the database.");
            }
        }
        catch (error) {
            console.log("Error fetching song with id", song.id, "when processing the songs in playlist", playlist.name, error);
        }
    };
}