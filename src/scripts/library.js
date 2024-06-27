// import { downloads } from "../../data/downloads.js";
import { renderNewPlaylist } from "./renderNewPlaylist.js";
import { renderPlaylists } from "./renderPlaylists.js";
import { renderSongs } from "./renderSongs.js";

// console.log(downloads);
renderPlaylists();      // displays the playlists created by user when library page loads
renderSongs();          // adds click listeners for each playlist
renderNewPlaylist();