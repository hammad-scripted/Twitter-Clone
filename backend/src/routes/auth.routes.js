import express from 'express';
import { Router } from 'express';

const router = Router();

router.get('/login', (req, res) => {
  res.json('Hello world!!');
});

router.get('/logout', (req, res) => {
  res.json('Hello world!!');
});

export default router;
