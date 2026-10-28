
import { Router } from 'express';
import User from '../models/User.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router(); router.use(protect,allowRoles('admin'));
router.get('/users',asyncHandler(async(req,res)=>{
 const page=Math.max(1,Number(req.query.page)||1), limit=Math.min(100,Math.max(1,Number(req.query.limit)||25));
 const [users,total]=await Promise.all([User.find().select('-password').sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean(),User.countDocuments()]);
 res.json({users,total,page, pages:Math.ceil(total/limit)});
}));
router.patch('/users/:id/role',asyncHandler(async(req,res)=>{
 if(!['farmer','admin'].includes(req.body.role)) return res.status(400).json({message:'Role must be farmer or admin'});
 if(String(req.user._id)===req.params.id && req.body.role!=='admin') return res.status(400).json({message:'You cannot remove your own admin role'});
 const user=await User.findByIdAndUpdate(req.params.id,{role:req.body.role},{new:true,runValidators:true}).select('-password');
 if(!user) return res.status(404).json({message:'User not found'});
 res.json(user);
}));
export default router;
