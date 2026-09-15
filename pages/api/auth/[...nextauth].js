import NextAuth from "next-auth";
import GoogleProvider from "../../../lib/providers/google";
import GitHubProvider from "../../../lib/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../model/userModel";
import { compare } from "bcryptjs";

import connectDb from "../../../database/conn";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../database/mongodb";
import { getUserById } from "../../../lib/db";

const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider,
    GitHubProvider,
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        authToken: { label: "Auth Token", type: "text" }
      },
      async authorize(credentials) {
        await connectDb();

        // Check if we're using an auth token for automatic login
        if (credentials.authToken) {
          const user = await User.findOne({
            authToken: credentials.authToken,
            authTokenExpiry: { $gt: new Date() } // Token must not be expired
          });
          
          if (user) {
            // Clear the auth token after successful login
            await User.findByIdAndUpdate(user._id, {
              authToken: null,
              authTokenExpiry: null
            });
            
            return Promise.resolve(user);
          }
          
          throw new Error("Invalid or expired authentication token.");
        }
        
        // Regular password-based authentication
        const user = await User.findOne({
          $or: [
            { email: credentials.email },
            { username: credentials.email }, // Assuming email can also be used as a username
          ],
        });

        if (!user) {
          throw new Error("Apologies, the password you entered is incorrect. Please ensure you have typed it correctly.");
        }
        if (!user.password) {
          throw new Error("Apologies, the password you entered is incorrect. Please ensure you have typed it correctly.");

        }
        const checkPassword = await compare(credentials.password, user.password);
        console.log("checkPassword", checkPassword)
        if (checkPassword ) {
          return Promise.resolve(user);
        }
        throw new Error("Apologies, the password you entered is incorrect. Please ensure you have typed it correctly.");

      },
    }),
  ],
  session: {
    jwt: true,
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 10 * 60 * 60 * 24,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true,
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
    error: "/error",
  },
  callbacks: {
    async signIn(user, account, profile) {
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.sub = user.id;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      try {
        if (!token.sub) {
          console.error('No token.sub found in session callback');
          throw new Error('Authentication token is invalid');
        }

        const user = await getUserById(token.sub);
        if (!user) {
          console.error('No user found for token.sub:', token.sub);
          throw new Error('User not found');
        }
        session.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          skill: user.skill,
          image: user.image,
          level: user.level,
          isNewUser: user.isNewUser,
          userEmailVerified: user.userEmailVerified,
          role: user.role,
          contestNotification: user.contestNotification,
          updateProfile: user.updateProfile,
          userFeedback: user.userFeedback,
          userBio: user.userBio,
          designation : user.designation,
          location : user.location,
          skills : user.skills,
          
        };
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        throw error;
      }
    },
  },
};

export default NextAuth(authOptions);
