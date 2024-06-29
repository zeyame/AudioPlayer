import { getPlaylist, playlists, addSong, getPlaylistById, isSongInPlaylist } from "../../data/playlists.js";
import { getSongFileDB, updateDatabase } from "./dataHandling.js";
import { renderURL } from "../../data/downloads.js";
import { downloads } from "../../data/downloadsData.js";

// method renders songs on the screen when a playlist is clicked
export function renderSongs() {
    const playlistButtons = document.querySelectorAll('.js-playlist-button');       // all playlists on the screen
    console.log(playlistButtons);
    playlistButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const playlistId = Number(button.dataset.playlistId);
            document.body.innerHTML = await displaySongs(playlistId);        // displays the songs of the clicked playlist

            // if the playlist clicked was not downloads playlist
            if (playlistId !== 1) {
                handleAddSongBtn();
                // console.log(playlists[0].songs);
                // console.log(playlists[1].songs);
            }
            // console.log(downloads);
        });
    });
}


async function displaySongs(playlistId) {
    let songsHTML = '';

    const playlist = playlists.find(playlist => playlist.id === playlistId);

    if (!playlist) {
        console.error("Playlist with id", playlistId, "was not found");
        return songsHTML;
    }

    songsHTML += `
        <div class="flex flex-col min-h-screen w-full">
            <header class="w-full bg-white py-4 shadow-md">
                <h1 id="js-playlist-name-header" class="text-center text-xl font-bold">${playlist.name}</h1>
                <button id="js-exit-current-playlist" class="absolute top-4 right-6 text-lg font-bold text-gray-500 hover:text-gray-900">
                    <a href="library.html">X</a>
                </button>
            </header>
            <div id="js-add-songs-modal" class="fixed inset-0 hidden z-50 overflow-auto modal-backdrop"></div>
            <div class="flex-grow overflow-y-auto">
                <div id="js-songs-container" class="flex flex-col w-2/3 mx-auto">
    `;

    try {
        await processSongs(playlist);
        playlist.songs.forEach((song, index) => {
            songsHTML += `
                <div class="flex items-center w-full py-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer song-row" data-song-id="${song.id}">
                    <button class="play-pause-btn mr-4 focus:outline-none" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <div class="flex-grow">
                        <p class="text-lg font-semibold">${song.title}</p>
                        <p class="text-sm text-gray-500">${song.duration}</p>
                    </div>
                    <audio class="hidden" src="${song.url}"></audio>
                </div>
            `;
        });
    }
    catch (error) {
        console.error("Error processing songs for playlist with the name", playlist.name, error);
    }

    songsHTML += `
                </div>
            </div>`;

    if (playlist.name !== 'Downloads') {
        songsHTML += `
            <div class="flex justify-center items-center py-4 mb-20">
                <button id="js-add-song-button" class="bg-black text-white px-3 py-2 rounded-lg" data-playlist-id="${playlistId}">Add Song</button>
            </div>
        `;
    }

    songsHTML += `</div>`;

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

    addSongBtn.addEventListener('click', () => {
        addSongsModal.innerHTML = `
            <div class="modal-content relative p-8 bg-white m-auto flex-col flex rounded-lg">
                <div id="js-add-songs-popup" class="flex flex-col items-center justify-center h-full">
                    <button id="js-exit-add-songs-popup" class="absolute top-6 right-8 text-gray-500 hover:text-gray-900">
                        <span class="font-bold text-lg">X</span>
                    </button>
                    <h2 class="text-xl font-bold mb-4">Add Song</h2>
                    <div class="song-list-container overflow-y-auto max-h-60 w-full mb-6">
                        <form id="js-add-songs-form">
                            <!-- Song list will be populated here -->
                        </form>
                    </div>
                    <button id="js-add-new-song-button" class="bg-black text-white px-4 py-2 rounded">
                        Add Song
                    </button>
                    <p id="js-no-songs-selected" class="text-red-600 mt-3"></p>
                </div>
            </div>
        `;

        // add to the form all the downloaded songs that can be added to playlist
        const playlistId = Number(addSongBtn.dataset.playlistId);
        populateSongs(playlistId);

        // adds click event listeners to the exit and add new song buttons
        handlePopUpButtons();

        // making the modal appear when add song button is clicked
        addSongsModal.classList.remove('hidden');
        addSongsModal.classList.add('flex');
    });
}

function populateSongs(playlistId) {
    // retrieve the form which will contain all downloaded songs
    const songListForm = document.getElementById('js-add-songs-form');
    const playlist = getPlaylistById(playlistId);

    // add all the downloaded songs as options to the form
    downloads.forEach((song) => {
        if (!isSongInPlaylist(playlist, song.title)) {
            // create a container div for every downloaded song not already added to the custom playlist
            const songItem = document.createElement('div');
            songItem.className = 'song-item flex items-center mb-0';
            songItem.innerHTML = `
                <input type="checkbox" id="${song.id}" name="song-${song.id}" value="${song.id}" class="js-song-option mr-2">
                <label for="${song.id}">${song.title}</label>
            `;
            songListForm.appendChild(songItem);
        }
    });
}

function handlePopUpButtons() {
    const addSongsModal = document.getElementById('js-add-songs-modal');
    const exitButton = document.getElementById('js-exit-add-songs-popup');
    const addNewSongBtn = document.getElementById('js-add-new-song-button');

    exitButton.addEventListener('click', () => {
        addSongsModal.classList.add('hidden');
        addSongsModal.classList.remove('flex');
    });

    addNewSongBtn.addEventListener('click', async () => {

        // try-catch as getSelectedSongs might throw unexpected error
        try {
            const selectedSongs = await getSelectedSongs();
            // console.log("The selected songs:", selectedSongs);
            const playlistName = document.getElementById('js-playlist-name-header').innerText;
            const playlist = getPlaylist(playlistName);

            if (selectedSongs.length > 0) {
                selectedSongs.forEach((songObject) => {
                    addSong(playlistName, songObject);
                });
                addSongsModal.classList.add('hidden');
                addSongsModal.classList.remove('flex');

                // render the newly added songs to playlist
                document.body.innerHTML = await displaySongs(playlist.id);

                // make sure add song button works without having to refresh page 
                handleAddSongBtn();
            }

            else {
                const noSongsSelectedMsg = document.getElementById('js-no-songs-selected');
                noSongsSelectedMsg.innerText = 'You have not selected any songs.';
            }
        }
        catch (error) {
            console.error("Error thrown by getSelectedSongs() when adding the click listener for the add song button.", error);
        }
    });
}

// function has to be async since we need to use await at the end 
async function getSelectedSongs() {
    const songOptions = document.querySelectorAll('.js-song-option:checked');       // all input elements in the song form

    const selectedPromises = Array.from(songOptions)
        .map(async (songOption) => {
            const songId = Number(songOption.id);

            // try-catch needed as getSongFileDB can throw an unexpected error
            try {
                const songFile = await getSongFileDB(songId);

                // if song file is valid, we return an object wrapped in a promise
                if (songFile) {
                    return {
                        id: songId,
                        title: songFile.name,
                        file: songFile
                    }
                }
                else {
                    console.log('Song file not found for ID:', songId);
                }
            }

            catch (error) {
                console.error("Error occurred when fetching the song from SongsDB while iterating through the checked songs.", error);
                return null;
            }

        });

    const selectedSongs = await Promise.all(selectedPromises);

    // this return value will also be wrapped in a promise since this is an async function
    return selectedSongs.filter(selectedSong => selectedSong !== null);     // extra check for assurance before returning
}

