require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the frontend files (HTML/CSS/JS) from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Load the API connection logic
require("./api")(app);

// Start server
app.listen(PORT, () => {
    console.log(`🌐 Web Panel & API Gateway running on port ${PORT}`);
    console.log(`🔗 Connected to Bot at: ${process.env.BOT_API_URL || "Default Heroku URL"}`);
});