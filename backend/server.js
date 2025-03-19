const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const parentRoutes = require("./routes/parentRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/parent", parentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
