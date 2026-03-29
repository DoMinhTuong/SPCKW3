const auth = firebase.auth();

const form =
  document.getElementById("loginForm");

const message =
  document.getElementById("message");

const googleBtn =
  document.getElementById("googleBtn");


// =======================
// EMAIL LOGIN
// =======================

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email =
    document.getElementById("email")
      .value.trim();

  const password =
    document.getElementById("password")
      .value;

  try {

    await auth
      .signInWithEmailAndPassword(
        email,
        password
      );

    message.textContent =
      "Login successful!";

    message.style.color =
      "green";

    setTimeout(() => {

      window.location.href =
        "/Html/mainmenu.html";

    }, 1000);

  }

  catch (error) {

    message.textContent =
      error.message;

    message.style.color =
      "red";

  }

});


document.addEventListener("DOMContentLoaded", () => {

  const auth = firebase.auth();

  const form =
    document.getElementById("loginForm");

  const message =
    document.getElementById("message");

  const googleBtn =
    document.getElementById("googleBtn");


  // =======================
  // EMAIL LOGIN
  // =======================

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("email")
        .value.trim();

    const password =
      document.getElementById("password")
        .value;

    try {

      await auth
        .signInWithEmailAndPassword(
          email,
          password
        );

      message.textContent =
        "Login successful!";

      message.style.color =
        "green";

      setTimeout(() => {

        window.location.href =
          "/Html/mainmenu.html";

      }, 1000);

    }

    catch (error) {

      message.textContent =
        error.message;

      message.style.color =
        "red";

    }

  });


  // =======================
  // GOOGLE LOGIN
  // =======================

  googleBtn.addEventListener("click", () => {

    const provider =
      new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)

      .then(() => {

        message.style.color = "green";

        message.innerText =
          "Google login successful!";

        setTimeout(() => {

          window.location.href =
            "/Html/mainmenu.html";

        }, 1000);

      })

      .catch((error) => {

        message.style.color = "red";

        message.innerText =
          error.message;

      });

  });

});