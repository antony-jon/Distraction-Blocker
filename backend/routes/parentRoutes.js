const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Parent = require("../models/Parent");

const router = express.Router();

// 🟢 Parent Sign-Up Route
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email already exists
        const existingParent = await Parent.findOne({ email });
        if (existingParent) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new parent to DB
        const newParent = new Parent({ email, password: hashedPassword });
        await newParent.save();

        res.json({ success: true, message: "Signup successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 🟢 Parent Sign-In Route
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if parent exists
        const parent = await Parent.findOne({ email });

        if (!parent) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, parent.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: parent._id }, "yourSecretKey", { expiresIn: "1h" });

        res.json({ success: true, message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/verify-password", async (req, res) => {
    const { email,password } = req.body;

    try {
        // Check if parent exists
        const parent = await Parent.findOne({ email });

        if (!parent) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, parent.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: parent._id }, "yourSecretKey", { expiresIn: "1h" });

        res.json({ success: true, message: "Unblocked", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
