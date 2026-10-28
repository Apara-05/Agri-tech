
import mongoose from 'mongoose';
const replySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 }
}, { timestamps: true });
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  body: { type: String, required: true, trim: true, maxlength: 5000 },
  category: { type: String, enum: ['General','Crops','Soil','Weather','Pests','Market','Expert'], default: 'General' },
  replies: [replySchema],
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });
postSchema.index({ createdAt: -1 });
export default mongoose.model('CommunityPost', postSchema);
