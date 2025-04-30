import { MongoClient, ObjectId } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDHs6bs-4ioOVz-dxRe85JF4pUS9t7ixSY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

    // Collections
    const users = db.collection('users');
    const transactions = db.collection('transactions');

    // Fetch user
    const user = await users.findOne({ _id: new ObjectId(user_id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const linkedBanks = user.linked_bank_accounts || [];
    const walletBalance = user.balance || 0;

    // Get recent transactions
    const userTransactions = await transactions.find({ user_id: user_id }).limit(5).toArray();

    // Build full context
    const context = `
User's Wallet Balance:
${walletBalance}

User's Linked Bank Accounts:
${JSON.stringify(linkedBanks)}

User's Recent Transactions:
${JSON.stringify(userTransactions)}

User's Question:
"${question}"

Please respond based ONLY on the information above.
If something is missing, say so.
`;

    const result = await model.generateContent(context);
    const responseText = result?.response?.text() || "No response generated.";

    res.json({ answer: responseText });
  } catch (error) {
    console.error('AI Query Error:', error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
