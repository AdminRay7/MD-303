require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios"); // You will need to run: npm install axios

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_API_URL = process.env.BOT_API_URL;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ============================================
//   PROXY ROUTES (Frontend -> Web Server -> Heroku Bot)
// ============================================

// 1. Generate Pairing Code
app.post("/api/pair", async (req, res) => {
    try {
        const response = await axios.post(`${BOT_API_URL}/api/pair`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Bot server offline" });
    }
});

// 2. Check Status
app.get("/api/status", async (req, res) => {
    try {
        const response = await axios.get(`${BOT_API_URL}/api/pair/status`, { params: req.query });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Bot server offline" });
    }
});

// 3. Unpair
app.post("/api/unpair", async (req, res) => {
    try {
        const response = await axios.post(`${BOT_API_URL}/api/unpair`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Bot server offline" });
    }
});

// Serve the HTML frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`🌐 Web Panel running on port ${PORT}`);
    console.log(`🔗 Connected to Bot API at: ${BOT_API_URL}`);
});