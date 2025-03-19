const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/adminRoutes");
const siteRoutes = require("./routes/siteRoutes");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/sites", siteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));