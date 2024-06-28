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

export function isPlaylist(playlistName) {
    return playlists.some(playlist => playlist.name === playlistName);
}

export function getPlaylist(playlistName) {
    return playlists.find(playlist => playlist.name === playlistName);
}

function isSongInPlaylist(playlist, songName) {
    return playlist.songs.some(song => song.name === songName);
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

export function addSong(playlistName, songObject) {
    const playlist = getPlaylist(playlistName);

    if (playlist) {
        // add song to playlist if not already there
        if (!isSongInPlaylist(playlist, songObject.name)) {
            playlist.songs.push({
                id: songObject.id,
                title: songObject.title,
                file: songObject.file
            });
            savePlaylist();
        }
    }
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


