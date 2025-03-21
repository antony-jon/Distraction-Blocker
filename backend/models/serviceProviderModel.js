const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uniqueCode: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);
