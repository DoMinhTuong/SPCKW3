const auth = firebase.auth();

const db = firebase.firestore();

/* Protect page */

auth.onAuthStateChanged(user => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    /* Navbar avatar */

    const avatar =
        document.getElementById("userAvatar");

    if (avatar) {
        avatar.src =
            user.photoURL || "/Img/dpfp.jpg";
    }

    /* Load playlists */

    loadPlaylists();

});

document.getElementById("homeBtn").onclick = () => {
    window.location.href = "index.html";
};

document.getElementById("searchBtn").onclick = () => {
    window.location.href = "song.html";
};

document.getElementById("playlistBtn").onclick = () => {
    window.location.href = "playlist.html";
};

document.getElementById("profileBtn").onclick = () => {
    window.location.href = "profile.html";
};

document.getElementById("contactBtn").onclick = () => {
    window.location.href = "contact.html";
};

const API = "https://discoveryprovider.audius.co/v1";

const playerAudio =
    document.getElementById("playerAudio");

const playerTitle =
    document.getElementById("playerTitle");

const playerArtist =
    document.getElementById("playerArtist");

const playerThumb =
    document.getElementById("playerThumb");

const playerToggle =
    document.getElementById("playerToggle");

const playerProgress =
    document.getElementById("playerProgress");

playerToggle.onclick = () => {
    if (playerAudio.paused) {
        playerAudio.play();
    } else {
        playerAudio.pause();
    }
};

playerAudio.addEventListener("play", () => {
    playerToggle.textContent = "❚❚";
});

playerAudio.addEventListener("pause", () => {
    playerToggle.textContent = "▶";
});

playerAudio.addEventListener("timeupdate", () => {

    if (!playerAudio.duration) return;

    const percent =
        (playerAudio.currentTime / playerAudio.duration) * 100;

    playerProgress.style.width =
        percent + "%";

});

document.getElementById("randomTracksBtn").onclick =
async () => {

    const tracks =
        await getRandomTrendingSongs();

    currentPlaylistSongs = tracks;

    renderSearchResults(tracks);

};

function loadPlayer(track) {

    playerTitle.textContent = track.title;

    playerArtist.textContent = track.user.name;

    playerThumb.src =
        track.artwork?.["480x480"] || "/Img/blankmusic.png";

    playerAudio.src =
        `${API}/tracks/${track.id}/stream?app_name=Echowave`;

    playerAudio.play();
}

async function getRandomTrendingSongs() {

    const res = await fetch(
        `${API}/tracks/trending?limit=20&app_name=Echowave`
    );

    const data = await res.json();

    const tracks = data.data || [];

    const shuffled =
        tracks.sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 5);

}

async function searchSongs(query) {

    const res = await fetch(
        `${API}/tracks/search?query=${query}&limit=10&app_name=Echowave`
    );

    const data = await res.json();

    return data.data || [];

}

async function savePlaylist(name, songs) {

    const user =
        firebase.auth().currentUser;

    if (!user) return;

    await db
        .collection("playlists")
        .doc(user.uid)
        .collection("userPlaylists")
        .add({

            name,
            songs,
            createdAt: Date.now()

        });

}

async function loadPlaylists() {

    const user =
        firebase.auth().currentUser;

    if (!user) return;

    const snapshot =
        await db
            .collection("playlists")
            .doc(user.uid)
            .collection("userPlaylists")
            .get();

    snapshot.forEach(doc => {

        const playlist = doc.data();

        renderPlaylist(doc.id, playlist);

    });

}

function renderPlaylist(id, playlist) {
   // render html card
}