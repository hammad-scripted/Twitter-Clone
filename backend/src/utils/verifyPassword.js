
import bcrypt from "bcryptjs";
export const verifyPassword =  async (password, hashedPassword) =>
   await bcrypt.compare(password, hashedPassword);
