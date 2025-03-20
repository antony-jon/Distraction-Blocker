const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const parentRoutes = require("./routes/parentRoutes");
const serviceProviderRoutes = require("./routes/serviceProviderRoutes");
const siteRoutes = require("./routes/siteRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/parent", parentRoutes);
app.use("/api/service-provider", serviceProviderRoutes);
app.use("/api/sites", siteRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
