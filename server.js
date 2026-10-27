require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ============================================
//   Port Configuration
// ============================================
// Use the port from the environment (Render/VPS), or 8080 if nothing is set.
// This avoids the "address already in use" error if 3000 is taken.
const PORT = process.env.PORT || 8080; 

// ============================================
//   Middleware
// ============================================
app.use(cors({ origin: "*" })); // Allow any website to connect
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend files (HTML/CSS/JS) from the public folder
app.use(express.static(path.join(__dirname, "public")));

// ============================================
//   API Routes (Connects Web to Heroku Bot)
// ============================================
// This loads the api.js file we created earlier
try {
    require("./api")(app);
    console.log("✅ API Gateway routes loaded.");
} catch (e) {
    console.error("❌ Failed to load api.js:", e.message);
}

// ============================================
//   Catch-All for SPA (Optional but good practice)
// ============================================
// If someone visits a URL that doesn't exist, send them back to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================================
//   Start Server
// ============================================
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`=========================================`);
    console.log(`🌐 Web Panel & API Gateway running on port ${PORT}`);
    console.log(`🔗 Connected to Bot at: ${process.env.BOT_API_URL || "Default Heroku URL"}`);
    console.log(`=========================================`);
});

// Handle graceful shutdown (prevents EADDRINUSE on restart)
process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received. Shutting down gracefully...");
    server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
    });
});

// Catch port in use errors
server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`💡 Try running: fuser -k ${PORT}/tcp`);
        process.exit(1);
    } else {
        console.error("❌ Server error:", e);
    }
});