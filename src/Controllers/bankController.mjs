import ZenBank from '../Models/ZenBankModel.mjs';

// Generate 8-digit unique account number
function generateAccountNumber() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Create Bank Account (admin-level or simulation)
export const createBankAccount = async (req, res) => {
  try {
    const { cnic, account_title } = req.body;

    if (!cnic || !account_title) {
      return res.status(400).json({ message: "CNIC and account title are required" });
    }

    const existing = await ZenBank.findOne({ cnic });
    if (existing) {
      return res.status(400).json({ message: "This CNIC already has a bank account" });
    }

    const account_number = generateAccountNumber();
    const balance = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;

    const newAccount = await ZenBank.create({
      cnic,
      account_title,
      account_number,
      balance
    });

    res.status(201).json({ message: "Bank account created", account: newAccount });
  } catch (error) {
    console.error("Bank account creation error:", error.message);
    res.status(500).json({ message: "Error creating bank account" });
  }
};


export const getAllBankAccounts = async (req, res) => {
  try {
    const accounts = await ZenBank.find().sort({ createdAt: -1 });
    res.json({ accounts });
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ message: "Error fetching accounts" });
  }
};
