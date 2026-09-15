import { findIsNewUserByEmail } from "../db";
import OAuth2Provider from "next-auth/providers/google";
import defaultpic from "../../public/default.png";

const GoogleProvider = new OAuth2Provider({
  id: "google",
  name: "Google",
  scope: "email profile",
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  authorization: "https://accounts.google.com/o/oauth2/v2/auth",
  token: "https://oauth2.googleapis.com/token",
  userinfo: "https://www.googleapis.com/oauth2/v3/userinfo",

  profile: async (profile) => {
    try {
      const { given_name, family_name, email_verified, picture  } = profile;
      const email = profile.email?.toLowerCase();
      const name = `${given_name} ${family_name}`.trim();
      const username = email?.split("@")[0];
      const image = picture === null ? defaultpic : picture ;
      const userEmailVerified = email_verified;
      const role = profile.role ?? "User";     
      
      return {
        id: profile.sub,
        email,
        name,
        username,
        image,
        userEmailVerified,
        role,
      };
      
    } catch (error) {
    throw error; // Rethrow the error
    }

  },
});

export default GoogleProvider;
