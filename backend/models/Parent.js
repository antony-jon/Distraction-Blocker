const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("Parent", parentSchema);
