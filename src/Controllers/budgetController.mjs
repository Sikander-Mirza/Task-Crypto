import Budget from '../Models/BudgetModel.mjs';
import Transaction from '../Models/TransactionModel.mjs';
import mongoose from 'mongoose';

export const setBudget = async (req, res) => {
  const { amount, start_date, end_date } = req.body;

  if (!amount || !start_date || !end_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const budget = await Budget.create({
    user_id: req.userId,
    amount,
    start_date: new Date(start_date),
    end_date: new Date(end_date)
  });

  res.json({ message: "Budget set successfully", budget });
};

export const getBudgetStatus = async (req, res) => {
  const budget = await Budget.findOne({ user_id: req.userId }).sort({ created_at: -1 });

  if (!budget) {
    return res.status(404).json({ message: "No budget found" });
  }

  const totalSpent = await Transaction.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(req.userId),
        type: "send",
        created_at: {
          $gte: new Date(budget.start_date),
          $lte: new Date(budget.end_date)
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

  const spent = totalSpent[0]?.total || 0;
  const overLimit = spent > budget.amount;

  res.json({
    budget: budget.amount,
    period: { from: budget.start_date, to: budget.end_date },
    spent,
    status: overLimit ? "Over budget" : "Within budget"
  });
};
