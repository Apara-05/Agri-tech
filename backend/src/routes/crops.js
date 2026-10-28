
import { Router } from 'express';
import Crop from '../models/Crop.js';
import Farm from '../models/Farm.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router(); router.use(protect);
const ownedFarm = (farmId,user) => Farm.findOne({_id:farmId,...(user.role==='admin'?{}:{farmer:user._id})});
router.get('/', asyncHandler(async(req,res)=>{
 const farms = await Farm.find(req.user.role==='admin'?{}:{farmer:req.user._id}).select('_id');
 res.json(await Crop.find({farm:{$in:farms.map(f=>f._id)}}).populate('farm','farmName location').sort({createdAt:-1}).lean());
}));
router.post('/', asyncHandler(async(req,res)=>{
 const {farm,cropName,plantingDate,expectedHarvestDate,healthStatus,growthStage,soilPh,notes}=req.body;
 if(!farm||!cropName||!plantingDate) return res.status(400).json({message:'Farm, crop name and planting date are required'});
 if(!(await ownedFarm(farm,req.user))) return res.status(404).json({message:'Farm not found'});
 const crop=await Crop.create({farm,cropName,plantingDate,expectedHarvestDate,healthStatus,growthStage,soilPh,notes});
 res.status(201).json(crop);
}));
router.put('/:id', asyncHandler(async(req,res)=>{
 const crop=await Crop.findById(req.params.id);
 if(!crop) return res.status(404).json({message:'Crop not found'});
 if(!(await ownedFarm(crop.farm,req.user))) return res.status(403).json({message:'Not allowed'});
 const fields=['cropName','plantingDate','expectedHarvestDate','healthStatus','growthStage','soilPh','notes'];
 for(const key of fields) if(req.body[key]!==undefined) crop[key]=req.body[key];
 await crop.save(); res.json(crop);
}));
router.delete('/:id', asyncHandler(async(req,res)=>{
 const crop=await Crop.findById(req.params.id);
 if(!crop) return res.status(404).json({message:'Crop not found'});
 if(!(await ownedFarm(crop.farm,req.user))) return res.status(403).json({message:'Not allowed'});
 await crop.deleteOne(); res.json({message:'Crop deleted'});
}));
export default router;
