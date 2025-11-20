// Save note (simple)
document.getElementById("saveBtn").addEventListener("click", () => {
    const title = document.getElementById("titleInput").value.trim();
    const content = document.getElementById("contentInput").value.trim();

    if (!title || !content) {
        alert("Please fill both Title and Content");
        return;
    }

    // if key exists, it will overwrite — you can change this behaviour if needed
    localStorage.setItem(title, content);

    // clear inputs
    document.getElementById("titleInput").value = "";
    document.getElementById("contentInput").value = "";

    displayNotes();
});

// Main function: iterate localStorage and render cards
function displayNotes() {
    const container = document.getElementById("notesContainer");
    if (!container) {
        console.error("notesContainer missing in DOM");
        return;
    }

    // clear previous
    container.innerHTML = "";

    // If no items
    if (localStorage.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "No notes saved yet.";
        empty.style.color = "var(--muted)";
        container.appendChild(empty);
        return;
    }

    // iterate keys in a stable order (optional: sort alphabetically)
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
    }
    keys.sort((a, b) => a.localeCompare(b)); // optional

    keys.forEach((key) => {
        const value = localStorage.getItem(key);

        // create card
        const card = document.createElement("article");
        card.className = "note-card";

        // title row
        const titleRow = document.createElement("div");
        titleRow.className = "note-title";

        const h3 = document.createElement("h3");
        h3.textContent = key;

        titleRow.appendChild(h3);

        // content
        const contentP = document.createElement("div");
        contentP.className = "note-content";
        contentP.textContent = value;

        // actions (delete + copy)
        const actions = document.createElement("div");
        actions.className = "card-actions";

        const copyBtn = document.createElement("button");
        copyBtn.className = "action-btn";
        copyBtn.textContent = "Copy";
        copyBtn.title = "Copy content";
        copyBtn.addEventListener("click", () => {
            navigator.clipboard
                ?.writeText(value)
                .then(() => {
                    copyBtn.textContent = "Copied";
                    setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
                })
                .catch(() => alert("Copy failed"));
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn delete fa-solid fa-trash";
        deleteBtn.textContent = '';
        deleteBtn.title = "Delete this note";
        deleteBtn.addEventListener("click", () => {
            if (confirm(`Delete note "${key}" ?`)) {
                localStorage.removeItem(key);
                displayNotes(); // re-render
            }
        });

        // actions.appendChild(copyBtn);
        actions.appendChild(deleteBtn);

        // assemble card
        card.appendChild(titleRow);
        card.appendChild(contentP);
        card.appendChild(actions);

        container.appendChild(card);
    });
}

// show on load
window.addEventListener("DOMContentLoaded", displayNotes);
