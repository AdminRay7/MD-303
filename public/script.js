const $ = id => document.getElementById(id);
const out = $("out"), status = $("status"), btn = $("btn"), phoneInput = $("phone");
let pollTimer = null;
const sessionId = "sess-" + Math.random().toString(36).slice(2, 10);

// ... (setStatus, stopPoll functions) ...

btn.onclick = async () => {
    const num = phoneInput.value.replace(/\D/g, "");
    // ...
    try {
        // Note the URL: It's just "/api/pair", NOT herokuapp.com
        const r = await fetch("/api/pair", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, num })
        });
        const j = await r.json();
        // ...
        out.innerHTML = `<div class="code-display">${j.code}</div>`;
        startPoll();
    } catch (e) { /* ... */ }
};

function startPoll() {
    pollTimer = setInterval(async () => {
        // Note the URL: It's just "/api/status", NOT herokuapp.com
        const r = await fetch(`/api/status?sessionId=${encodeURIComponent(sessionId)}`);
        const j = await r.json();
        // ...
    }, 3000);
}