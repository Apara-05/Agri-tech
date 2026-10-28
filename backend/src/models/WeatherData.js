
import mongoose from 'mongoose';
const weatherSchema = new mongoose.Schema({
  location: { type: String, required: true, trim: true, index: true },
  temperature: Number, humidity: Number, rainfall: Number,
  forecastDate: { type: Date, default: Date.now },
  pestRiskLevel: { type: String, enum: ['Low','Moderate','High','Unknown'], default: 'Unknown' },
  source: { type: String, default: 'manual' }
}, { timestamps: true });
weatherSchema.index({ location: 1, forecastDate: -1 });
export default mongoose.model('WeatherData', weatherSchema);
