const express = require("express");
const router = express.Router();
const BlockedSite = require("../models/BlockedSite");

// 📌 Get all blocked sites (Filtered by Admin, Parent, or Service Provider)
router.get("/list", async (req, res) => {
    const { adminCode, userType } = req.query;

    if (!userType) {
        return res.status(400).json({ success: false, message: "User Type is required!" });
    }

    try {
        let filter = { $or: [{ category: "unproductive" }] }; // Always include unproductive sites

        // If Parent, filter by their entries
        if (userType === "Parent") {
            filter.$or.push({ userType: "Parent" });
        }

        // If Service Provider, filter by adminCode
        if (userType === "ServiceProvider" && adminCode) {
            filter.$or.push({ userType: "ServiceProvider", adminCode });
        }

        // If Admin, return all
        if (userType === "Admin") {
            filter = {};
        }

        const blockedSites = await BlockedSite.find(filter);
        res.json({ success: true, blockedSites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error!" });
    }
});

// 📌 Add a new blocked site
router.post("/add", async (req, res) => {
    const { url, userType, addedBy, adminCode } = req.body;

    if (!url || !userType || !addedBy) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newBlockedSite = new BlockedSite({ url, userType, addedBy, adminCode });
        await newBlockedSite.save();
        res.status(201).json({ success: true, message: "Site blocked successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error blocking site", error });
    }
});

module.exports = router;
