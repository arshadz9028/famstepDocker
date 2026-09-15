// utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateVerificationToken = (userEmail) => {
  const payload = { email: userEmail };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' }; // Token expires in 1 hour

  return jwt.sign(payload, secret, options);
};
