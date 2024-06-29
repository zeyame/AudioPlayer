import { renderNewPlaylist } from "./rendering/renderNewPlaylist.js";
import { renderPlaylists } from "./rendering/renderPlaylists.js";
import { renderSongs } from "./rendering/renderSongs.js";

renderPlaylists();      // displays the playlists created by user when library page loads
renderSongs();          // adds click listeners for each playlist
renderNewPlaylist();    // handles creating a new playlist
