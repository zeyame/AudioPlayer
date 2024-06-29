import { downloads } from "../../data/downloadsData.js";

export function updateDatabase() {

    if (!window.indexedDB) {
        console.log("Your browser does not support indexedDB");
        return;
    }

    // instance of indexedDB library
    const indexedDB = window.indexedDB;

    // attempting to open a new/existing database
    const request = indexedDB.open('SongsDB', 1);
    
    // if attempt fails
    request.onerror = (event) => {
        console.log('Database failed to be opened.', event.target.error);
    }

    // if attempt was blocked
    request.onblocked = (event) => {
        console.log('Database open request is blocked.', event.target.error);
    }
    
    // if no database exists or the version has been changed
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
    
        if (!db.objectStoreNames.contains('songs')) {
            const store = db.createObjectStore('songs', {keyPath: 'id'});
            const songId = store.createIndex('song_id', 'id', {unique: true});
            const songName = store.createIndex('song_name', 'name', {unique: false});
            const playlistName = store.createIndex('playlist_name', 'playlist', {unique: false});
            const songFile = store.createIndex('song_file', 'file', {unique: true});
        }
    }


    // if database with specific name and version successfully opens
    request.onsuccess = (event) => {
        const db = event.target.result;
        insertDownloads(db);
    }
}


function insertDownloads(db) {
    const transaction = db.transaction('songs', 'readwrite');
    const store = transaction.objectStore('songs');

    // inserting each song in downloads to the database
    downloads.forEach((song) => {
        const query = store.get(song.id);       // fetches song row
        query.onerror = (event) => {
            console.log(`Failed to get song with id ${song.id} when inserting songs into downloads.`);
            console.error(event.target.error);
        }

        // if query runs successfully, we check if the song was not already there
        query.onsuccess = (event) => {
            if (!event.target.result) {
                store.put({id: song.id, name: song.title, playlist: 'downloads', file: song.file});         // we store new song to SongsDB
            }
        }
    });

    transaction.onerror = (event) => {
        console.log("Failed to insert downloads into the Songs database.", event.target.error);
    }

    transaction.oncomplete = () => {
        if (downloads) console.log('New song successfully loaded into SongsDB');  
        printDatabase(db);
    }
}

// printing the database after every insertion
function printDatabase(db) {
    const transaction = db.transaction('songs', 'readonly');
    const store = transaction.objectStore('songs');

    const queryAll = store.getAll();

    queryAll.onerror = (event) => {
        console.log("Error in querying the entire SongsDB", event.target.error);
    }

    queryAll.onsuccess = (event) => {
        console.log('All the songs in the database:', event.target.result);
    }
}


// function fetches the file of a specific song stored in the database
export async function getSongFileDB(songId) {

    return new Promise((resolve, reject) => {
        const indexedDB = window.indexedDB;
        const request = indexedDB.open('SongsDB', 1);

        request.onerror = () => {
            reject(new Error("Failed to open the database when attempting to fetch song with id", songId));
        }
        
        request.onsuccess = (event) => {
            const db = event.target.result;

            const transaction = db.transaction('songs', 'readonly');
            const store = transaction.objectStore('songs');

            const songQuery = store.get(songId);        // gets the row for a song with the given id
            songQuery.onerror = () => {
                reject(new Error("Could not query the database for song with id", songId,));
            }

            songQuery.onsuccess = (event) => {
                const song = event.target.result;
                if (song) {
                    resolve(song.file);     // if song was found in SongsDB, we resolve the promise with a return value of the file
                }
                else {
                    resolve(null);          // We resolve with a null value if song was not found in the DB
                }
            }
        }
    });

}

