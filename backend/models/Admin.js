const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adminCode: { type: String, required: true, unique: true },
});
module.exports = mongoose.model("Admin", adminSchema);