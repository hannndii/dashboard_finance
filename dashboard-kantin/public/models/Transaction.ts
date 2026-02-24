import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, default: 1 },
  total: { type: Number, required: true }, // Disimpan agar query cepat, tidak perlu hitung on-the-fly
  paymentMethod: { type: String, default: "Cash" }, // Scalable kalau nanti ada QRIS
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
