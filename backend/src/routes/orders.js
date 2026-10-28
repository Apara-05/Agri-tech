
import { Router } from 'express';
import Order from '../models/Order.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router(); router.use(protect);
router.get('/',asyncHandler(async(req,res)=>res.json(await Order.find(req.user.role==='admin'?{}:{farmer:req.user._id}).populate('farmer','name email').sort({orderDate:-1}).lean())));
router.post('/',asyncHandler(async(req,res)=>{
 const {items,shippingAddress}=req.body;
 if(!Array.isArray(items)||!items.length||!shippingAddress) return res.status(400).json({message:'At least one item and a shipping address are required'});
 const cleanItems=items.map(i=>({name:String(i.name||'').trim(),category:i.category||'Other',quantity:Number(i.quantity),unitPrice:Number(i.unitPrice)}));
 if(cleanItems.some(i=>!i.name||!Number.isInteger(i.quantity)||i.quantity<1||!Number.isFinite(i.unitPrice)||i.unitPrice<0)) return res.status(400).json({message:'Each item needs a name, positive integer quantity and non-negative unit price'});
 const totalAmount=cleanItems.reduce((sum,i)=>sum+i.quantity*i.unitPrice,0);
 const order=await Order.create({farmer:req.user._id,items:cleanItems,shippingAddress,totalAmount});
 res.status(201).json(order);
}));
router.patch('/:id/status',allowRoles('admin'),asyncHandler(async(req,res)=>{
 const allowed=['Pending','Shipped','Delivered','Cancelled'];
 if(!allowed.includes(req.body.status)) return res.status(400).json({message:'Invalid order status'});
 const order=await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true});
 if(!order) return res.status(404).json({message:'Order not found'});
 res.json(order);
}));
export default router;
