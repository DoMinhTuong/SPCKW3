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

const miniAudio =
document.getElementById("miniAudio");

const miniPlay =
document.getElementById("miniPlay");

const miniPause =
document.getElementById("miniPause");

const miniProgress =
document.getElementById("miniProgress");

const miniTitle =
document.getElementById("miniTitle");

const miniArtist =
document.getElementById("miniArtist");

const miniThumb =
document.getElementById("miniThumb");

/* Play Button */

miniPlay.onclick = () => {

  miniAudio.play();

};

/* Pause Button */

miniPause.onclick = () => {

  miniAudio.pause();

};

/* Progress Update */

miniAudio.addEventListener(
"timeupdate",

() => {

  const percent =
  (miniAudio.currentTime /
   miniAudio.duration) * 100;

  miniProgress.style.width =
  percent + "%";

});