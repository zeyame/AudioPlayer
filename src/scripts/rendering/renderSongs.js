import { getPlaylist, playlists, addSong, getPlaylistById, isSongInPlaylist, removeSongFromPlaylist, removeSongFromAllPlaylists, savePlaylists } from "../../../data/playlists.js";
import { getSongFileDB, removeSongFromDB } from "../../../data/database.js";
import { removeSongFromDownloads, renderURL, saveToStorage, updateDownloadsPlaylist } from "../../../data/downloads.js";
import { downloads } from "../../../data/downloadsData.js";

// method renders songs on the screen when a playlist is clicked
export function renderSongs() {
    const playlistButtons = document.querySelectorAll('.js-playlist-button');       // all playlists on the screen

    playlistButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const playlistId = Number(button.dataset.playlistId);
            document.body.innerHTML = await displaySongs(playlistId);        // displays the songs of the clicked playlist
            handlePlayPauseBtn();
            handleDeleteSongBtn();

            // if songs exist in a playlist we handle progress bars
            const playlist = getPlaylistById(playlistId);
            if (playlist.songs) {
                handleProgressBarClicks();
            }

            // if the playlist clicked was not downloads playlist
            if (playlistId !== 1) {
                handleAddSongBtn();
            }
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
            <div id="js-delete-song-modal" class="fixed inset-0 hidden z-50 overflow-auto modal-backdrop"></div>
            <div class="flex-grow overflow-y-auto">
                <div id="js-songs-container" class="flex flex-col w-2/3 mx-auto">
    `;

    try {
        await processSongs(playlist);
        playlist.songs.forEach((song, index) => {
            songsHTML += `
                <div class="flex items-center w-full mt-4 py-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer song-row" data-song-id="${song.id}">
                    <button class="play-pause-btn js-play-pause-btn mr-4 focus:outline-none" data-song-id="${song.id}" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 play-icon js-play-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pause-icon js-pause-icon hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <div class="flex-grow">
                        <p class="text-lg font-semibold">${song.title}</p>
                        <p class="text-sm text-gray-500">${song.duration}</p>
                    </div>
                    <audio id="js-audio-song-${song.id}" class="hidden js-audio-songs" data-playlist-name="${playlist.name}"data-song-id="${song.id}" src="${song.url}#t=${song.currentTime}" controls></audio>
                    <div class=" bg-gray-200 rounded-full h-2.5 overflow-hidden js-progress-bar-container" style="width: 300px">
                        <div id="js-progress-bar-${song.id}" class="bg-black h-2.5 rounded-full transition-all js-progress-bar" data-song-id="${song.id}" style="width: 0%"></div>
                    </div>                    
                    <button id="js-delete-song-${song.id}" class="text-gray-500 hover:text-red-500 transition-colors duration-200 js-delete-song-btn ml-4" data-song-id="${song.id}" data-playlist-id="${playlist.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
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

                // re-adding event listeners for add song, delete song, play/pause song and progress bar buttons
                handleAddSongBtn();
                handlePlayPauseBtn();
                handleDeleteSongBtn();
                handleProgressBarClicks();
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

function handleDeleteSongBtn() {

    const deleteSongButtons = document.querySelectorAll('.js-delete-song-btn');
    const deleteSongModal = document.getElementById('js-delete-song-modal');

    deleteSongButtons.forEach((deleteSongBtn) => {
        deleteSongBtn.addEventListener('click', async () => {
            deleteSongModal.innerHTML = `
                <div class="modal-content relative p-8 bg-white m-auto flex-col flex rounded-lg">
                    <div id="js-delete-song-popup" class="flex flex-col items-center justify-center h-full">
                        <button id="js-exit-delete-song-popup" class="absolute top-6 right-8 text-gray-500 hover:text-gray-900">
                            <span class="font-bold text-lg">X</span>
                        </button>
                        <h2 class="text-xl font-bold mb-4">Delete Song</h2>
                        <div id="delete-song-options-container" class="mt-3">
                            <button id="js-confirm-delete-button" class="bg-black text-white mr-2 px-4 py-2 rounded">
                                Confirm
                            </button><button id="js-cancel-delete-button" class="bg-black text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>`;

            deleteSongModal.classList.remove('hidden');
            deleteSongModal.classList.add('flex');

            // handling click listeners
            const songId = Number(deleteSongBtn.dataset.songId);
            const playlistId = Number(deleteSongBtn.dataset.playlistId);
            const playlist = getPlaylistById(playlistId);

            // exit button
            document.getElementById('js-exit-delete-song-popup')
                .addEventListener(('click'), async () => {
                    // hiding the modal
                    deleteSongModal.classList.add('hidden');
                    deleteSongModal.classList.remove('flex');
                });

            
            // confirm button
            document.getElementById('js-confirm-delete-button')
                .addEventListener('click', async () => {
                    // if removing the song from downloads playlist
                    if (playlistId === 1) {
                        try {
                            
                            // remove song from downloads array and updating the downloads playlist to reflect changes
                            removeSongFromDownloads(songId);
                            updateDownloadsPlaylist();
        
                            // removing the song from all playlists
                            removeSongFromAllPlaylists(songId);
        
                            // removing the song from the database
                            removeSongFromDB(songId);
        
                            // regenerating html for the updating song list of the playlist
                            document.body.innerHTML = await displaySongs(playlistId);
                        }
                        catch (error) {
                            console.error("Error unexpectedly thrown when removing song with id", songId, 'from SongsDB', error);
                        }
                    }

                    // if removing the song from any other playlist
                    else {
                        // remove song from the playlist but do not change the downloads array or SongsDB
                        removeSongFromPlaylist(playlistId, songId);

                        // regenerating html for the updating song list of the playlist
                        document.body.innerHTML = await displaySongs(playlistId);

                        // adding the event listener for the add song button
                        handleAddSongBtn();
                    }

                    // re-adding the event listeners for the play/pause and delete songs buttons
                    handlePlayPauseBtn();
                    handleDeleteSongBtn();

                    // re-adding the progress bar click listeners if there are any songs remaining
                    if (playlist.songs) {
                        handleProgressBarClicks();
                    }
                });

            
            // cancel button
            document.getElementById('js-cancel-delete-button')
                .addEventListener('click', () => {
                    // hiding the modal
                    deleteSongModal.classList.add('hidden');
                    deleteSongModal.classList.remove('flex');
                });
    })});
}

function handlePlayPauseBtn() {
    const playPauseBtns = document.querySelectorAll('.js-play-pause-btn');
    playPauseBtns.forEach((button) => {
        button.addEventListener('click', () => {
            const songClicked = Number(button.dataset.songId);
            const audioElement = document.getElementById(`js-audio-song-${songClicked}`);

            if (audioElement) {
                // we only play the song after pausing any song that is currently playing
                if (audioElement.paused) {
                    pauseCurrentSong();
                    audioElement.play();

                    // increase progress bar and update song's current time property for persistence
                    updateProgressBarAndSongTime(audioElement);    

                    // hiding the play icon and showing the pause icon
                    button.querySelector('.js-play-icon').classList.add('hidden');
                    button.querySelector('.js-pause-icon').classList.remove('hidden');
                }

                // if clicked song is already playing, we pause it
                else {
                    audioElement.pause();

                    // hiding the pause icon and showing the play icon
                    button.querySelector('.js-play-icon').classList.remove('hidden');
                    button.querySelector('.js-pause-icon').classList.add('hidden');
                }
            }

            else {
                console.log("Audio element for song with id", songClicked, "was not found.");
            }
        });
    });
}

function pauseCurrentSong() {
    // retrieve all audio elements on the page
    const audioElements = document.querySelectorAll('.js-audio-songs');

    // getting the audio element that is currently playing
    const playingSong = Array.from(audioElements)
        .find(audio => audio.currentTime > 0 && !audio.paused);
    
    // if we find a playing song we store its Id
    const playingSongId = playingSong ? playingSong.dataset.songId : '';
    
    // we retrieve the play/pause button belonging to this specific song/audio element
    const playPauseBtn = Array.from(document.querySelectorAll('.js-play-pause-btn'))
        .find(button => button.dataset.songId === playingSongId);

    // if a play/pause button exists, we pause the song/audio and adjust the svg icons accordingly
    if (playPauseBtn) {
        playingSong.pause();
        playPauseBtn.querySelector('.js-pause-icon').classList.add('hidden');
        playPauseBtn.querySelector('.js-play-icon').classList.remove('hidden');
    }
}

function updateProgressBarAndSongTime(audio) {
    // get song from the playlist which its being played from
    const songId = Number(audio.dataset.songId);
    const playlist = getPlaylist(audio.dataset.playlistName);

    // get progress bar to be adjusted
    const progressBar = document.getElementById(`js-progress-bar-${songId}`);
    const songDuration = audio.duration;        // seconds

    // as long as current time of audio is changing, we adjust the progress bar accordingly
    audio.ontimeupdate = () => {
        if (songDuration > 0) {

            // if song is being played from the downloads playlist, we update downloads array and then transfer the updates to playlists array
            if (playlist.id === 1) {
                // update current time of song in downloads
                downloads.forEach((download) => {
                    if (download.id === songId) {
                        download.currentTime = audio.currentTime;
                    }
                });
                saveToStorage();        // saving downloads to storage

                // update downloads playlist to reflect downloads array changes
                updateDownloadsPlaylist();

            }

            else {
                playlist.songs.forEach((song) => {
                    if (song.id === songId) {
                        song.currentTime = audio.currentTime;
                    }
                });
                savePlaylists();
            }

            // update progress bar
            const progress = (audio.currentTime/songDuration) * 100           // %
            progressBar.style.width = `${progress}%`;
        }
    }
}


function handleProgressBarClicks() {
    const progressBarContainers = document.querySelectorAll('.js-progress-bar-container');

    progressBarContainers.forEach((container) => {
        container.addEventListener('click', (event) => {
            // retrieving the adjustable progress bar
            const progressBar = container.querySelector('div');

            // click x coordinate
            const x = Number(event.offsetX);

            // calculating the ratio of click coordinate to the total container width
            const containerWidth = Number(container.style.width.slice(0, -2));
            const ratio = x/containerWidth;

            // calculate the new time based on the click
            const songId = Number(progressBar.dataset.songId);
            const audio = document.getElementById(`js-audio-song-${songId}`);
            const songDuration = audio.duration;
            const newTime = Math.floor(songDuration * ratio);

            // if the audio belonging to clicked bar was paused, we play audio but do not skip
            if (audio.paused) {
                // retrieving the play/pause button for the clicked progress bar
                const playPauseBtn = Array.from(document.querySelectorAll('.js-play-pause-btn'))
                    .find(button => Number(button.dataset.songId) === songId);
                
                // pause any other songs playing and play song which progress bar was clicked for
                pauseCurrentSong();
                audio.play();

                // make sure progress bar and song's current time property are updating 
                updateProgressBarAndSongTime(audio);

                // hide play icon and show pause icon when audio plays
                playPauseBtn.querySelector('.js-play-icon').classList.add('hidden');
                playPauseBtn.querySelector('.js-pause-icon').classList.remove('hidden');
            }

            // if audio belonging to clicked bar was playing, we skip to new time
            else {
                audio.currentTime = newTime;
            }
            
        });
    });
}
