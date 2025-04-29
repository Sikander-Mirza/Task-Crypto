import mongoose from 'mongoose';

const linkedBankAccountSchema = new mongoose.Schema({
  bank_account_id: mongoose.Schema.Types.ObjectId,
  bank_name: String,
  account_number: String,
  account_title: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  balance: { type: Number, default: 0 },
  kyc: {
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    document_type: { type: String },
    document_number: { type: String },
    document_photo_url: { type: String },
    verified_at: { type: Date }
  },
  linked_bank_accounts: [linkedBankAccountSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
