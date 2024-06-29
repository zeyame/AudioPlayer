import { addPlaylist, isPlaylist } from "../../data/playlists.js";
import { renderPlaylists } from "./renderPlaylists.js";
import { renderSongs } from "./renderSongs.js";

export function renderNewPlaylist() {

    const createPlaylistButton = document.getElementById('js-create-playlist-button');
    const newPlaylistModal = document.getElementById('js-new-playlist-modal');

    createPlaylistButton.addEventListener('click', () => {
        newPlaylistModal.innerHTML = `
        <div class="modal-content relative p-8 bg-white m-auto flex-col flex rounded-lg">
            <div id="js-new-playlist-popup" class="flex flex-col items-center justify-center h-full">
                <button id="js-exit-new-playlist-popup" class="absolute top-6 right-8 text-gray-500 hover:text-gray-900">
                    <span class="font-bold text-lg">X</span>
                </button>
                <h2 class="text-xl font-bold mb-4">Create New Playlist</h2>
                <input id="js-enter-playlist-name" type="text" placeholder="Enter playlist name" class="w-full px-3 py-2 border rounded mb-4">
                <p id="js-empty-input-message" class="text-sm text-red-700 mt-0 mb-3"></p>
                <p id="js-playlist-name-taken" class="text-sm text-red-700 mt-0 mb-3"></p>
                <button id="js-add-new-playlist-button" class="bg-black text-white px-4 py-2 rounded">
                    Add Playlist
                </button>
            </div>
        </div>`;

        // making the modal visible upon click
        newPlaylistModal.classList.remove('hidden');
        newPlaylistModal.classList.add('flex');

        // adding a click listener for the add playlist button 
        document.getElementById('js-add-new-playlist-button').addEventListener('click', () => {
            handlePlaylistInput();
        });

        // adding an 'Enter' button listener to the body
        document.body.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                handlePlaylistInput();
            }
        });

        // adding a click listener for the exit button
        document.getElementById('js-exit-new-playlist-popup').addEventListener('click', () => {
            newPlaylistModal.classList.add('hidden');
            newPlaylistModal.classList.remove('flex');
        });
    });
}


function handlePlaylistInput() {
    // take the value entered and save it in the playlists array
    const inputElement = document.getElementById('js-enter-playlist-name');
    const playlistName = inputElement.value;
    const newPlaylistModal = document.getElementById('js-new-playlist-modal');

    // If user enters a name we check if it is taken or not
    if (playlistName) {
        const playlistExists = isPlaylist(playlistName);

        // if name is not taken we add playlist
        if (!playlistExists) {
            addPlaylist(playlistName, []);          // add playlist with name and empty songs array
            
            // make the playlist modal hidden again
            newPlaylistModal.classList.add('hidden');
            newPlaylistModal.classList.remove('flex');

            // we diplay new playlist list
            renderPlaylists();
            // We add the click listener for this new playlist
            renderSongs();
        }

        else {
            const nameTakenElement = document.getElementById('js-playlist-name-taken');
            nameTakenElement.innerText = `${playlistName} is already taken`;
        }

    }

    // If user leaves input empty and clicks add button we display warning message
    else {
        const emptyInputMessage = document.getElementById('js-empty-input-message');
        emptyInputMessage.innerText = "Cannot add playlist with no name.";
    }
}
