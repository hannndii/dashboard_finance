import mongoose, { Schema } from 'mongoose';

const transactionSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash' },
  receiptImage: { type: String, default: null }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);