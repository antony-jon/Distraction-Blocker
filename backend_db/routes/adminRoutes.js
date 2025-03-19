const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, uniqueId } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        const newAdmin = new Admin({ name, email, password, uniqueId, blockedURLs: [] });
        await newAdmin.save();
        res.json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/add-blocked-url", async (req, res) => {
    try {
        const { adminId, url } = req.body;
        const admin = await Admin.findById(adminId);
        if (!admin) return res.status(400).json({ message: "Admin not found" });

        admin.blockedURLs.push(url);
        await admin.save();
        res.json({ message: "URL added to block list" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
