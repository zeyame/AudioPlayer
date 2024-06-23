import { playlists } from "../../data/playlists.js";

export function renderPlaylists() {
    const playlistsContainer = document.getElementById('js-playlists-container');
    let html = '';
    playlists.forEach((playlist) => {
        html += `
            <div>
                <button class="js-playlist-button" id="js-playlist-${playlist.id}" data-playlist-id=${playlist.id}>${playlist.name}</button>
            </div>
        `
    });

    console.log(html);

    playlistsContainer.innerHTML = html;
}