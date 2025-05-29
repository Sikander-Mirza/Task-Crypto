import Recipient from '../Models/RecipientModel.mjs';
import User from '../Models/AuthModel.mjs';

// Add recipient
export const addRecipient = async (req, res) => {
  try {
    const { name, account_number } = req.body;
    const user_id = req.userId;

    // Check if already exists
    const exists = await Recipient.findOne({ user_id, account_number });
    if (exists) {
      return res.status(400).json({ message: 'Recipient already added.' });
    }

    // Optional: Validate if account exists in the system
    const userExists = await User.findOne({ 'linked_bank_accounts.account_number': account_number });
    if (!userExists) {
      return res.status(404).json({ message: 'No user found with this account number.' });
    }

    const newRecipient = await Recipient.create({
      user_id,
      name,
      account_number
    });

    res.status(201).json({ message: 'Recipient added successfully.', recipient: newRecipient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add recipient.' });
  }
};

// Get all recipients for logged-in user
export const getRecipients = async (req, res) => {
  try {
    const user_id = req.userId;
    const recipients = await Recipient.find({ user_id });

    res.status(200).json({ recipients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch recipients.' });
  }
};
