const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// Schema
const schemaData = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
}, {
    timestamps: true
});

// Model
const UserModel = mongoose.model("user", schemaData);

// Connect to the database
async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

connectToDatabase();

// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error fetching users" });
    }
});

// Create a new user
app.post("/create", async (req, res) => {
    try {
        const newUser = new UserModel(req.body);
        await newUser.save();
        res.json({ success: true, message: "Data saved successfully", data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error creating user" });
    }
});

// Update a user by ID
app.put("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.json({ success: true, message: "Data updated successfully", data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error updating user" });
    }
});

// Delete a user by 
app.delete("/delete/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await UserModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully", data: deletedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error deleting user" });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
