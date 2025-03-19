const express = require("express");
const BlockedSite = require("../models/BlockedSite");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", authMiddleware, async (req, res) => {
    const { url } = req.body;
    const site = new BlockedSite({ url, addedBy: req.admin.id });
    await site.save();
    res.json({ message: "Site added to block list" });
});

router.get("/list", authMiddleware, async (req, res) => {
    const sites = await BlockedSite.find();
    res.json(sites);
});

module.exports = router;