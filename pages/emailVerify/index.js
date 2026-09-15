import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import styles from "../../styles/Forgotpassword.module.scss";
import Footer from "../../layouts/Footer";
import axios from "axios";
import { useRouter } from "next/router";
import User from "../../model/userModel";
import { signIn } from "next-auth/react";
import { MdMarkEmailRead } from "react-icons/md";
import NoSessionNavbar from "../../layouts/NoSessionNavbar";
import { useFormik } from "formik";
import { forgetValidate } from "../../lib/validate";
import { sendVerificationEmail } from "../../config/sendVerificationEmail";

export default function EmailVerify({ userData }) {
  const router = useRouter();
  const { query } = router;
  const [generatedOTP, setGeneratedOTP] = useState(userData?.otp);
  const [isOTPSent, setIsOTPSent] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const [result, setResult] = useState(null);
  const userId = userData?._id;
  const isReset = Boolean(query.reset);

  const onSubmit = useCallback(
    async (values) => {
      if (values.email === generatedOTP) {
        const response = await axios.put(`/api/auth/signup/verifyUser`, {
          userId,
          query,
        });
        if (query?.user) {
          
          if (response.data.success === "success") {
            console.log("userData", userData)
            
            // Get the auth token from sessionStorage
            const authToken = sessionStorage.getItem('authToken');
            
            // Use the auth token for login
            const status = await signIn("credentials", {
              redirect: false,
              email: userData?.email,
              authToken: authToken,
              callbackUrl: "/home",
            });
            
            // Clear the stored auth token
            sessionStorage.removeItem('authToken');
            
            if (status.ok) {
              router.push("/home");
            }
          }
        } else if (query?.reset) {
          router.push(`/reset-password/?user=${userData._id}`);
        }
      } else {
        setResult("Invalid or expired OTP.");
      }
    },
    [generatedOTP, userId, query, router, userData?.email]
  );

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: forgetValidate,
    onSubmit, // Pass the onSubmit function here after it's defined
  });

  const handleResend = useCallback(async () => {
    if (!isOTPSent) {
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(token);
      setIsOTPSent(true);
      setTimeLeft(120);

      sendVerificationEmail(userData?.email, token);
      await axios.put(`/api/auth/signup/resendOTP`, { userId, token });
    }
  }, [isOTPSent, userId, userData?.email]);

  useEffect(() => {
    if (isOTPSent) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsOTPSent(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOTPSent]);

  useEffect(() => {
    const sessionFlag = sessionStorage.getItem("isRefreshed");
    if (sessionFlag && query?.reset) {
        router.push("/forgotpassword");
    } else {
      sessionStorage.setItem("isRefreshed", "true");
    }

    return () => {
      sessionStorage.removeItem("isRefreshed");
    };
  }, [router]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <NoSessionNavbar />
      <Head>
        <title>Email Verify | Famstep</title>
        <meta name="description" content="Verify your email on Famstep." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <section className={styles.main_page}>
        <div className={styles.main_signUp}>
          <div className={styles.signup_form}>
            <div className={styles.signup_form_cover}>
              <div className={styles.login_title}>
                <div className={styles.VerifyIconCover}>
                  <div className={styles.VerifyIconCircle}>
                    <MdMarkEmailRead className={styles.VerifyIcon} />
                  </div>
                </div>
                <p className={styles.join_famstep}>Verify Your Email</p>
                <div className={styles.or}>
                  {isReset ? (
                    <p className={styles.message}>
                      Enter the OTP to reset your password and access Famstep. The code has been sent to
                    </p>
                  ) : (
                    <p className={styles.message}>
                      To join the Famstep community, please enter the OTP we sent to your address.
                    </p>
                  )}
                  <p className={styles.messageEmail}>{userData?.email}</p>
                </div>
              </div>

              <form onSubmit={formik.handleSubmit} autoComplete="off">
                <div className={styles.input_bx}>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    maxLength={6}
                    {...formik.getFieldProps("email")}
                    style={{
                      textAlign: "center",
                      fontSize: "3rem",
                      padding: "0",
                      outline:
                        formik.errors.email && formik.touched.email
                          ? "1px solid red"
                          : null,
                    }}
                    onClick={() => setResult(null)}
                  />
                  <p
                    style={{
                      color: "red",
                      fontSize: "1.5rem",
                      marginLeft: "1rem",
                      paddingTop: ".5rem",
                    }}
                  >
                    {result}
                  </p>
                </div>
                <div className={styles.forgotpassword}>
                  <p
                    style={{
                      cursor: isOTPSent ? "wait" : "pointer",
                      color: isOTPSent ? "grey" : "#08529B",
                      fontWeight: "500",
                      width: "40%",
                      fontSize: "1.8rem",
                      textAlign: "center",
                    }}
                    onClick={handleResend}
                    className={styles.my_link}
                  >
                    Resend OTP
                  </p>
                  <p className={styles.timer}>{formatTime(timeLeft)}</p>
                </div>
                <button type="submit">Verify Email</button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const userId = query?.user;
  const userEmail = query?.reset;
  let userData;
  if (userId) {
    userData = await User.findOne({ username: userId });
  } else if (userEmail) {
    userData = await User.findOne().or([
      { email: userEmail },
      { username: userEmail },
    ]);
  }

  return {
    props: {
      userData: JSON.parse(JSON.stringify(userData)),
    },
  };
}
