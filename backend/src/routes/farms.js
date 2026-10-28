
import { Router } from 'express';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router();
router.use(protect);
const scope = user => user.role === 'admin' ? {} : { farmer: user._id };

router.get('/', asyncHandler(async (req,res) => res.json(await Farm.find(scope(req.user)).sort({createdAt:-1}).lean())));
router.post('/', asyncHandler(async (req,res) => {
  const { farmName, location, size, soilType, primaryCrops = [] } = req.body;
  if (!farmName || !location || !Number.isFinite(Number(size)) || Number(size) <= 0) return res.status(400).json({message:'Farm name, location and positive size are required'});
  const farm = await Farm.create({farmer:req.user._id,farmName,location,size,soilType,primaryCrops});
  res.status(201).json(farm);
}));
router.get('/:id', asyncHandler(async (req,res) => {
  const farm = await Farm.findOne({_id:req.params.id,...scope(req.user)});
  if(!farm) return res.status(404).json({message:'Farm not found'});
  res.json(farm);
}));
router.put('/:id', asyncHandler(async (req,res) => {
  const allowed = ['farmName','location','size','soilType','primaryCrops'];
  const update = Object.fromEntries(Object.entries(req.body).filter(([k])=>allowed.includes(k)));
  const farm = await Farm.findOneAndUpdate({_id:req.params.id,...scope(req.user)},update,{new:true,runValidators:true});
  if(!farm) return res.status(404).json({message:'Farm not found'});
  res.json(farm);
}));
router.delete('/:id', asyncHandler(async (req,res) => {
  const farm = await Farm.findOneAndDelete({_id:req.params.id,...scope(req.user)});
  if(!farm) return res.status(404).json({message:'Farm not found'});
  await Crop.deleteMany({farm:farm._id});
  res.json({message:'Farm and its crops deleted'});
}));
export default router;
