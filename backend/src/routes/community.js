
import { Router } from 'express';
import CommunityPost from '../models/CommunityPost.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router(); router.use(protect);
router.get('/',asyncHandler(async(req,res)=>res.json(await CommunityPost.find(req.user.role==='admin'?{}:{isHidden:false}).populate('author','name role').populate('replies.author','name role').sort({createdAt:-1}).limit(100).lean())));
router.post('/',asyncHandler(async(req,res)=>{
 const {title,body,category='General'}=req.body;
 if(!title?.trim()||!body?.trim()) return res.status(400).json({message:'Title and body are required'});
 const post=await CommunityPost.create({author:req.user._id,title,body,category});
 res.status(201).json(await post.populate('author','name role'));
}));
router.post('/:id/replies',asyncHandler(async(req,res)=>{
 if(!req.body.body?.trim()) return res.status(400).json({message:'Reply body is required'});
 const post=await CommunityPost.findOne({_id:req.params.id,isHidden:false});
 if(!post) return res.status(404).json({message:'Post not found'});
 post.replies.push({author:req.user._id,body:req.body.body});
 await post.save(); await post.populate('replies.author','name role'); res.status(201).json(post);
}));
router.patch('/:id/moderation',allowRoles('admin'),asyncHandler(async(req,res)=>{
 if(typeof req.body.isHidden!=='boolean') return res.status(400).json({message:'isHidden must be boolean'});
 const post=await CommunityPost.findByIdAndUpdate(req.params.id,{isHidden:req.body.isHidden},{new:true});
 if(!post) return res.status(404).json({message:'Post not found'});
 res.json(post);
}));
export default router;
