// utils/sendVerificationEmail.js
import axios from 'axios';

export const sendVerificationEmail = async (userEmail, otp) => {
  const emailData = {
    to: userEmail,
    subject: 'Welcome to Famstep - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #08529B; font-size: 24px; margin-bottom: 10px;">Welcome to Famstep!</h1>
          <p style="color: #666; font-size: 16px;">Your trusted platform for professional networking</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; font-size: 20px; margin-bottom: 20px;">Email Verification</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Thank you for joining Famstep! To complete your registration and ensure the security of your account, 
            please use the following verification code:
          </p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 6px; text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #08529B; letter-spacing: 5px;">${otp}</span>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            This code will expire in 10 minutes for security reasons.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Famstep. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    await axios.post('http://localhost:3000/api/auth/signup/send-email', emailData);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};
