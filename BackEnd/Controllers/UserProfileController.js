const mongoose = require("mongoose");
const UserProfile = require('../Models/UserProfile');

// Get all user details
exports.getAllUserDetails = async (req, res) => {
    try {
        const users = await UserDetails.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single user detail by ID
exports.getUserDetailById = async (req, res) => {
    try {
        const user = await UserDetails.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new user detail
exports.createUserDetail = async (req, res) => {
    try {
        // Ensure required fields are present in the body
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: 'Name, username, email, and password are required.' });
        }

        // Only allow the fields defined in the schema
        const validFields = ['name', 'username', 'email', 'password', 'githubLink', 'linkedinLink'];
        const filteredBody = Object.keys(req.body)
            .filter(key => validFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        const user = new UserDetails(filteredBody);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a user detail by ID
exports.updateUserDetail = async (req, res) => {
    try {
        // Ensure required fields are present in the body if updating essential data
        const { email } = req.body;
        if (email && !email.trim()) {
            return res.status(400).json({ error: 'Email cannot be empty' });
        }

        // Only allow the fields defined in the schema
        const validFields = ['name', 'username', 'email', 'password', 'githubLink', 'linkedinLink'];
        const filteredBody = Object.keys(req.body)
            .filter(key => validFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        const user = await UserDetails.findByIdAndUpdate(req.params.id, filteredBody, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a user detail by ID
exports.deleteUserDetail = async (req, res) => {
    try {
        const user = await UserDetails.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
