import { Router } from 'express';

import {
  deleteNotifications,
  getNotifications,
  getUnreadNotificationCount,
} from '../controllers/notification.controller.js';
import { protect } from '../middlewares/protect.js';

const router = Router();

router.get('/unread-count', protect, getUnreadNotificationCount);
router.get('/', protect, getNotifications);
router.delete('/', protect, deleteNotifications);

export default router;
