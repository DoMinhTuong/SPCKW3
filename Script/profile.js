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
    location.reload();
};

document.getElementById("contactBtn").onclick = () => {
    window.location.href = "contact.html"
};

document.getElementById("logoutBtn").onclick = () => {

    auth.signOut().then(() => {

        window.location.href = "login.html";

    });

};
