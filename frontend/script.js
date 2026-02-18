let isLogin = true;
const API_URL = "http://localhost:3000/api";

/* ENTER KEY HANDLING */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (document.getElementById("notesSection").style.display === "block") {
      addNote();
    } else {
      mainAction();
    }
  }
});

/* TOGGLE LOGIN / REGISTER */
function toggle() {
  isLogin = !isLogin;
  document.getElementById("title").innerText = isLogin ? "Login" : "Register";
  document.getElementById("mainBtn").innerText = isLogin ? "Login" : "Register";
  document.getElementById("name").style.display = isLogin ? "none" : "block";
}

/* LOGIN / REGISTER */
async function mainAction() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password || (!isLogin && !name)) {
    return alert("Fill all fields");
  }

  const body = isLogin ? { email, password } : { name, email, password };
  const endpoint = isLogin ? "/auth/login" : "/auth/register";

  const res = await fetch(API_URL + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  if (data.token) {
    localStorage.setItem("token", data.token);
    showNotes();
  } else {
    toggle();
  }
}

/* SHOW NOTES */
function showNotes() {
  document.querySelector(".card").style.display = "none";
  document.getElementById("notesSection").style.display = "block";
  fetchNotes();
}

/* FETCH NOTES */
async function fetchNotes() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const notes = await res.json();

  const list = document.getElementById("notesList");
  list.innerHTML = "";

  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note-item";
    div.innerHTML = `
      <span>${note.text}</span>
      <button onclick="deleteNote('${note._id}')">Delete</button>
    `;
    list.appendChild(div);
  });
}

/* ADD NOTE */
async function addNote() {
  const text = document.getElementById("noteText").value;
  if (!text) return;

  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  document.getElementById("noteText").value = "";
  fetchNotes();
}

/* DELETE NOTE */
async function deleteNote(id) {
  const token = localStorage.getItem("token");
  await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchNotes();
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("token");
  location.reload();
}

/* DARK MODE */
function toggleTheme() {
  document.body.classList.toggle("dark");
}