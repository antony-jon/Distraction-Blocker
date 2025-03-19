// routes/siteRoutes.js
const express = require("express");
const router = express.Router();
const BlockedSite = require("../models/BlockedSite");

router.get("/list", async (req, res) => {
    const { adminCode } = req.query;

    if (!adminCode) {
        return res.status(400).json({ success: false, message: "Admin Code is required!" });
    }

    try {
        const blockedSites = await BlockedSite.find({ adminCode });
        const unproductiveSites = await BlockedSite.find({ category: "unproductive" });

        res.json({ success: true, blockedSites, unproductiveSites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error!" });
    }
});

module.exports = router;
