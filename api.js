const axios = require("axios");

// This URL comes from your Render Environment Variables (.env)
const BOT_API_URL = process.env.BOT_API_URL || "https://md-303-7917fcc74a7b.herokuapp.com";

module.exports = function(app) {
    // 1. Web requests a pairing code
    app.post("/api/pair", async (req, res) => {
        try {
            // Forward the request to Heroku
            const response = await axios.post(`${BOT_API_URL}/api/pair`, req.body);
            res.json(response.data);
        } catch (error) {
            console.error("Heroku Bot Error:", error.message);
            res.status(error.response?.status || 500).json(
                error.response?.data || { error: "Bot server is currently offline." }
            );
        }
    });

    // 2. Web checks pairing status
    app.get("/api/status", async (req, res) => {
        try {
            // Forward the request to Heroku
            const response = await axios.get(`${BOT_API_URL}/api/pair/status`, { params: req.query });
            res.json(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).json(
                error.response?.data || { error: "Bot server is currently offline." }
            );
        }
    });

    // 3. Web requests to unpair a device
    app.post("/api/unpair", async (req, res) => {
        try {
            const response = await axios.post(`${BOT_API_URL}/api/unpair`, req.body);
            res.json(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).json(
                error.response?.data || { error: "Bot server is currently offline." }
            );
        }
    });
};