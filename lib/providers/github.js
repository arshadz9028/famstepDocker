import OAuth2Provider from "next-auth/providers/github";
import defaultpic from "../../public/default.png";

const GitHubProvider = new OAuth2Provider({
  id: "github",
  name: "GitHub",
  scope: "read:user user:email",
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  authorization: "https://github.com/login/oauth/authorize",
  token: "https://github.com/login/oauth/access_token",
  userinfo: "https://api.github.com/user",

  profile: async (profile) => {
    try {
      const { login, name, email: primaryEmail, avatar_url } = profile;
      const email = primaryEmail?.toLowerCase();
      const username = login;
      const image = avatar_url;
      const userEmailVerified = true; // GitHub emails are verified by default
      const role = "User"; // Default role

      return {
        id: profile.id.toString(),
        email,
        name: name || username, // Use username if name is not available
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

export default GitHubProvider;
