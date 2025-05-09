import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Budget', budgetSchema);
