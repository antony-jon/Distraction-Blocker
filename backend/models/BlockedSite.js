const mongoose = require("mongoose");

const blockedSiteSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

module.exports = mongoose.model("BlockedSite", blockedSiteSchema);
