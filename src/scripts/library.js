// import { downloads } from "../../data/downloads.js";
import { renderNewPlaylist } from "./renderNewPlaylist.js";
import { renderPlaylists } from "./renderPlaylists.js";
import { renderSongs } from "./renderSongs.js";

// console.log(downloads);
renderPlaylists();      // displays the playlists created by user when library page loads
renderSongs();          // adds click listeners for each playlist
renderNewPlaylist();

// function handleNewPlaylist() {
//     const createPlaylistButton = document.getElementById('js-create-playlist-button');
//     const addNewPlaylistButton = document.getElementById('js-add-new-playlist-button');
//     const newPlaylistModal = document.getElementById('js-new-playlist-modal');

//     createPlaylistButton.addEventListener('click', () => {
//         newPlaylistModal.classList.remove('hidden');
//         newPlaylistModal.classList.add('flex');
//     });

//     addNewPlaylistButton.addEventListener('click', () => {
//         newPlaylistModal.classList.add('hidden');
//         newPlaylistModal.classList.remove('flex');
//     });
// }