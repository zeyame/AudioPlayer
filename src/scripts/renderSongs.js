import { playlists } from "../../data/playlists.js";
import { getSongFileDB } from "./dataHandling.js";
import { renderURL } from "../../data/downloads.js";

// method renders songs on the screen when a playlist is clicked
export function renderSongs() {
    const playlistButtons = document.querySelectorAll('.js-playlist-button');       // all playlists on the screen

    playlistButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const buttonId = button.id;
            document.body.innerHTML = await displaySongs(buttonId);        // displays the songs of the clicked playlist
            // console.log(downloads);
        });
    });
}


// helper method to renderSongs which generates the HTML for the audio files inside a clicked playlist
async function displaySongs(buttonId) {
    let songsHTML = '';
    const button = document.getElementById(`${buttonId}`);
    const playlistId = Number(button.dataset.playlistId);       // dataset.playlistId is a String

    // finding the clicked playlist
    const playlist = playlists.find(playlist => playlist.id === playlistId);            // returns the playlist object if found

    // if playlist does not exist 
    if (!playlist) {
        console.error("Playlist with id", playlistId, "was not found");
        return songsHTML;
    }

    songsHTML += `
        <header class="w-full bg-white py-4 shadow-md">
            <h1 class="text-center text-xl font-bold">${playlist.name}</h1>
        </header>`;

    // try-catch block used as processSongs may throw an unexpected error
    try {
        await processSongs(playlist);       // Wait for the songs in clicked playlist to be processed (new blob urls generated)
        playlist.songs.forEach((song) => {
            songsHTML += `
                <div class="flex items-center w-full">
                    <audio controls class="w-1/2 bg-gray-200 rounded-lg p-2">
                        <source src="${song.url}" type="audio/mp3">
                    </audio>
                    <div class="ml-4">
                        <p class="text-lg font-semibold">${song.title}</p>
                        <p class="text-gray-500">${song.duration}</p>
                    </div>
                </div>
            `;
        });
    }
    catch (error) {
        console.error("Error processing songs for playlist with the name", playlist.name, error);
    }

    // console.log(songsHTML);
    return songsHTML;
}

// function generates duration and new URLs for song files in a playlist
// function is async as await needs to be used for getSongFileDB which returns a promise
async function processSongs(playlist) {
    for (const song of playlist.songs) {

        // try-catch is utilized as getSongFileDB may throw unexpected errors when querying the database for the file
        try {
            const songFile = await getSongFileDB(song.id);

            // if file is not null, we use renderURL() from downloads.js to create a new URL
            if (songFile) {
                const url = renderURL(songFile);
                song.url = url;
                song.duration = '2:30';
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