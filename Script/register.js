const auth = firebase.auth();
const db = firebase.firestore();

const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await db.collection("users").doc(user.uid).set({
      name: name,
      email: email,
      createdAt: new Date()
    });

    message.textContent = "Đăng kí tài khoản thành công!";
    message.style.color = "green";
    form.reset();

  } catch (error) {
    message.textContent = error.message;
    message.style.color = "red";
  }
  googleBtn.addEventListener("click", () => {

    const provider =
      new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)

      .then(() => {

        message.style.color = "green";

        message.innerText =
          "Đăng nhập qua tài khoàn Google thành công!";

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