

import { verifyToken } from '../utils/token.js';
export const protect=async(req,res,next)=>{
  await verifyToken(req,res,next);  
}