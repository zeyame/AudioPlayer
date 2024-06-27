import { playlists } from "../../data/playlists.js";

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
                <button id="js-add-new-playlist-button" class="bg-black text-white px-4 py-2 rounded">
                    Add Playlist
                </button>
            </div>
        </div>`;

        // making the modal visible
        newPlaylistModal.classList.remove('hidden');
        newPlaylistModal.classList.add('flex');

        // adding a click listener for the input element 
        document.getElementById('js-add-new-playlist-button').addEventListener('click', () => {
            // take the value entered and save it in the playlists array
            // const inputElement = document.getElementById('js-enter-playlist-name');
            // const playlistName = inputElement.value;
            // playlists.push({
            //     id: 

            // })

            // make the playlist modal hidden again
            newPlaylistModal.classList.add('hidden');
            newPlaylistModal.classList.remove('flex');
        });

        // adding a click listener for the exit button
        document.getElementById('js-exit-new-playlist-popup').addEventListener('click', () => {
            newPlaylistModal.classList.add('hidden');
            newPlaylistModal.classList.remove('flex');
        });
    });
}



