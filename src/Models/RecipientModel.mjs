import mongoose from 'mongoose';

const recipientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  account_number: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Recipient', recipientSchema);
