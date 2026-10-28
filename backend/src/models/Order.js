
import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{ name: { type: String, required: true, trim: true, maxlength: 120 }, category: { type: String, enum: ['Seeds','Fertilizers','Equipment','Tools','Other'], default: 'Other' }, quantity: { type: Number, required: true, min: 1 }, unitPrice: { type: Number, required: true, min: 0 } }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Pending','Shipped','Delivered','Cancelled'], default: 'Pending' },
  shippingAddress: { type: String, required: true, maxlength: 300 },
  orderDate: { type: Date, default: Date.now }
}, { timestamps: true });
orderSchema.index({ farmer: 1, orderDate: -1 });
export default mongoose.model('Order', orderSchema);
