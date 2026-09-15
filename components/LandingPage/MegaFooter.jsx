import React from "react";
import Link from "next/link";
import Loginstyles from "../../styles/login.module.scss";
import styles from "../../styles/landingPage.module.scss";
import noSessionNavbarstyles from "../../styles/NoSessionNavbar.module.scss";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn, FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import SignupMore from "./SignupMore";

function Footer() {
  // api request to server
  async function onSubmit(values) {
    const status = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/home",
    });
    if (status.ok) {
      router.push("/home");
    } else if (!status.ok) {
      setHeight(true);
      setResult(status.error);
      // formik.resetForm();
      // router.push('/login')
    }
  }

  const handleSubmit = () => {
  }
  const year = new Date().getFullYear();
  return (
    <>
      <div className={styles.megafooterWrapper}>
        <div className={styles.footerContainer}>
          <div className={`${styles.fourColumns} ${styles.firstColumn}`}>
            <div className={styles.footerSocialWrapper}>
              <div className={styles.footerLogo_image}>
                <Link href="/">
                  <span>
                    <svg
                      viewBox="0 0 818 198"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="588"
                        y="42"
                        width="73"
                        height="25"
                        rx="5"
                        fill="#E6EEF5"
                      />
                      <path
                        d="M607 35H642L657 41H592L607 35Z"
                        fill="#E6EEF5"
                        fillOpacity="0.5"
                      />
                      <rect
                        x="550"
                        y="127"
                        width="148"
                        height="25"
                        rx="5"
                        fill="#E6EEF5"
                      />
                      <path
                        d="M569 119H679L694 126H554L569 119Z"
                        fill="#E6EEF5"
                        fillOpacity="0.5"
                      />
                      <rect
                        x="569"
                        y="84"
                        width="110"
                        height="25"
                        rx="5"
                        fill="#E6EEF5"
                      />
                      <path
                        d="M588.04 76H661L676 83H573L588.04 76Z"
                        fill="#E6EEF5"
                        fillOpacity="0.5"
                      />
                      <path
                        d="M70.125 23.6C65.5917 23.6 62.325 24.6667 60.325 26.8C58.325 28.9333 57.325 32.5333 57.325 37.6V45.8H82.325L78.925 67.8H57.325V152H25.725V67.8H9.725V45.8H25.725V36.4C25.725 25.7333 29.1917 17.0667 36.125 10.4C43.1917 3.59999 53.2583 0.199987 66.325 0.199987C76.8583 0.199987 86.525 2.46666 95.325 7L86.725 27.6C81.3917 24.9333 75.8583 23.6 70.125 23.6ZM172.331 121.2C172.331 125.2 172.865 128.133 173.931 130C175.131 131.867 176.998 133.267 179.531 134.2L172.931 154.8C166.398 154.267 161.065 152.867 156.931 150.6C152.798 148.2 149.598 144.467 147.331 139.4C140.398 150.067 129.731 155.4 115.331 155.4C104.798 155.4 96.3979 152.333 90.1313 146.2C83.8646 140.067 80.7313 132.067 80.7313 122.2C80.7313 110.6 84.9979 101.733 93.5313 95.6C102.065 89.4667 114.398 86.4 130.531 86.4H141.331V81.8C141.331 75.5333 139.998 71.2667 137.331 69C134.665 66.6 129.998 65.4 123.331 65.4C119.865 65.4 115.665 65.9333 110.731 67C105.798 67.9333 100.731 69.2667 95.5313 71L88.3313 50.2C94.9979 47.6667 101.798 45.7333 108.731 44.4C115.798 43.0667 122.331 42.4 128.331 42.4C143.531 42.4 154.665 45.5333 161.731 51.8C168.798 58.0667 172.331 67.4667 172.331 80V121.2ZM124.531 132.8C131.731 132.8 137.331 129.4 141.331 122.6V103.8H133.531C126.331 103.8 120.931 105.067 117.331 107.6C113.865 110.133 112.131 114.067 112.131 119.4C112.131 123.667 113.198 127 115.331 129.4C117.598 131.667 120.665 132.8 124.531 132.8ZM314.902 42.4C323.302 42.4 330.035 45.2667 335.102 51C340.168 56.6 342.702 64.4 342.702 74.4V152H311.102V79.8C311.102 70.3333 308.102 65.6 302.102 65.6C298.768 65.6 295.835 66.7333 293.302 69C290.768 71.2667 288.302 74.7333 285.902 79.4V152H254.302V79.8C254.302 70.3333 251.302 65.6 245.302 65.6C242.102 65.6 239.168 66.8 236.502 69.2C233.968 71.4667 231.502 74.8667 229.102 79.4V152H197.502V45.8H225.102L227.302 58.2C231.435 52.8667 235.968 48.9333 240.902 46.4C245.968 43.7333 251.702 42.4 258.102 42.4C264.102 42.4 269.235 43.8667 273.502 46.8C277.902 49.7333 281.102 53.8667 283.102 59.2C287.368 53.4667 292.035 49.2667 297.102 46.6C302.302 43.8 308.235 42.4 314.902 42.4ZM403.847 42.4C411.447 42.4 418.58 43.5333 425.247 45.8C431.914 48.0667 437.78 51.2667 442.847 55.4L431.247 73.2C422.58 67.7333 413.847 65 405.047 65C400.914 65 397.714 65.7333 395.447 67.2C393.314 68.5333 392.247 70.4667 392.247 73C392.247 75 392.714 76.6667 393.647 78C394.714 79.2 396.78 80.4667 399.847 81.8C402.914 83.1333 407.647 84.7333 414.047 86.6C425.114 89.8 433.314 94 438.647 99.2C444.114 104.267 446.847 111.333 446.847 120.4C446.847 127.6 444.78 133.867 440.647 139.2C436.514 144.4 430.847 148.4 423.647 151.2C416.447 154 408.447 155.4 399.647 155.4C390.714 155.4 382.38 154 374.647 151.2C367.047 148.4 360.58 144.533 355.247 139.6L370.647 122.4C379.58 129.333 388.98 132.8 398.847 132.8C403.647 132.8 407.38 131.933 410.047 130.2C412.847 128.467 414.247 126 414.247 122.8C414.247 120.267 413.714 118.267 412.647 116.8C411.58 115.333 409.514 114 406.447 112.8C403.38 111.467 398.514 109.867 391.847 108C381.314 104.933 373.447 100.667 368.247 95.2C363.047 89.7333 360.447 82.9333 360.447 74.8C360.447 68.6667 362.18 63.2 365.647 58.4C369.247 53.4667 374.314 49.6 380.847 46.8C387.514 43.8667 395.18 42.4 403.847 42.4ZM529.727 147C525.86 149.667 521.327 151.733 516.127 153.2C511.06 154.667 505.993 155.4 500.927 155.4C477.727 155.267 466.127 142.467 466.127 117V67.8H451.127V45.8H466.127V22.8L497.727 19.2V45.8H522.127L518.727 67.8H497.727V116.6C497.727 121.533 498.527 125.067 500.127 127.2C501.727 129.333 504.26 130.4 507.727 130.4C511.327 130.4 515.127 129.267 519.127 127L529.727 147Z"
                        fill="#E6EEF5"
                      />
                      <path
                        d="M778.232 43.4C791.565 43.4 801.499 48.3333 808.032 58.2C814.565 68.0667 817.832 81.8667 817.832 99.6C817.832 110.533 816.099 120.333 812.632 129C809.299 137.533 804.432 144.267 798.032 149.2C791.632 154 784.165 156.4 775.632 156.4C764.965 156.4 756.365 152.733 749.832 145.4V194L718.232 197.4V46.8H746.032L747.632 58.6C751.765 53.4 756.499 49.6 761.832 47.2C767.165 44.6667 772.632 43.4 778.232 43.4ZM766.032 133.2C778.699 133.2 785.032 122.133 785.032 100C785.032 87.4667 783.632 78.8 780.832 74C778.032 69.0667 773.832 66.6 768.232 66.6C764.632 66.6 761.232 67.6667 758.032 69.8C754.965 71.9333 752.232 75 749.832 79V123.8C754.099 130.067 759.499 133.2 766.032 133.2Z"
                        fill="#E6EEF5"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
              <div className={styles.contentAboutCompany}>
                <p className={styles.subsJoin} >Join our newsletter to stay up to date on features and releases.</p>
                <form onSubmit={handleSubmit} className={styles.inputButton}>
                  <div className={styles.input_bx}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required="required"

                    />
                    <span className={styles.label}> Enter your email</span>
                  </div>
                  <button type="submit">Subscribe</button>
                </form>
                <p className={styles.privacySubs} > By signing up, you agree to the Famstep Privacy Policy and provide consent to receive updates from our company.</p>

              </div>
              <div className={styles.footerSocialIcons}>
                {/* <span className={styles.socialIcon}>
                  <FaFacebook />
                </span> */}
                <Link
                  href={`https://www.linkedin.com/company/famstep/?viewAsMember=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.socialIcon}>
                    <FaLinkedinIn />
                  </span>
                </Link>
                <Link
                  href={`https://www.instagram.com/famstep_in/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.socialIcon}>
                    <FaInstagram />
                  </span>
                </Link>

                <Link
                  href={`https://x.com/famstepOfficial`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.socialIcon}>
                    <FaXTwitter />
                  </span>
                </Link>

                <Link
                  href={`https://www.youtube.com/@famstep5850/featured`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.socialIcon}>
                    <FaYoutube />
                  </span>
                </Link>
                <Link
                  href={`https://www.facebook.com/profile.php?id=61569042116199`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.socialIcon}>
                    <FaFacebook />
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className={`${styles.fourColumns} ${styles.secondColumn}`}>
            <h3>COMPANY</h3>
            <div className={styles.footerWidgets}>
              <ul className={styles.footerUl}>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/feedback">Feedback</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/feedback">Blog</Link>
                </li>
                {/* <li>
                  <Link href="">Sitemap</Link>
                </li> */}
              </ul>
            </div>
          </div>
          {/* <div className={`${styles.fourColumns} ${styles.thirdColumn}`}>
            <h3>QUICK LINKS</h3>
            <div className={styles.footerWidgets}>
              <ul className={styles.footerUl}>
                <li>
                  <Link href="/ide">Online IDE</Link>
                </li>
                <li>
                  <Link href="/quick/hire">Hire Talent</Link>
                </li>
                <li>
                  <Link href="/quick/events">Events</Link>
                </li>
                <li>
                  <Link href="/quick/community">Community</Link>
                </li>
                <li>
                  <Link href="/quick/freelance">Freelance</Link>
                </li>
                <li>
                  <Link href="/quick/blogs">Blogs</Link>
                </li> */}
          {/* <li>
                  <Link href="">Help</Link>
                </li> */}
          {/* </ul>
            </div>
          </div> */}
          <div className={`${styles.fourColumnsConnected} ${styles.fourthColumn}`}>
            <h3>STAY CONNECTED</h3>
            <section className={styles.footerLoginSignup}>
              {/* <div className={styles.footerContact}>
                  <div className={styles.footerContactPhoneIcon}>
                  <FiPhone />
                  </div>
                  <div className={styles.footerContactPhoneNo}>
                    <Link href="">+1 (800) 646-0520</Link>
                  </div>
                </div>
                <div className={styles.footerEmail}>
                  <div className={styles.footerEmailIcon}>
                  <IoMailOutline />
                  </div>
                  <div className={styles.footerEmailId}>
                    <Link href="">support@famstep.com</Link>
                  </div>
                </div> */}
              <Link href="/login">
                <div className={noSessionNavbarstyles.signInButt}>
                  <input type="button" value="Log in" />
                </div>
              </Link>

              <Link href="/signup">
                <div
                  className={` ${styles.signUpButt}`}
                >
                  <input type="button" value="Sign up" />
                </div>
              </Link>
            </section>
            {/* extra login */}
            <p className={`${Loginstyles.connectwith} ${styles.connectwith}`}>
              Or connect with
            </p>
            <SignupMore />
          </div>
        </div>
        <div className={styles.copyrightFooter}>
          <div className={`${styles.copyText} ${"copyCol1"}`}>
            Copyright ©{year} Famstep. All rights reserved.
          </div>
          <div className={`${styles.copyText} ${styles.copyCol2}`}>
            <ul className={styles.copyCol2Sub}>
              {/* <li>
                <Link href="" className={styles.footerPolicy}>
                  Privacy Policy
                </Link>
              </li> */}
              <li>
                <Link href="/user-agreement" className={styles.footerPolicy}>
                  User Agreement
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={styles.footerPolicy}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className={styles.footerPolicy} >Cookie Policy</Link>
              </li>
              <li>
                <Link href="/cookie-policy">Sitemap</Link>
              </li>
            </ul>
          </div>
          <div className={`${styles.copyText} ${"copyCol3"}`}></div>
        </div>
      </div>
    </>
  );
}

export default Footer;
