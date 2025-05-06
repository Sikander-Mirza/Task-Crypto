import User from '../Models/AuthModel.mjs';
import Transaction from '../Models/TransactionModel.mjs';
import mongoose from 'mongoose';

// Transfer to another user
export const sendTransfer = async (req, res) => {
    try {
        const { recipient_id, description } = req.body;
const amount = Number(req.body.amount);


        if (!recipient_id || !amount) {
            return res.status(400).json({ message: "Recipient ID and amount required" });
        }

        const sender = await User.findById(req.userId);
        const recipient = await User.findById(recipient_id);
console.log(sender)
console.log(recipient)
const senderBank = sender.linked_bank_accounts[0];
const recipientBank = recipient.linked_bank_accounts[0];

if (senderBank.balance < amount) {
  return res.status(400).json({ message: "Insufficient balance" });
}

// Update balances
senderBank.balance -= amount;
recipientBank.balance += amount;

console.log(senderBank.balance)
console.log(recipientBank.balance)
await sender.save();
await recipient.save();


        // Create transactions for both users
        await Transaction.create({
            user_id: sender._id,
            amount,
            type: 'send',
            status: 'completed',
            description,
            related_user_id: recipient._id
        });

        await Transaction.create({
            user_id: recipient._id,
            amount,
            type: 'receive',
            status: 'completed',
            description,
            related_user_id: sender._id
        });

        res.json({ message: "Transfer successful" });
    } catch (error) {
        console.error(error);
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
