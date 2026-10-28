const axios = require("axios");

// Get the Bot's URL from the environment variables, or use the default
const BOT_API_URL = process.env.BOT_API_URL || "https://md-303xmd-88c996956856.herokuapp.com";

module.exports = function(app) {
    // ============================================
    //   1. Generate Pairing Code
    // ============================================
    app.post("/api/pair", async (req, res) => {
        try {
            const response = await axios.post(`${BOT_API_URL}/api/pair`, req.body, { timeout: 30000 });
            res.json(response.data);
        } catch (error) {
            console.error("Heroku Bot Error:", error.response?.data || error.message);
            res.status(error.response?.status || 500).json(
                error.response?.data || { error: "Bot server is offline or taking too long." }
            );
        }
    });

    // ============================================
    //   2. Check Pairing Status
    // ============================================
    app.get("/api/status", async (req, res) => {
        try {
            const response = await axios.get(`${BOT_API_URL}/api/pair/status`, { 
                params: req.query, 
                timeout: 10000 
            });
            res.json(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).json(
                error.response?.data || { error: "Bot server offline" }
            );
        }
    });

    // ============================================
    //   3. Unpair / Disconnect
    // ============================================
    app.post("/api/unpair", async (req, res) => {
        try {
            // Assuming you add an unpair route to Repo 1 later
            const response = await axios.post(`${BOT_API_URL}/api/unpair`, req.body, { timeout: 10000 });
            res.json(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).json(
                error.response?.data || { error: "Bot server offline" }
            );
        }
    });
};