const express = require("express");
const bcrypt = require("bcryptjs");
const ServiceProvider = require("../models/serviceProviderModel");

const router = express.Router();

// Service Provider Signup
router.post("/signup", async (req, res) => {
    const { email, password, uniqueCode } = req.body;

    try {
        const existingUser = await ServiceProvider.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newServiceProvider = new ServiceProvider({
            email,
            password: hashedPassword,
            uniqueCode,
        });

        await newServiceProvider.save();
        res.status(201).json({ message: "Signup successful!", uniqueCode });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});

// Service Provider Sign-in
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const serviceProvider = await ServiceProvider.findOne({ email });
        if (!serviceProvider) {
            return res.status(400).json({ message: "User not found!" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, serviceProvider.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        res.status(200).json({ message: "Login successful!", uniqueCode: serviceProvider.uniqueCode });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});

module.exports = router;
