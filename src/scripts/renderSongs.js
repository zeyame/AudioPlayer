import { playlists } from "../../data/playlists.js";
import { getSongFileDB } from "./dataHandling.js";
import { downloads, renderURL } from "../../data/downloads.js";
import { renderPlaylists } from "./renderPlaylists.js";

// method renders songs on the screen when a playlist is clicked
export function renderSongs() {
    const playlistButtons = document.querySelectorAll('.js-playlist-button');       // all playlists on the screen

    playlistButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const buttonId = button.id;
            document.body.innerHTML = await displaySongs(buttonId);        // displays the songs of the clicked playlist
            handleAddSongBtn();
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
            <button id="js-exit-current-playlist" class="absolute top-4 right-6 text-lg font-bold text-gray-500 hover:text-gray-900">
                <a href="library.html">X</a>
            </button>
        </header>
        <div id="js-add-songs-modal" class="fixed inset-0 hidden z-50 overflow-auto modal-backdrop"></div>
        <div class="flex flex-row justify-center items-center mb-24">
            <button id="js-add-song-button" class="bg-black text-white px-3 py-2 rounded-lg">Add Song</button>
        </div>`;
    
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


function handleAddSongBtn() {
    const addSongBtn = document.getElementById('js-add-song-button');
    const addSongsModal = document.getElementById('js-add-songs-modal');

    // console.log(addSongBtn);
    // console.log(addSongsModal);

    addSongBtn.addEventListener('click', () => {
        // console.log('hello');
        addSongsModal.innerHTML = `
            <div class="modal-content relative p-8 bg-white m-auto flex-col flex rounded-lg">
                <div id="js-add-songs-popup" class="flex flex-col items-center justify-center h-full">
                    <button id="js-exit-add-songs-popup" class="absolute top-6 right-8 text-gray-500 hover:text-gray-900">
                        <span class="font-bold text-lg">X</span>
                    </button>
                    <h2 class="text-xl font-bold mb-4">Add Song</h2>
                    <select name="songs" id="js-add-songs-selection>
                        <option value="Zeyad">Zeyad</option>
                    </select>
                    <button id="js-add-new-song-button" class="bg-black text-white px-4 py-2 rounded">
                        Add Song
                    </button>
                </div>
            </div>
        `;

        // adds click event listeners to the exit and add new song buttons
        handlePopUpButtons();

        addSongsModal.classList.remove('hidden');
        addSongsModal.classList.add('flex');
    });
}

function generateDownloadedSongs() {
    let html = '';
    downloads.forEach((song) => {
        html += `
        <option value="${song.name}">${song.name}</option>
        `;
    });

    return html;
}

function handlePopUpButtons() {
    const addSongsModal = document.getElementById('js-add-songs-modal');
    const exitButton = document.getElementById('js-exit-add-songs-popup');
    const addSongBtn = document.getElementById('js-add-new-song-button');

    exitButton.addEventListener('click', () => {
        addSongsModal.classList.add('hidden');
        addSongsModal.classList.remove('flex');
    });

    addSongBtn.addEventListener('click', () => {
        addSongsModal.classList.add('hidden');
        addSongsModal.classList.remove('flex');
    });
}
