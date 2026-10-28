
import mongoose from 'mongoose';
const farmSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farmName: { type: String, required: true, trim: true, maxlength: 100 },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  size: { type: Number, required: true, min: 0.01 },
  soilType: { type: String, enum: ['Loamy','Clay','Sandy','Silty','Peaty','Chalky','Unknown'], default: 'Unknown' },
  primaryCrops: [{ type: String, trim: true, maxlength: 60 }]
}, { timestamps: true });
farmSchema.index({ farmer: 1, createdAt: -1 });
export default mongoose.model('Farm', farmSchema);
