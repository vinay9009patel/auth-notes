// ================= CONFIG =================
const BASE_URL = "https://auth-notes-ez2q.onrender.com";

// ================= DARK MODE =================
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

// ================= REGISTER =================
async function register() {
  const email = document.getElementById("rEmail").value.trim();
  const password = document.getElementById("rPass").value.trim();

  if (!email || !password) {
    alert("Email aur password bhar");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    alert("Register error");
  }
}

// ================= LOGIN =================
async function login() {
  const email = document.getElementById("lEmail").value.trim();
  const password = document.getElementById("lPass").value.trim();

  if (!email || !password) {
    alert("Email aur password bhar");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful ✅");
      loadNotes();
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Login error");
  }
}

// ================= ADD NOTE =================
async function addNote() {
  const noteInput = document.getElementById("noteInput");
  const text = noteInput.value.trim();

  if (!text) return;

  try {
    await fetch(`${BASE_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({ text })
    });

    noteInput.value = "";
    loadNotes();
  } catch (err) {
    alert("Note add error");
  }
}

// ================= LOAD NOTES =================
async function loadNotes() {
  const list = document.getElementById("notesList");
  list.innerHTML = "";

  try {
    const res = await fetch(`${BASE_URL}/api/notes`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });

    const notes = await res.json();

    notes.forEach(note => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${note.text}
        <button onclick="deleteNote('${note._id}')">❌</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    alert("Load notes error");
  }
}

// ================= DELETE NOTE =================
async function deleteNote(id) {
  try {
    await fetch(`${BASE_URL}/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });
    loadNotes();
  } catch (err) {
    alert("Delete error");
  }
}

// ================= ENTER KEY SUPPORT =================
document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    if (document.activeElement.id === "noteInput") {
      addNote();
    } else {
      login();
    }
  }
});

// ================= AUTO LOAD NOTES =================
if (localStorage.getItem("token")) {
  loadNotes();
}