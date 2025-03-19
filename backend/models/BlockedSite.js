const mongoose = require("mongoose");

const blockedSiteSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    category: { type: String, enum: ["unproductive", "custom"], default: "custom" }, // 📌 Allow filtering
    addedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "userType" }, // 📌 Dynamic reference
    userType: { type: String, enum: ["Admin", "Parent", "ServiceProvider"], required: true }, // 📌 Who added it
    adminCode: { type: String }, // 📌 Only for Service Providers
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BlockedSite", blockedSiteSchema);
