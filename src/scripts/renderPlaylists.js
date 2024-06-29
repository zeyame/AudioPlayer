import { playlists, removePlaylist } from "../../data/playlists.js";

export function renderPlaylists() {
    const playlistsContainer = document.getElementById('js-playlists-container');
    let playlistsHTML = `
        <div class="space-y-2">
    `;

    playlists.forEach((playlist) => {
        playlistsHTML += `
        <div class="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <button class="js-playlist-button flex items-center flex-grow text-left" id="js-playlist-${playlist.id}" data-playlist-id=${playlist.id}>
                <span class="font-medium">${playlist.name}</span>
            </button>
            ${playlist.id !== 1 ? `
            <button id="js-delete-playlist-${playlist.id}" class="text-gray-500 hover:text-red-500 transition-colors duration-200 js-delete-playlist-btn" data-playlist-id="${playlist.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
            ` : ''}
        </div>
        `;
    });

    playlistsHTML += '</div>';
    playlistsContainer.innerHTML = playlistsHTML;

    handleDeletePlaylist();
}

function handleDeletePlaylist() {
    const deletePlaylistButtons = document.querySelectorAll('.js-delete-playlist-btn');
    
    deletePlaylistButtons.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', () => {
            const playlistId = Number(deleteBtn.dataset.playlistId);
            removePlaylist(playlistId);
            renderPlaylists();
        });
    });
}