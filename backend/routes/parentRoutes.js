const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Parent = require("../models/Parent");

const router = express.Router();


router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const existingParent = await Parent.findOne({ email });
        if (existingParent) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const newParent = new Parent({ email, password: hashedPassword });
        await newParent.save();

        res.json({ success: true, message: "Signup successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const parent = await Parent.findOne({ email });

        if (!parent) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

      
        const isMatch = await bcrypt.compare(password, parent.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

      
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
   
        const parent = await Parent.findOne({ email });

        if (!parent) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

    
        const isMatch = await bcrypt.compare(password, parent.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Password" });
        }

      
        const token = jwt.sign({ id: parent._id }, "yourSecretKey", { expiresIn: "1h" });

        res.json({ success: true, message: "Unblocked", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
