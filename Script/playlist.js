const auth = firebase.auth();

const db = firebase.firestore();

/* =========================
   PLAYLIST MODAL
========================= */

let currentPlaylistSongs = [];

const playlistModal =
    document.getElementById("playlistModal");

const createPlaylistBtn =
    document.getElementById("createPlaylistBtn");

/* Open modal */

createPlaylistBtn.onclick = () => {

    playlistModal.classList.remove("hidden");

};

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

    const container =
        document.getElementById("playlistContainer");

    const card =
        document.createElement("div");

    card.className =
        "playlist-card";

    let description =
        playlist.songs
        .slice(0, 3)
        .map(song => song.title)
        .join(", ");

    if (playlist.songs.length > 3) {
        description += " ...";
    }

    card.innerHTML = `

        <img src="/Img/blankmusic.png">

        <div class="playlist-card-info">

            <div class="playlist-card-title">
                ${playlist.name}
            </div>

            <div class="playlist-card-description">
                ${description}
            </div>

        </div>

    `;

    container.appendChild(card);

}

let currentPlaylistSongs = [];
document.getElementById("playlistSongSearchBtn")
.onclick = async () => {

    const query =
        document.getElementById("playlistSongSearch")
        .value;

    if (!query) return;

    const tracks =
        await searchSongs(query);

    renderSearchResults(tracks);

};

function renderSearchResults(tracks) {

    const container =
        document.getElementById("searchResults");

    container.innerHTML = "";

    tracks.forEach(track => {

        const card =
            document.createElement("div");

        card.className =
            "search-song-card";

        card.innerHTML = `

            <img
              src="${track.artwork?.["480x480"] || "/Img/blankmusic.png"}"
            >

            <div class="search-song-info">

              <div class="search-song-title">
                ${track.title}
              </div>

              <div class="search-song-artist">
                ${track.user.name}
              </div>

            </div>

            <button class="add-song-btn">
              Add
            </button>

        `;

        card.querySelector(".add-song-btn")
        .onclick = () => {

            currentPlaylistSongs.push(track);

            renderSelectedSongs();

        };

        container.appendChild(card);

    });

}

function renderSelectedSongs() {

    const container =
        document.getElementById("selectedSongs");

    container.innerHTML = "";

    currentPlaylistSongs.forEach(track => {

        const div =
            document.createElement("div");

        div.className =
            "search-song-card";

        div.innerHTML = `

            <img
              src="${track.artwork?.["480x480"] || "/Img/blankmusic.png"}"
            >

            <div class="search-song-info">

              <div class="search-song-title">
                ${track.title}
              </div>

              <div class="search-song-artist">
                ${track.user.name}
              </div>

            </div>

        `;

        container.appendChild(div);

    });

}

document.getElementById("savePlaylistBtn")
.onclick = async () => {

    const name =
        document.getElementById("playlistName")
        .value;

    if (!name) {
        alert("Enter playlist name");
        return;
    }

    await savePlaylist(
        name,
        currentPlaylistSongs
    );

    playlistModal.classList.add("hidden");

    currentPlaylistSongs = [];

    document.getElementById("playlistContainer")
    .innerHTML = "";

    loadPlaylists();

};