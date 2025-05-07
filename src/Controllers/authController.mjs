import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/AuthModel.mjs';

// Register User
export const register = async (req, res) => {
    try {
        const { name, email, phone_number, password, isAdmin } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or phone number" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            phone_number,
            isAdmin: isAdmin || false, // optional
            password_hash,
        });

        res.status(201).json({ message: "User registered successfully", userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        const user = await User.findOne({ 
            $or: [
                { email: emailOrPhone }, 
                { phone_number: emailOrPhone }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, 'myrandomdevsecretkey12345', { expiresIn: '7d' });

        res.json({ 
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                balance: user.balance,
                kyc_status: user.kyc.status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
};

// Get Profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            balance: user.balance,
            kyc_status: user.kyc.status,
            linked_bank_accounts: user.linked_bank_accounts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during profile fetch" });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email, phone_number } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, email, phone_number, updated_at: Date.now() },
            { new: true }
        );

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during profile update" });
    }
};

// Logout User
export const logout = async (req, res) => {
    // Logout handled on client side by deleting token
    res.json({ message: "Logged out successfully" });
};
