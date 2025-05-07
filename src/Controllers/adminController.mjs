import User from '../Models/AuthModel.mjs';
import Transaction from '../Models/TransactionModel.mjs';
import AILog from '../Models/AiModel.mjs';

// 🔐 Update KYC status
export const updateKycStatus = async (req, res) => {
  const { user_id, status } = req.body;
  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const user = await User.findById(user_id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.kyc.status = status;
  user.kyc.verified_at = status === 'verified' ? new Date() : null;
  await user.save();

  res.json({ message: `KYC ${status}`, kyc: user.kyc });
};

// 👁 View user KYC status
export const getKycStatus = async (req, res) => {
  const user = await User.findById(req.params.user_id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ kyc: user.kyc });
};

// 👁 View user info
// ✅ Get all users
export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password_hash');
      res.json({ users });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  };
  
  // ✅ Get all transactions & withdrawals
  export const getAllTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find().sort({ created_at: -1 });
      res.json({ transactions });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  };

// 🧠 View user AI chat history (admin)
// export const getUserChats = async (req, res) => {
//   const user_id = req.params.user_id;
//   const chats = await AILog.find({ user_id }).sort({ created_at: -1 });

//   res.json({ chats });
// };

// 👤 User’s own chat history (frontend)
export const getOwnChatHistory = async (req, res) => {
  const chats = await AILog.find({ user_id: req.userId }).sort({ created_at: -1 });

  res.json({ chats });
};
