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
firebase.auth().onAuthStateChanged((user) => {
  // Nếu chưa đăng nhập -> chuyển về login
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Elements
  const profilePicture = document.getElementById("profilePicture");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const navbarAvatar = document.getElementById("userAvatar");

  // Profile Picture
  if (user.photoURL) {
    profilePicture.src = user.photoURL;
    navbarAvatar.src = user.photoURL;
  } else {
    profilePicture.src = "/Img/dpfp.jpg";
    navbarAvatar.src = "/Img/dpfp.jpg";
  }

  // Name
  profileName.textContent = user.displayName || "Unknown User";

  // Email
  profileEmail.textContent = user.email || "No Email";
});