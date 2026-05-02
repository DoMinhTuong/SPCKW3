const auth = firebase.auth();

/* Protect page */

auth.onAuthStateChanged(user => {

    if (!user) {
        window.location.href = "login.html";
    }

});


/* Buttons */

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
    window.location.href = "profile.html"
};

document.getElementById("contactBtn").onclick = () => {
    window.location.href = "contact.html"
};

document.getElementById("logoutBtn").onclick = () => {

    auth.signOut().then(() => {

        window.location.href = "login.html";

    });

};
const API =
    "https://discoveryprovider.audius.co/v1";

/* Player Elements */

const playerAudio =
    document.getElementById("playerAudio");

const playerTitle =
    document.getElementById("playerTitle");

const playerArtist =
    document.getElementById("playerArtist");

const playerThumb =
    document.getElementById("playerThumb");

const playerPlay =
    document.getElementById("playerPlay");

const playerPause =
    document.getElementById("playerPause");

const playerProgress =
    document.getElementById("playerProgress");

/* Controls */

playerPlay.onclick =
    () => playerAudio.play();

playerPause.onclick =
    () => playerAudio.pause();

/* Progress */

playerAudio.addEventListener(
    "timeupdate",

    () => {
        if (!playerAudio.duration) return;

        const percent =
            (playerAudio.currentTime / playerAudio.duration) * 100;

        playerProgress.style.width =
            percent + "%";

    });

/* Load Song into Player */

function loadPlayer(track) {

  playerTitle.textContent = track.title;

  playerArtist.textContent = track.user.name;

  playerThumb.src =
    track.artwork?.["480x480"] || "/Img/blankmusic.png";

  playerAudio.src =
    `${API}/tracks/${track.id}/stream?app_name=Echowave`;

  playerAudio.play(); // ← ADD DÒNG NÀY (optional bạn hỏi)
}

/* Load 1 song for homepage card */
async function loadOneSong() {
    try {
        const res = await fetch(
            `${API}/tracks/trending?limit=1&app_name=Echowave`
        );

        const data = await res.json();

        if (!data.data || data.data.length === 0) return;

        const track = data.data[0];

        const year = track.release_date?.split("-")[0] || "Unknown";

        document.getElementById("cardThumb").src =
            track.artwork?.["480x480"] || "/Img/blankmusic.png";

        document.getElementById("cardTitle").textContent =
            track.title;

        document.getElementById("cardMeta").textContent =
            `${year} • ${track.user.name}`;

        document.getElementById("musicCard").onclick = () => {
            loadPlayer(track);
        };

    } catch (err) {
        console.error(err);
    }
}
loadOneSong();