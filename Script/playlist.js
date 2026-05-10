console.log("playlist.js loaded");

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

createPlaylistBtn.onclick = async () => {

    playlistModal.classList.remove("hidden");

    await loadRecommendedSongs();

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

async function searchSongs(query) {

    const res = await fetch(
        `${API}/tracks/search?query=${encodeURIComponent(query)}&limit=10&app_name=Echowave`
    );

    const data = await res.json();

    return data.data || [];

}

async function savePlaylist(name, songs) {

    const user =
        firebase.auth().currentUser;

    if (!user) return;

    /* Only save serializable fields */
    const serialized = songs.map(s => ({
        id: s.id,
        title: s.title,
        artist: s.user?.name || "Unknown",
        artwork: s.artwork?.["480x480"] || ""
    }));

    await db
        .collection("playlists")
        .doc(user.uid)
        .collection("userPlaylists")
        .add({

            name,
            songs: serialized,
            createdAt: Date.now()

        });

}

async function loadPlaylists() {

    const user =
        firebase.auth().currentUser;

    if (!user) return;

    document.getElementById("playlistContainer")
        .innerHTML = "";

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

        <button class="open-playlist-btn">
            Open
        </button>

        <button class="delete-playlist-btn">
            Delete
        </button>

    `;

    /* OPEN PLAYLIST */

    card.querySelector(".open-playlist-btn")
        .onclick = () => {

            localStorage.setItem(
                "selectedPlaylistId",
                id
            );

            window.location.href =
                "playlist-view.html";

        };

    /* DELETE PLAYLIST */

    card.querySelector(".delete-playlist-btn")
        .onclick = async () => {

            const user =
                firebase.auth().currentUser;

            await db
                .collection("playlists")
                .doc(user.uid)
                .collection("userPlaylists")
                .doc(id)
                .delete();

            loadPlaylists();

        };

    container.appendChild(card);

}

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

                const exists =
                    currentPlaylistSongs.some(
                        song => song.id === track.id
                    );

                if (exists) return;

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

    currentPlaylistSongs.forEach((track, index) => {

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

            <button class="remove-song-btn">
              Remove
            </button>

        `;

        div.querySelector(".remove-song-btn")
            .onclick = () => {

                currentPlaylistSongs.splice(index, 1);

                renderSelectedSongs();

            };

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

        if (!currentPlaylistSongs.length) {
            alert("Add at least one song");
            return;
        }

        await savePlaylist(
            name,
            currentPlaylistSongs
        );

        document.getElementById("closePlaylistModalBtn")
            .onclick = () => {

                playlistModal.classList.add("hidden");

                currentPlaylistSongs = [];

                document.getElementById("playlistName").value = "";

                document.getElementById("playlistSongSearch").value = "";

                document.getElementById("searchResults").innerHTML = "";

                document.getElementById("selectedSongs").innerHTML = "";

            };
        currentPlaylistSongs = [];

        document.getElementById("playlistName").value = "";

        document.getElementById("playlistSongSearch").value = "";

        document.getElementById("searchResults").innerHTML = "";

        document.getElementById("selectedSongs").innerHTML = "";

        currentPlaylistSongs = [];

        document.getElementById("playlistContainer")
            .innerHTML = "";

        loadPlaylists();

    };

document.getElementById("closePlaylistModalBtn")
    .onclick = () => {

        playlistModal.classList.add("hidden");

    };

async function loadRecommendedSongs() {

    try {

        const container =
            document.getElementById("recommendedSongs");

        container.innerHTML = "";

        const res = await fetch(
            `${API}/tracks/trending?limit=8&app_name=Echowave`
        );

        const data = await res.json();

        const tracks = data.data || [];

        tracks.forEach(track => {

            const card =
                document.createElement("div");

            card.className =
                "recommended-song-card";

            card.innerHTML = `

                <img
                  src="${track.artwork?.["480x480"] || "/Img/blankmusic.png"}"
                >

                <div class="recommended-song-title">
                    ${track.title}
                </div>

                <div class="recommended-song-artist">
                    ${track.user.name}
                </div>

            `;

            card.onclick = () => {

                const exists =
                    currentPlaylistSongs.some(
                        song => song.id === track.id
                    );

                if (exists) return;

                currentPlaylistSongs.push(track);

                renderSelectedSongs();

            };

            container.appendChild(card);

        });

    } catch (err) {

        console.error(err);

    }

}
