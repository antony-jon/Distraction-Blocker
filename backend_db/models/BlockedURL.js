const mongoose = require("mongoose");

const BlockedURLSchema = new mongoose.Schema({
    adminId: { type: String, required: true },
    url: { type: String, required: true },
});

module.exports = mongoose.model("BlockedURL", BlockedURLSchema);
