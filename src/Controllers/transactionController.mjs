import User from '../Models/AuthModel.mjs';
import Transaction from '../Models/TransactionModel.mjs';
import mongoose from 'mongoose';

// Transfer to another user
export const sendTransfer = async (req, res) => {
    try {
      const { amount, recipient_account_number, description } = req.body;
      const senderId = req.userId;
      const numericAmount = Number(amount);
  
      if (!recipient_account_number || !numericAmount) {
        return res.status(400).json({ message: "Recipient account number and amount are required." });
      }
  
      const sender = await User.findById(senderId);
      if (!sender) return res.status(404).json({ message: "Sender not found" });
  
      const senderBank = sender.linked_bank_accounts[0]; // assumes only one account linked
      if (senderBank.balance < numericAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
  
      // 🧠 Find recipient user by bank account number
      const recipient = await User.findOne({
        "linked_bank_accounts.account_number": recipient_account_number
      });
  
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found with provided account number" });
      }
  
      const recipientBank = recipient.linked_bank_accounts.find(
        acc => acc.account_number === recipient_account_number
      );
  
      if (!recipientBank) {
        return res.status(404).json({ message: "Recipient bank account not found" });
      }
  
      // 💸 Transfer balance
      senderBank.balance -= numericAmount;
      recipientBank.balance += numericAmount;
  
      await sender.save();
      await recipient.save();
  
      // 📄 Log transactions
      await Transaction.create({
        user_id: sender._id,
        amount: numericAmount,
        type: "send",
        status: "completed",
        description,
        related_user_id: recipient._id,
      });
  
      await Transaction.create({
        user_id: recipient._id,
        amount: numericAmount,
        type: "receive",
        status: "completed",
        description: `Received from ${sender.name}`,
        related_user_id: sender._id,
      });
  
      res.json({ message: "Transfer successful" });
    } catch (error) {
      console.error("Transfer Error:", error.message);
      res.status(500).json({ message: "Error processing transfer" });
    }
  };

// Withdraw to bank
export const withdrawFunds = async (req, res) => {
    try {
        const { amount, bank_account_id } = req.body;

        if (!amount || !bank_account_id) {
            return res.status(400).json({ message: "Amount and bank account required" });
        }

        const user = await User.findById(req.userId);

        const bank = user.linked_bank_accounts.find(
            acc => acc.bank_account_id.toString() === bank_account_id
        );

        if (!bank) {
            return res.status(404).json({ message: "Bank account not found" });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Deduct wallet balance
        user.balance -= amount;
        await user.save();

        await Transaction.create({
            user_id: user._id,
            amount,
            type: 'bank_transfer',
            status: 'completed',
            description: 'Wallet withdrawal',
            bank_transfer_details: {
                bank_account_id: bank.bank_account_id,
                bank_name: bank.bank_name,
                transaction_reference: 'TXN' + Date.now()
            }
        });

        res.json({ message: "Withdrawal successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing withdrawal" });
    }
};

// Get all transactions for a user
export const getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.userId }).sort({ created_at: -1 });
        res.json({ transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching transaction history" });
    }
};
