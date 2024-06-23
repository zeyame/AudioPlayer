import { downloads } from "./downloads.js";

let playlist_id = JSON.parse(localStorage.getItem('playlist_id')) || 1;

export const playlists = JSON.parse(localStorage.getItem('playlists')) || [
    {
        id: playlist_id,
        name: 'Downloads',
        songs: downloads        // array of songs
    }
];

function nextId() {
    playlist_id++;
    localStorage.setItem('playlist_id', playlist_id);
    return playlist_id;
}