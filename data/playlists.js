import { downloads } from "./downloadsData.js";

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

export function getPlaylistById(playlistId) {
    return playlists.find(playlist => playlist.id === playlistId);
}

export function isSongInPlaylist(playlist, songName) {
    return playlist.songs.some(song => song.title === songName);
}

export function removePlaylist(playlistId) {
    playlists.splice(playlistId-1, 1);
    savePlaylists();
}

export function addPlaylist(playlistName, songsArray) {
    if (!isPlaylist(playlistName)) {
        playlists.push({
            id: nextId(),
            name: playlistName,
            songs: songsArray
        });
        savePlaylists();
    }   
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
            savePlaylists();
        }
    }
}

export function savePlaylists() {
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


