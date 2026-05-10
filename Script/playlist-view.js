const db = firebase.firestore();

const auth = firebase.auth();

auth.onAuthStateChanged(async user => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const playlistId =
        localStorage.getItem(
            "selectedPlaylistId"
        );

    if (!playlistId) {
        alert("Playlist not found");
        return;
    }

    const doc =
        await db
            .collection("playlists")
            .doc(user.uid)
            .collection("userPlaylists")
            .doc(playlistId)
            .get();

    if (!doc.exists) {
        alert("Playlist not found");
        return;
    }

    const playlist = doc.data();

    renderPlaylistView(playlist);

});

function renderPlaylistView(playlist) {

    document.getElementById(
        "playlistTitle"
    ).textContent =
        playlist.name;

    document.getElementById(
        "playlistSongCount"
    ).textContent =
        `${playlist.songs.length} songs`;

    const container =
        document.getElementById(
            "playlistSongs"
        );

    container.innerHTML = "";

    playlist.songs.forEach(song => {

        const card =
            document.createElement("div");

        card.className =
            "playlist-song-card";

        card.innerHTML = `

            <img
              src="${
                song.artwork ||
                "/Img/blankmusic.png"
              }"
            >

            <div class="playlist-song-info">

                <div class="playlist-song-title">
                    ${song.title}
                </div>

                <div class="playlist-song-artist">
                    ${song.artist}
                </div>

            </div>

            <button class="play-song-btn">
                Play
            </button>

        `;

        container.appendChild(card);

    });

}