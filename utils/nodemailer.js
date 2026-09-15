import nodemailer from "nodemailer";
import { google } from "googleapis";
const { OAuth2 } = google.auth;
const { Gmail_USER, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, REDIRECT_URL } =
  process.env;
const oAuth2client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2client.setCredentials({ refresh_token: REFRESH_TOKEN });
const accessToken = oAuth2client.getAccessToken();

export const sendMail = (to, url) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: Gmail_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  const mailOptions = {
    from: process.env.Gmail_USER,
    to: to,
    subject: "password reset",
    text: url,
  };

  transporter.sendMail(mailOptions, (err, infos) => {
    if (err) return err;
    return infos;
  });
};
