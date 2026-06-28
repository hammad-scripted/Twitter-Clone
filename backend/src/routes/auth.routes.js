import express from 'express';
import { Router } from 'express';
import { login, signup, logout } from '../controllers/auth.controller.js';
import { userValidationRules, validate } from '../middlewares/validator.js';
const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', userValidationRules(), validate, signup);

export default router;
