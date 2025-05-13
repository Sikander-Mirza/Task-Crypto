import mongoose from 'mongoose';

// Function to generate a unique 8-digit account number
function generateAccountNumber() {
  return Math.floor(10000000 + Math.random() * 90000000).toString(); // 8-digit string
}

const zenBankSchema = new mongoose.Schema({
  cnic: { type: String, required: true, unique: true },
  account_number: {
    type: String,
    unique: true,
    default: generateAccountNumber
  },
  account_title: { type: String, required: true },
  balance: {
    type: Number,
    default: () => Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000
  }
}, { timestamps: true });

export default mongoose.model('ZenBankAccount', zenBankSchema);
