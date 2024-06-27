import { playlists } from "../../data/playlists.js";

// displays playlists when library page loads
export function renderPlaylists() {
    const playlistsContainer = document.getElementById('js-playlists-container');
    let playlistsHTML = '';
    playlists.forEach((playlist) => {
        playlistsHTML += `
            <div>
                <button class="js-playlist-button" id="js-playlist-${playlist.id}" data-playlist-id=${playlist.id}>${playlist.name}</button>
            </div>
        `
    });

    console.log(playlistsHTML);
    playlistsContainer.innerHTML = playlistsHTML;
}