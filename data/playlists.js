import { downloads } from "./downloads.js";

// unique id for every playlist added
let playlist_id = JSON.parse(localStorage.getItem('playlist_id')) || 1;

export const playlists = JSON.parse(localStorage.getItem('playlists')) || [
    {
        id: playlist_id,
        name: 'Downloads',
        songs: downloads        // array of songs
    }
];
