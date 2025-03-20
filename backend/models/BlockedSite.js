const mongoose = require("mongoose");

const BlockedSiteSchema = new mongoose.Schema({
    url: { type: String, required: true },
    userType: { type: String, required: true },
    addedBy: { type: String, required: true },  // 🔹 Changed from ObjectId to String (email)
    adminCode: { type: String, default: "" }
});

module.exports = mongoose.model("BlockedSite", BlockedSiteSchema);
