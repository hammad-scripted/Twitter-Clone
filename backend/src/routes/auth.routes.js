import express from 'express';
import { Router } from 'express';
import {login, signup,logout} from '../controllers/auth.controllers.js'

const router = Router();


router.post('/login',login);

router.post('/logout', logout);
router.post('/signup', signup);

export default router;
