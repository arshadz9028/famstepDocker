import React from "react";
import styles from "../../styles/landingPage.module.scss";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import GoogleProvider from "../../lib/providers/google";
import { FcGoogle } from "react-icons/fc";
import GitHubProvider from "../../lib/providers/github";

function SignupMore() {
  /* Google Handler Function */
  const handleGoogleSignin = async (e) => {
    e.preventDefault();
    const google = await signIn("google", {
      provider: GoogleProvider.id,
      callbackUrl: process.env.REDIRECT_URL_AFTER_SIGN_IN,
    });
    if (google) {
      return;
    }
  };

  /* Github Handler Function */
  const handleGithubSignin = async (e) => {
    e.preventDefault();
    const github = await signIn("github", {
      provider: GitHubProvider.id,
      callbackUrl: process.env.REDIRECT_URL_AFTER_SIGN_IN,
    });
    if (github) {
      return;
    }
  };

  return (
    <>
      <div className={styles.social_icons}>
        <div className={styles.google} onClick={handleGoogleSignin}>
          <FcGoogle className={styles.FB} />
          <p className={styles.githubFB} style={{color:"white"}} >Google</p>
        </div>
        <div className={styles.github} onClick={handleGithubSignin}>
          <AiFillGithub fill="white" className={styles.FB} />
          <p className={styles.githubFB}  >Github</p>
        </div>
      </div>
    </>
  );
}

export default SignupMore;
