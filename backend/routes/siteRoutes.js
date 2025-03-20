const express = require("express");
const router = express.Router();
const BlockedSite = require("../models/BlockedSite");

// 📌 Get all blocked sites (Filtered by Admin, Parent, or Service Provider)
router.get("/list", async (req, res) => {
    const { adminCode, userType, addedBy } = req.query;

    if (!userType) {
        return res.status(400).json({ success: false, message: "User Type is required!" });
    }

    try {
        let filter = { $or: [{ category: "unproductive" }] }; // Always include unproductive sites

        // If Parent, filter by their entries (now filtering by email)
        if (userType === "Parent" && addedBy) {
            filter.$or.push({ userType: "Parent", addedBy });
        }

        // If Service Provider, filter by adminCode
        if (userType === "ServiceProvider" && adminCode) {
            filter.$or.push({ userType: "ServiceProvider", adminCode });
        }

        // If Admin, return all
        if (userType === "Admin") {
            filter = {}; // Admins can see everything
        }

        const blockedSites = await BlockedSite.find(filter);
        res.json({ success: true, blockedSites });
    } catch (error) {
        console.error("🔥 Error fetching blocked sites:", error);
        res.status(500).json({ success: false, message: "Server Error!" });
    }
});

// 📌 Add a new blocked site
router.post("/add", async (req, res) => {
    const { url, userType, addedBy, adminCode } = req.body;

    console.log("🔹 Received Data:", { url, userType, addedBy, adminCode });

    if (!url || !userType || !addedBy) {
        console.log("❌ Missing required fields!");
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newBlockedSite = new BlockedSite({
            url,
            userType,
            addedBy,  // ✅ Now stored as email
            adminCode
        });

        await newBlockedSite.save();
        console.log("✅ Site blocked successfully!");
        res.status(201).json({ success: true, message: "Site blocked successfully!" });
    } catch (error) {
        console.error("🔥 Error blocking site:", error);
        res.status(500).json({ success: false, message: "Error blocking site", error });
    }
});

module.exports = router;
