import { MongoClient, ObjectId } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AILog from '../Models/AiModel.mjs';

const genAI = new GoogleGenerativeAI("AIzaSyDHs6bs-4ioOVz-dxRe85JF4pUS9t7ixSY");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const queryAI = async (req, res) => {
  try {
    const { user_id, question } = req.body;

    if (!user_id || !question) {
      return res.status(400).json({ message: "user_id and question are required" });
    }

    const client = new MongoClient(
      'mongodb+srv://sikandersunny2017:ywFTVMUfxmbyUzKi@cluster0.qpf0o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    await client.connect();
    const db = client.db();

    const users = db.collection('users');
    const transactions = db.collection('transactions');
    const budgets = db.collection('budgets');

    const user = await users.findOne({ _id: new ObjectId(user_id) });
    if (!user) return res.status(404).json({ message: "User not found" });

    const linkedBanks = user.linked_bank_accounts || [];
    const walletBalance = user.balance || 0;

    // Recent Transactions with Recipient Name Mapping
    const userTransactions = await transactions.find({
      user_id: new ObjectId(user_id)
    }).sort({ created_at: -1 }).limit(5).toArray();

    const relatedUserIds = userTransactions.map(tx => tx.related_user_id);
    const relatedUsers = await users.find({ _id: { $in: relatedUserIds } }).toArray();

    const userIdToNameMap = {};
    relatedUsers.forEach(u => {
      userIdToNameMap[u._id.toString()] = u.name;
    });

    const transactionsWithNames = userTransactions.map(tx => ({
      ...tx,
      recipient_name: userIdToNameMap[tx.related_user_id?.toString()] || "Unknown"
    }));

    // Get latest budget info
    const lastBudget = await budgets.find({ user_id: new ObjectId(user_id) })
      .sort({ created_at: -1 }).limit(1).toArray();

    const latestBudget = lastBudget[0];
    let budgetSummary = "No budget has been set yet.";

    if (latestBudget) {
      const totalSpentData = await transactions.aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id),
            type: "send",
            created_at: {
              $gte: new Date(latestBudget.start_date),
              $lte: new Date(latestBudget.end_date)
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]).toArray();

      const spent = totalSpentData[0]?.total || 0;
      const status = spent > latestBudget.amount ? "⚠️ Over budget" : "✅ Within budget";

      budgetSummary = `
Budget Period: ${new Date(latestBudget.start_date).toDateString()} → ${new Date(latestBudget.end_date).toDateString()}
Budget Limit: PKR ${latestBudget.amount}
Total Spent: PKR ${spent}
Status: ${status}
      `.trim();
    }

    // Build AI prompt
    const context = `
User's Wallet Balance:
${walletBalance}

User's Linked Bank Accounts:
${JSON.stringify(linkedBanks)}

Recent Transactions:
${JSON.stringify(transactionsWithNames)}

Latest Budget Info:
${budgetSummary}

User's Question:
"${question}"

Please respond based ONLY on the information above. If something is missing, say so.
    `.trim();

    const result = await model.generateContent([context]);
    const responseText = result?.response?.text() || "No response generated.";

    // Log chat
    await AILog.create({
      user_id: new ObjectId(user_id),
      query: question,
      ai_response: responseText
    });

    res.json({ answer: responseText });
  } catch (error) {
    console.error('AI Query Error:', error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
