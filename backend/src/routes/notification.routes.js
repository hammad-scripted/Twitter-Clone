import express from 'express';
import {Router} from 'express'
import { protect } from '../middlewares/protect.js';
import { getNotifications,deleteNotifications } from '../controllers/notification.controller.js';
const router=Router()


router.get("/",protect,getNotifications);
router.delete("/",protect,deleteNotifications);



export default router;