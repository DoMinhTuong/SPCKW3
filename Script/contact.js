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

document.getElementById("playlistBtn").onclick = () => {
    window.location.href = "playlist.html";
};

document.getElementById("profileBtn").onclick = () => {
    window.location.href = "profile.html"
};

document.getElementById("contactBtn").onclick = () => {
    location.reload();
};

document.getElementById("logoutBtn").onclick = () => {

    auth.signOut().then(() => {

        window.location.href = "login.html";

    });

};

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

