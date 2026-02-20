console.log("Script loaded ✅");

let isLogin = true;
const API_URL = "https://auth-notes-ez2q.onrender.com/api";
/* ---------- DARK MODE (PURE FRONTEND) ---------- */
const darkBtn = document.getElementById("darkBtn");

darkBtn.onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* ---------- AUTH TOGGLE ---------- */
function toggle() {
  isLogin = !isLogin;
  document.getElementById("title").innerText = isLogin ? "Login" : "Register";
  document.getElementById("mainBtn").innerText = isLogin ? "Login" : "Register";
  document.getElementById("name").style.display = isLogin ? "none" : "block";
}

/* ---------- LOGIN / REGISTER ---------- */
// ENTER key support for login/register
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const cardVisible = document.querySelector(".card")?.style.display !== "none";
    if (cardVisible) {
      mainAction(); // login/register button ka kaam
    }
  }
});
async function mainAction() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password || (!isLogin && !name)) {
    alert("Fill all fields");
    return;
  }

  const body = isLogin
    ? { email, password }
    : { name, email, password };

  const endpoint = isLogin ? "/auth/login" : "/auth/register";

  try {
    const res = await fetch(API_URL + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error");
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      showNotes();
    } else {
      alert("Registered, now login");
      toggle();
    }

  } catch (err) {
    alert("Backend not running");
  }
}

/* ---------- NOTES ---------- */
const noteInput = document.getElementById("noteText");
if (noteInput) {
  noteInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addNote(); // Add Note button ka kaam
    }
  });
}
function showNotes() {
  document.getElementById("authCard").style.display = "none";
  document.getElementById("notesSection").style.display = "block";
  fetchNotes();
}

async function fetchNotes() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(API_URL + "/notes", {
      headers: { Authorization: "Bearer " + token },
    });

    const notes = await res.json();
    const list = document.getElementById("notesList");
    list.innerHTML = "";

    notes.forEach(n => {
      const div = document.createElement("div");
      div.className = "note";
      div.innerHTML = `
        <span>${n.text}</span>
        <button onclick="deleteNote('${n._id}')">X</button>
      `;
      list.appendChild(div);
    });
  } catch {
    console.log("Notes fetch failed");
  }
}

async function addNote() {
  const text = document.getElementById("noteText").value;
  const token = localStorage.getItem("token");
  if (!text) return;

  await fetch(API_URL + "/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ text }),
  });

  document.getElementById("noteText").value = "";
  fetchNotes();
}

async function deleteNote(id) {
  const token = localStorage.getItem("token");
  await fetch(API_URL + "/notes/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  fetchNotes();
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.removeItem("token");
  location.reload();
}

/* ---------- AUTO LOGIN ---------- */
window.onload = () => {
  if (localStorage.getItem("token")) {
    showNotes();
  }
};