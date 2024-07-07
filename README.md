# Audio Player

A feature-rich audio player built with JavaScript, Tailwind CSS, IndexedDB, and HTML. This project enables users to play, pause, and navigate through audio files with an enhanced user interface. It also supports offline playback and stores song metadata using IndexedDB for a seamless user experience.

## Features

- **Play, Pause, and Navigate:** Users can play, pause, and skip through audio tracks.
- **Offline Playback:** Audio tracks can be played offline, thanks to IndexedDB storing the audio files and metadata.
- **Responsive Design:** Built with Tailwind CSS, the player is responsive and works seamlessly across different devices and screen sizes.
- **Metadata Display:** Displays song metadata such as title, artist, and album art.

## Technologies Used

- **JavaScript:** Core functionality of the audio player.
- **Tailwind CSS:** For styling and responsive design.
- **IndexedDB:** For storing audio files and metadata locally to enable offline playback.
- **HTML:** Structure of the web application.

## Installation

To get the project up and running locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/audio-player.git
    cd audio-player
    ```

2. **Open the `index.html` file in your preferred web browser:**
    ```bash
    open index.html
    ```
    Or simply double-click the `index.html` file to open it in your default web browser.

## Usage

- **Adding Audio Files:** Drag and drop audio files into the player or use the file input to upload files.
- **Playing Audio:** Use the play/pause button to control playback. Navigate through tracks using the next and previous buttons.
- **Offline Usage:** Once the audio files are added, they are stored in IndexedDB, allowing you to play them even when offline.

