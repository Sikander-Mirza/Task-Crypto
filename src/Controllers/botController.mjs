import { MongoClient, ObjectId } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AILog from '../Models/AiModel.mjs';
import axios from "axios";

const genAI = new GoogleGenerativeAI("AIzaSyDHs6bs-4ioOVz-dxRe85JF4pUS9t7ixSY");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const queryAI = async (req, res) => {
  try {
    const { user_id, question, confirm, pin } = req.body;

    if (!user_id || !question) {
      return res.status(400).json({ message: "user_id and question are required" });
    }

    const client = new MongoClient('mongodb+srv://sikandersunny2017:ywFTVMUfxmbyUzKi@cluster0.qpf0o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();
    const db = client.db();

    const users = db.collection('users');
    const transactions = db.collection('transactions');
    const budgets = db.collection('budgets');

    const user = await users.findOne({ _id: new ObjectId(user_id) });
    if (!user) return res.status(404).json({ message: "User not found" });

const walletBalance = user.wallet_balance || 0;

    // Load recent transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userTransactions = await transactions.find({
      user_id: new ObjectId(user_id),
      created_at: { $gte: thirtyDaysAgo }
    }).sort({ created_at: -1 }).toArray();

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

    // Budget summary
    const lastBudget = await budgets.find({ user_id: new ObjectId(user_id) }).sort({ created_at: -1 }).limit(1).toArray();
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

    // Detect transfer intent (e.g., "Send PKR 500 to Bilal")
    const transferMatch = question.match(/send\s+pkr\s+(\d+)\s+to\s+([a-zA-Z\s]+)/i);
    if (transferMatch) {
      const amount = Number(transferMatch[1]);
      const recipientName = transferMatch[2].trim();

      const recipient = await users.findOne({ name: new RegExp(`^${recipientName}$`, 'i') });
      if (!recipient) {
        return res.json({ answer: `❌ I couldn't find a user named "${recipientName}".` });
      }

      const account = recipient.linked_bank_accounts?.[0];
      if (!account) {
        return res.json({ answer: `❌ The recipient "${recipientName}" has no bank account.` });
      }

      if (!confirm) {
        return res.json({
          answer: `⚠️ Are you sure you want to send PKR ${amount} to ${recipientName}? Please confirm.`,
          intent: 'transfer',
          amount,
          recipientName,
          recipientAccount: account.account_number
        });
      }

      if (!pin) {
        return res.json({
          answer: `✅ Confirmed! Please enter your transaction PIN to proceed with sending PKR ${amount} to ${recipientName}.`,
          intent: 'confirm-pin',
          amount,
          recipientName,
          recipientAccount: account.account_number
        });
      }

      // 🟢 Make the API call to transfer
      const transferRes = await axios.post("http://localhost:9000/api/transaction/transfer", {
        amount,
        recipient_account_number: account.account_number,
        description: `AI Initiated Transfer to ${recipientName}`,
        transaction_pin: pin
      }, {
        headers: { Authorization: `Bearer ${req.headers.authorization}` }
      });

      return res.json({ answer: `✅ Successfully sent PKR ${amount} to ${recipientName}.` });
    }

    // Run AI normally if no transfer intent
    const context = `
User's Wallet Balance:
${walletBalance}

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


// GetChatHistory Controller
export const getChatHistory = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const client = new MongoClient(
      'mongodb+srv://sikandersunny2017:ywFTVMUfxmbyUzKi@cluster0.qpf0o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    await client.connect();
    const db = client.db();

    const history = await db.collection('aiassistantlogs')  // assumes your collection is named `ai_logs`
      .find({ user_id: new ObjectId(user_id) })
      .sort({ created_at: -1 })
      .toArray();

    res.json({ history });
  } catch (error) {
    console.error("Get Chat History Error:", error.message);
    res.status(500).json({ message: "Failed to retrieve chat history." });
  }
};
