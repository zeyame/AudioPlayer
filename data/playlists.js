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

function getSongFromPlaylist(playlist, songId) {
    return playlist.songs.find(song => song.id === songId);
}

export function getSongFromPlaylistId(songId) {
    let songFound;
    for (const playist of playlists) {
        playist.songs.forEach((song) => {
            if (song.id === songId) {
                songFound = song;
            }
        });
    }
    return songFound;
}

export function removePlaylist(playlistId) {
    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === playlistId) {
            playlists.splice(i, 1);
            break;
        }
    }
    savePlaylists();
}

export function removeSongFromAllPlaylists(songId) {
    for (const playlist of playlists) {
        removeSongFromPlaylist(playlist.id, songId);
    }
}

export function removeSongFromPlaylist(playlistId, songId) {
    const playlist = getPlaylistById(playlistId);
    playlist.songs = playlist.songs.filter(song => song.id != songId);
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
                currentTime: 0,         // seconds
                file: songObject.file
            });
            savePlaylists();
        }
    }
}

export function getSongNameFromPlaylist(songId, playlistId) {
    const playist = getPlaylistById(playlistId);

    if (playist) {
        const song = getSongFromPlaylist(playist, songId);
        if (song) {
            return song.title;
        }
    }
    return null;
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


