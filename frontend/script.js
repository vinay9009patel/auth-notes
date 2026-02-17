let isLogin = true;
const API_URL = "http://localhost:3000/api";

window.onload = () => {
  const token = localStorage.getItem("token");
  if (token) {
    showNotes();
  }
};

function toggle() {
  isLogin = !isLogin;
  document.getElementById("title").innerText = isLogin ? "Login" : "Register";
  document.getElementById("mainBtn").innerText = isLogin ? "Login" : "Register";
  document.getElementById("name").style.display = isLogin ? "none" : "block";
}

async function mainAction() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password || (!isLogin && !name)) {
    return alert("Please fill all fields");
  }

  const body = isLogin ? { email, password } : { name, email, password };
  const endpoint = isLogin ? "/auth/login" : "/auth/register";

  try {
    const res = await fetch(API_URL + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Action failed");

    alert(data.message || "Success");

    if (data.token) {
      localStorage.setItem("token", data.token);
      showNotes();
    } else if (!isLogin) {
      toggle(); // Switch to login after registration
    }
  } catch (err) {
    alert(err.message);
  }
}

function showNotes() {
  document.querySelector(".card").style.display = "none";
  document.getElementById("notesSection").style.display = "block";
  fetchNotes();
}

async function fetchNotes() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const notes = await res.json();
    const list = document.getElementById("notesList");
    list.innerHTML = "";
    notes.forEach((note) => {
      const div = document.createElement("div");
      div.className = "note-item";
      div.innerHTML = `
        <span>${note.text}</span>
        <button onclick="deleteNote('${note._id}')">Delete</button>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to fetch notes", err);
  }
}

async function addNote() {
  const text = document.getElementById("noteText").value;
  const token = localStorage.getItem("token");
  if (!text) return alert("Please enter text");

  try {
    const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      document.getElementById("noteText").value = "";
      fetchNotes();
    }
  } catch (err) {
    alert("Error adding note");
  }
}

async function deleteNote(id) {
  const token = localStorage.getItem("token");
  try {
    await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  } catch (err) {
    alert("Error deleting note");
  }
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}
