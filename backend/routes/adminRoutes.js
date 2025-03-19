const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
