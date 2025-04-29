import User from '../Models/AuthModel.mjs';
import Transaction from '../Models/TransactionModel.mjs';


export const getBalance = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ message: 'user_id is required' });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ balance: user.balance });
  } catch (error) {
    console.error('BotController Error [getBalance]:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ message: 'user_id is required' });

    const transactions = await Transaction.find({ user_id })
      .sort({ created_at: -1 })
      .limit(5);

    res.json({ transactions });
  } catch (error) {
    console.error('BotController Error [getTransactions]:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const getBills = async (req, res) => {
//   try {
//     const { user_id } = req.body;
//     if (!user_id) return res.status(400).json({ message: 'user_id is required' });

//     const bills = await UtilityBill.find({ user_id })
//       .sort({ paid_at: -1 })
//       .limit(5);

//     res.json({ bills });
//   } catch (error) {
//     console.error('BotController Error [getBills]:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
