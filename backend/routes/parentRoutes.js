const express = require("express");
const bcrypt = require("bcrypt");
const Parent = require("../models/Parent");

const router = express.Router();

// Parent Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Check if email is already used
        const existingParent = await Parent.findOne({ email });
        if (existingParent) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newParent = new Parent({ email, password: hashedPassword });

        await newParent.save();
        res.json({ success: true, message: "Signup successful" });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
