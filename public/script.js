const $ = id => document.getElementById(id);
const out = $("out"), status = $("status"), btn = $("btn"), phoneInput = $("phone");
let pollTimer = null;
const sessionId = "sess-" + Math.random().toString(36).slice(2, 10);

function setStatus(msg, color) {
    status.textContent = msg || "";
    status.style.color = color || "var(--text-sub)";
}

function stopPoll() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

function startPoll() {
    stopPoll();
    pollTimer = setInterval(async () => {
        try {
            // Calls OUR server, which then calls Heroku
            const r = await fetch(`/api/status?sessionId=${encodeURIComponent(sessionId)}`);
            const j = await r.json();
            
            if (j.connected) {
                stopPoll();
                out.innerHTML = `<div class="msg ok">✅ Device Linked Successfully!<br><small>${j.jid || ""}</small></div>`;
                setStatus("Paired successfully.", "var(--ok)");
                btn.disabled = false;
                btn.textContent = "Link Another Device";
            } else if (j.exists) {
                setStatus("Waiting for you to enter the code on WhatsApp…", "var(--primary)");
            } else {
                stopPoll();
                setStatus("Session dropped or logged out.", "var(--err)");
                out.innerHTML = `<div class="msg err">Session closed. Try again.</div>`;
                btn.disabled = false;
                btn.textContent = "Get Pairing Code";
            }
        } catch {
            stopPoll();
            setStatus("Connection to server lost.", "var(--err)");
            btn.disabled = false;
        }
    }, 3000);
}

btn.onclick = async () => {
    const num = phoneInput.value.replace(/\D/g, "");
    out.innerHTML = "";
    stopPoll();

    if (num.length < 10 || num.length > 15) {
        out.innerHTML = '<div class="msg err">Phone number must be 10-15 digits.</div>';
        return;
    }

    btn.disabled = true;
    btn.textContent = "Requesting...";
    setStatus("Generating secure code…");

    try {
        // Calls OUR server, which then calls Heroku
        const r = await fetch("/api/pair", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, num })
        });
        const j = await r.json();
        
        if (!r.ok) throw new Error(j.error || "Failed to generate code");
        
        out.innerHTML = `<div class="code-display">${j.code}</div>`;
        setStatus("Enter this code in WhatsApp → Linked Devices.", "var(--primary)");
        btn.textContent = "Waiting for link...";
        
        startPoll();
    } catch (e) {
        out.innerHTML = `<div class="msg err">${e.message}</div>`;
        setStatus("");
        btn.disabled = false;
        btn.textContent = "Get Pairing Code";
    }
};