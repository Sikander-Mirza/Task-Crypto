import User from '../Models/AuthModel.mjs';
import Transaction from '../Models/TransactionModel.mjs';
import Budget from '../Models/BudgetModel.mjs';
import { sendBudgetAlert } from '../Utils/mailer.mjs';
import mongoose from 'mongoose';
import { startOfDay, endOfDay } from 'date-fns';

// Transfer to another user
export const sendTransfer = async (req, res) => {
  try {
    console.log(req.body)
    const { amount, recipient_account_number, description, transaction_pin } = req.body;
    
    const senderId = req.userId;
    const numericAmount = Number(amount);

    if (!recipient_account_number || !numericAmount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ message: "Sender not found" });

    if (sender.transaction_pin !== Number(transaction_pin)) {
      return res.status(403).json({ message: "Invalid PIN" });
    }

    if (sender.wallet_balance < numericAmount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    const recipient = await User.findOne({
      "linked_bank_accounts.account_number": recipient_account_number
    });

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // 💸 Wallet to Wallet Transfer
    sender.wallet_balance -= numericAmount;
    recipient.wallet_balance += numericAmount;

    await sender.save();
    await recipient.save();

    // ✅ Budget logic with fixed date range
    const latestBudget = await Budget.findOne({ user_id: sender._id }).sort({ created_at: -1 });

if (latestBudget) {
  const start = startOfDay(new Date(latestBudget.start_date));
  const end = endOfDay(new Date(latestBudget.end_date));

  console.log("🕓 Budget Date Range:", start.toISOString(), "to", end.toISOString());
  console.log("🕓 Now:", new Date().toISOString());

  const totalSpentData = await Transaction.aggregate([
    {
      $match: {
        user_id: sender._id,
        type: "send",
        created_at: {
          $gte: start,
          $lte: end
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]);

  const spent = (totalSpentData[0]?.total || 0) + numericAmount;
  const percent = (spent / latestBudget.amount) * 100;

  console.log("📊 Spent incl. current:", spent);

  if (percent >= 90 && percent < 100) {
    await sendBudgetAlert(sender.email, "⚠️ Budget Warning", `You're close to exceeding your budget.\nSpent: PKR ${spent}\nLimit: PKR ${latestBudget.amount}`);
  } else if (percent >= 100) {
    await sendBudgetAlert(sender.email, "❌ Budget Exceeded", `You've exceeded your budget.\nSpent: PKR ${spent}\nLimit: PKR ${latestBudget.amount}`);
  }
}

    // 🧾 Transaction logs
    await Transaction.create({
      user_id: sender._id,
      amount: numericAmount,
      type: "send",
      status: "completed",
      description,
      related_user_id: recipient._id,
      recipient_name: recipient.name,
      recipient_account_number
    });

    await Transaction.create({
      user_id: recipient._id,
      amount: numericAmount,
      type: "receive",
      status: "completed",
      description: `Received from ${sender.name}`,
      related_user_id: sender._id,
      recipient_name: sender.name,
      recipient_account_number: sender.linked_bank_accounts[0]?.account_number || "N/A"
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
    console.log(req.body)
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

    if (user.wallet_balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Transfer from wallet to bank
    user.wallet_balance -= amount;
    bank.balance += amount;

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
export const getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.userId }).sort({ created_at: -1 });
        res.json({ transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching transaction history" });
    }
};