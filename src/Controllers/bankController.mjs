import User from '../Models/AuthModel.mjs';
import mongoose from 'mongoose';

// Link Bank Account
export const linkBankAccount = async (req, res) => {
    try {
      const { bank_name, account_number, account_title } = req.body;
  
      if (!bank_name || !account_number || !account_title) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // ✅ Generate random balance
      const balance = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
  
      const bankAccount = {
        bank_account_id: new mongoose.Types.ObjectId(),
        bank_name,
        account_number,
        account_title,
        balance
      };
  
      const user = await User.findById(req.userId);
      user.linked_bank_accounts.push(bankAccount);
      await user.save();
  
      res.status(201).json({
        message: "Bank account linked successfully",
        bankAccount
      });
    } catch (error) {
      console.error("Bank link error:", error.message);
      res.status(500).json({ message: "Error linking bank account" });
    }
  };
  

// Get Linked Bank Accounts
export const getLinkedAccounts = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        res.json({
            linked_bank_accounts: user.linked_bank_accounts || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bank accounts" });
    }
};
