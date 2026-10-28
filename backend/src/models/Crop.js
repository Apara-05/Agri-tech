
import mongoose from 'mongoose';
const cropSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
  cropName: { type: String, required: true, trim: true, maxlength: 80 },
  plantingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date },
  healthStatus: { type: String, enum: ['Healthy','Needs attention','Critical','Unknown'], default: 'Unknown' },
  growthStage: { type: String, enum: ['Preparation','Seedling','Vegetative','Flowering','Fruiting','Harvested'], default: 'Seedling' },
  soilPh: { type: Number, min: 0, max: 14 },
  notes: { type: String, maxlength: 1000, default: '' }
}, { timestamps: true });
cropSchema.index({ farm: 1, plantingDate: -1 });
export default mongoose.model('Crop', cropSchema);
