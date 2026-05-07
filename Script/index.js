const auth = firebase.auth();

auth.onAuthStateChanged(user => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    console.log("PHOTO URL:", user.photoURL); // ✅ an toàn

    const avatar = document.getElementById("userAvatar");

    if (avatar) {
        avatar.src = user.photoURL || "/Img/dpfp.jpg";
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

const playerToggle = document.getElementById("playerToggle");

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
/* =========================
   HOMEPAGE SECTIONS
========================= */

async function createSection(title, query) {

    try {

        const res = await fetch(
            `${API}/tracks/search?query=${query}&limit=10&app_name=Echowave`
        );

        const data = await res.json();

        const tracks = data.data || [];

        const sections =
            document.getElementById("musicSections");

        // section
        const section =
            document.createElement("div");

        section.className = "music-section";

        section.innerHTML =
            `<h2>${title}</h2>`;

        // row
        const row =
            document.createElement("div");

        row.className = "music-row";

        tracks.forEach(track => {

            const card =
                document.createElement("div");

            card.className = "music-card";

            card.innerHTML = `
                <img src="${track.artwork?.["480x480"] || "/Img/blankmusic.png"}">

                <div class="card-info">

                    <div class="card-title">
                        ${track.title}
                    </div>

                    <div class="card-meta">
                        ${track.user.name}
                    </div>

                </div>
            `;

            card.onclick = () => {
                loadPlayer(track);
            };

            row.appendChild(card);

        });

        section.appendChild(row);

        sections.appendChild(section);

    } catch (err) {

        console.error(err);

    }
}

/* Trending */

async function createTrending() {

    try {

        const res = await fetch(
            `${API}/tracks/trending?limit=10&app_name=Echowave`
        );

        const data = await res.json();

        const tracks = data.data || [];

        const sections =
            document.getElementById("musicSections");

        const section =
            document.createElement("div");

        section.className = "music-section";

        section.innerHTML =
            `<h2>Trending</h2>`;

        const row =
            document.createElement("div");

        row.className = "music-row";

        tracks.forEach(track => {

            const card =
                document.createElement("div");

            card.className = "music-card";

            card.innerHTML = `
                <img src="${track.artwork?.["480x480"] || "/Img/blankmusic.png"}">

                <div class="card-info">

                    <div class="card-title">
                        ${track.title}
                    </div>

                    <div class="card-meta">
                        ${track.user.name}
                    </div>

                </div>
            `;

            card.onclick = () => {
                loadPlayer(track);
            };

            row.appendChild(card);

        });

        section.appendChild(row);

        sections.appendChild(section);

    } catch (err) {

        console.error(err);

    }
}

/* Load homepage */

async function loadHomepage() {
    await createTrending();
    const sections = [
        ["Chill", "chill"],
        ["EDM", "edm"],
        ["Lofi", "lofi"],
        ["Remix", "remix"],
        ["Night Drive", "night"],
        ["Sad", "sad"],
        ["Gaming", "gaming"],
        ["Electronic", "electronic"],
        ["Relax", "relax"],
        ["Hip Hop", "hip hop"],
        ["Pop", "pop"],
    ];

    await Promise.all(
        sections.map(
            ([title, query]) =>
                createSection(title, query)
        )
    );
}
loadHomepage();