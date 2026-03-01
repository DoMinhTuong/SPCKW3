const auth = firebase.auth();

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);

    message.textContent = "Login successful!";
    message.style.color = "green";

    // Redirect to main menu after login
    setTimeout(() => {
      window.location.href = "mainmenu.html";
    }, 1000);

  } catch (error) {
    message.textContent = error.message;
    message.style.color = "red";
  }
});