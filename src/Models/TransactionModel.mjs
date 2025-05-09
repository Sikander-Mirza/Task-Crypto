import mongoose from 'mongoose';

const bankTransferDetailsSchema = new mongoose.Schema({
  bank_account_id: mongoose.Schema.Types.ObjectId,
  bank_name: String,
  transaction_reference: String
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipient_name: String,
  amount: { type: Number, required: true },
  type: { type: String, enum: ['send', 'receive', 'utility_bill', 'bank_transfer'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  description: String,
  related_user_id: mongoose.Schema.Types.ObjectId,
  bank_transfer_details: bankTransferDetailsSchema,
  created_at: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
