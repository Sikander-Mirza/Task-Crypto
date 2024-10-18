import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  ProductId: {
    type: Number,  // Integer type for ID
    autoIncrement: true,  // Mongoose doesn’t support auto-increment by default, use a plugin for this like mongoose-sequence
    primaryKey: true  // Mongoose automatically generates an _id field; this field may not be necessary
  },
  
  Date: {
    type: Date,
    required: true, // Equivalent to allowNull: false
  },
  Imageurl:{
    type:String
  },
  Product: {
    type: String
  },
  
  Price: {
    type: mongoose.Schema.Types.Decimal128,  // Mongoose uses Decimal128 for precise decimal numbers
  },
  
  Email: {
    type: String,
    required: true,
  },
  
  Name: {
    type: String // Add this field as a String
  },
  
  phone: {
    type: String // Add this field as a String
  },
  
  Status: {
    type: String,
    enum: ["paid", "unpaid"],  // Enum equivalent in Mongoose
  }
});

// Exporting the Mongoose model
const Order = mongoose.model('Order', orderSchema);
export default Order;
