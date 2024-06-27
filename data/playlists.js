import { downloads } from "./downloads.js";

// unique id for every playlist added
let playlist_id = JSON.parse(localStorage.getItem('playlist_id')) || 1;
savePlaylistId();

export const playlists = JSON.parse(localStorage.getItem('playlists')) || [
    {
        id: playlist_id,
        name: 'Downloads',
        songs: downloads        // array of songs
    }
];

export function getPlaylist(playlistName) {
    return playlists.some(playlist => playlist.name === playlistName);
}

export function addPlaylist(playlistName, songsArray) {
    playlists.push({
        id: nextId(),
        name: playlistName,
        songs: songsArray
    });
    savePlaylist();
    console.log(playlists);
}

function savePlaylist() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

function nextId() {
    playlist_id++;
    savePlaylistId();
    return playlist_id;
}

function savePlaylistId() {
    localStorage.setItem('playlist_id', JSON.stringify(playlist_id));
}


