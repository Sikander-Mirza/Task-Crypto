import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true, // Ensure product field is required
  },
  amount: {
    type: Number,
    required: true, // Ensure amount field is required
  },
  price: {
    type: mongoose.Types.Decimal128, // Use Decimal128 to handle precise monetary values
     // Ensure price field is required
  },
}, {
  timestamps: true, // Optional: Adds createdAt and updatedAt timestamps
});

const StockModel = mongoose.model('Stock', stockSchema);

export default StockModel;
