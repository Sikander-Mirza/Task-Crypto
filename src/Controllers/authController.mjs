import ZenBank from '../Models/ZenBankModel.mjs'; // new
import User from '../Models/AuthModel.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone_number,
      password,
      transaction_pin,
      cnic,
      account_number,
      wallet_topup
    } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // 2. Validate CNIC + account number in ZenBank
    const bankRecord = await ZenBank.findOne({ cnic, account_number });
    if (!bankRecord)
      return res.status(400).json({ message: "No matching ZenBank account found" });

    // 3. Check if already linked to a ZenPay user
    const alreadyLinked = await User.findOne({ "linked_bank_accounts.account_number": account_number });
    if (alreadyLinked)
      return res.status(400).json({ message: "This bank account is already linked to another user" });

    // 4. Wallet top-up checks
    if (wallet_topup < 500) {
      return res.status(400).json({ message: "Minimum wallet top-up is PKR 500" });
    }

    if (bankRecord.balance < wallet_topup) {
      return res.status(400).json({ message: "Insufficient ZenBank balance" });
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 6. Deduct from ZenBank
    bankRecord.balance -= wallet_topup;
    await bankRecord.save();

    // 7. Create bankAccount object
    const bankAccount = {
      bank_account_id: new mongoose.Types.ObjectId(),
      bank_name: "ZenBank",
      account_number: bankRecord.account_number,
      account_title: bankRecord.account_title,
      balance: bankRecord.balance
    };

    // 8. Create user (with wallet balance)
const user = await User.create({
  name,
  email,
  phone_number,
  password_hash,
  transaction_pin,
  wallet_balance: wallet_topup, // ✅ properly set here
  linked_bank_accounts: [bankAccount]
});


    res.status(201).json({
      message: "Registered successfully",
      user
    });

  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ 
            $or: [
                { email: email }, 
                { phone_number: email }
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
                balance: user.wallet_balance,
                kyc_status: user.kyc.status,
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
