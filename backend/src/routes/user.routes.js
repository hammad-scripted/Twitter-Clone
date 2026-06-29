import express from 'express';

import {Router} from 'express';
import {protect}from '../middlewares/protect.js'

const router=Router();


router.get("/profile/:userName",getUserProfile);
router.get("/suggested",getUserProfile,getUserProfile);
router.post("/follow/:id",protect,)
router.post("/update",protect,updateUserProfile)



export default router;