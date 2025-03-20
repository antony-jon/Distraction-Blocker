const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ServiceProvider = require("../models/serviceProviderModel");


const router = express.Router();

router.post("/signup", async (req, res) => {
    const { email, password, uniqueCode } = req.body;

    try {
        const existingUser = await ServiceProvider.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

       
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

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const serviceProvider = await ServiceProvider.findOne({ email });
        if (!serviceProvider) {
            return res.status(400).json({ message: "User not found!" });
        }

     
        const isMatch = await bcrypt.compare(password, serviceProvider.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        res.status(200).json({ message: "Login successful!", uniqueCode: serviceProvider.uniqueCode });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});

router.post("/verify-admin", async (req, res) => {
    const { code } = req.body; 

    try {
        const admin = await ServiceProvider.findOne({uniqueCode: code  });

        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid code" });
        }
        const token = jwt.sign({ id: admin._id }, "yourSecretKey", { expiresIn: "1h" });

        res.json({ success: true, message: "Admin verified", token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
