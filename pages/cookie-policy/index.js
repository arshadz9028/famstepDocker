import React from "react";
import styles from "../../styles/policies.module.scss";
import MegaFooter from "../../components/LandingPage/MegaFooter";
import Navbar from "../../layouts/NoSessionNavbar";
import { getSession } from "next-auth/react";

function CookiePolicy({session}) {
  return (
    <>
      <Navbar select={"About"} session={session} />

      <div className={styles.main}>
        <div className={styles.center}>
          <div className={styles.upperSection}>
            <h2 className={styles.main_header1}>COOKIE POLICY</h2>
            <p className={styles.subtitle}>Last updated September 04, 2024</p>
          </div>

          <div className={styles.upperSection}>
            <p className={styles.content}>
              This Cookie Policy explains how FAMSTEP PRIVATE LIMITED(
              <strong>&ldquo;we,&ldquo; &ldquo;us,&ldquo;</strong> or
              <strong> &ldquo;our&ldquo;</strong>)uses cookies and similar
              technologies to recognize you when you visit our website at &nbsp;
              <a
                href="https://famstep.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.famstep.com
              </a>
              &nbsp; (<strong>&ldquo;Website&ldquo;</strong>). It explains what
              these technologies are and why we use them, as well as your rights
              to control our use of them.
            </p>

            <p className={styles.content}>
              In some cases we may use cookies to collect personal information,
              or that becomes personal information if we combine it with other
              information.
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>What are cookies?</h2>
            <p className={styles.content}>
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners in order to make their websites work, or to work
              more efficiently, as well as to provide reporting information.
            </p>
            <p className={styles.content}>
              Cookies set by the website owner (in this case, FAMSTEP PRIVATE
              LIMITED) are called &quot;first-party cookies.&quot; Cookies set by parties
              other than the website owner are called &quot;third-party cookies.&quot;
              Third-party cookies enable third-party features or functionality
              to be provided on or through the website (e.g., advertising,
              interactive content, and analytics). The parties that set these
              third-party cookies can recognize your computer both when it
              visits the website in question and also when it visits certain
              other websites.
            </p>
          </div>

          <div className={styles.upperSection} id="personalinfo">
            <h2 className={styles.main_header}>Why do we use cookies?</h2>
            <p className={styles.content}>
              We use first- and third-party cookies for several reasons. Some
              cookies are required for technical reasons in order for our
              Website to operate, and we refer to these as &quot;essential&quot; or
              &quot;strictly necessary&quot; cookies. Other cookies also enable us to
              track and target the interests of our users to enhance the
              experience on our Online Properties. Third parties serve cookies
              through our Website for advertising, analytics, and other
              purposes. This is described in more detail below.
            </p>
          </div>

          <div className={styles.upperSection} id="personalinfo1">
            <h2 className={styles.main_header}>How can I control cookies?</h2>
            <p className={styles.content}>
              You have the right to decide whether to accept or reject cookies.
              You can exercise your cookie rights by setting your preferences in
              the Cookie Consent Manager. The Cookie Consent Manager allows you
              to select which categories of cookies you accept or reject.
              Essential cookies cannot be rejected as they are strictly
              necessary to provide you with services.
            </p>
            <p className={styles.content}>
              The Cookie Consent Manager can be found in the notification banner
              and on our website. If you choose to reject cookies, you may still
              use our website though your access to some functionality and areas
              of our website may be restricted. You may also set or amend your
              web browser controls to accept or refuse cookies.
            </p>
            <p className={styles.content}>
              The specific types of first- and third-party cookies served
              through our Website and the purposes they perform are described in
              the table below (please note that the specific cookies served may
              vary depending on the specific Online Properties you visit):
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              How can I control cookies on my browser?
            </h2>

            <p className={styles.content}>
              As the means by which you can refuse cookies through your web
              browser controls vary from browser to browser, you should visit
              your browser&apos;s help menu for more information. The following is
              information about how to manage cookies on the most popular
              browsers:
            </p>
            <ul className={styles.content_list}>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span data-custom-class="link">Internet Explorer</span>
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Edge
                </a>
              </li>
              <li>
                <a
                  href="https://help.opera.com/en/latest/web-preferences/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Opera
                </a>
              </li>
            </ul>

            <p className={styles.content}>
              In addition, most advertising networks offer you a way to opt out
              of targeted advertising. If you would like to find out more
              information, please visit:
            </p>
            <ul className={styles.content_list}>
              <li>
                <a
                  href="http://www.aboutads.info/choices/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Digital Advertising Alliance
                </a>
              </li>
              <li>
                <a
                  href="https://youradchoices.ca/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Digital Advertising Alliance of Canada
                </a>
              </li>
              <li>
                <a
                  href="http://www.youronlinechoices.com/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span data-custom-class="body_text">
                    European Interactive Digital Advertising Alliance
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              What about other tracking technologies, like web beacons?
            </h2>

            <p className={styles.content}>
              Cookies are not the only way to recognize or track visitors to a
              website. We may use other, similar technologies from time to time,
              like web beacons (sometimes called &quot;tracking pixels&quot; or &quot;clear
              gifs&quot;). These are tiny graphics files that contain a unique
              identifier that enables us to recognize when someone has visited
              our Website or opened an email including them. This allows us, for
              example, to monitor the traffic patterns of users from one page
              within a website to another, to deliver or communicate with
              cookies, to understand whether you have come to the website from
              an online advertisement displayed on a third-party website, to
              improve site performance, and to measure the success of email
              marketing campaigns. In many instances, these technologies are
              reliant on cookies to function properly, and so declining cookies
              will impair their functionin
            </p>
          </div>

          <div className={styles.upperSection} id="personalinfo2">
            <h2 className={styles.main_header}>
              Do you use Flash cookies or Local Shared Objects?
            </h2>
            <p className={styles.content}>
              Websites may also use so-called &quot;Flash Cookies&quot; (also known as
              Local Shared Objects or &quot;LSOs&quot;) to, among other things, collect
              and store information about your use of our services, fraud
              prevention, and for other site operations.
            </p>
            <p className={styles.content}>
              If you do not want Flash Cookies stored on your computer, you can
              adjust the settings of your Flash player to block Flash Cookies
              storage using the tools contained in the{" "}
              <a
                data-custom-class="link"
                href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html"
                target="_BLANK"
                rel="noopener noreferrer"
              >
                Website Storage Settings Panel
              </a>
              . You can also control Flash Cookies by going to the{" "}
              <a
                data-custom-class="link"
                href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html"
                target="_BLANK"
                rel="noopener noreferrer"
              >
                Global Storage Settings Panel
              </a>{" "}
              Panel and following the instructions (which may include
              instructions that explain, for example, how to delete existing
              Flash Cookies (referred to &quot;information&quot; on the Macromedia site),
              how to prevent Flash LSOs from being placed on your computer
              without your being asked, and (for Flash Player 8 and later) how
              to block Flash Cookies that are not being delivered by the
              operator of the page you are on at the time).
            </p>
            <p className={styles.content}>
              Please note that setting the Flash Player to restrict or limit
              acceptance of Flash Cookies may reduce or impede the functionality
              of some Flash applications, including, potentially, Flash
              applications used in connection with our services or online
              content.
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              Do you serve targeted advertising?
            </h2>

            <p className={styles.content}>
              Third parties may serve cookies on your computer or mobile device
              to serve advertising through our Website. These companies may use
              information about your visits to this and other websites in order
              to provide relevant advertisements about goods and services that
              you may be interested in. They may also employ technology that is
              used to measure the effectiveness of advertisements. They can
              accomplish this by using cookies or web beacons to collect
              information about your visits to this and other sites in order to
              provide relevant advertisements about goods and services of
              potential interest to you. The information collected through this
              process does not enable us or them to identify your name, contact
              details, or other details that directly identify you unless you
              choose to provide these.
            </p>
          </div>

          <div className={styles.upperSection} id="PROHIBITED">
            <h2 className={styles.main_header}>
              How often will you update this Cookie Policy?
            </h2>

            <p className={styles.content}>
              We may update this Cookie Policy from time to time in order to
              reflect, for example, changes to the cookies we use or for other
              operational, legal, or regulatory reasons. Please therefore
              revisit this Cookie Policy regularly to stay informed about our
              use of cookies and related technologies.
            </p>
            <p className={styles.content}>
              The date at the top of this Cookie Policy indicates when it was
              last updated.
            </p>
          </div>

          <div className={styles.upperSection} id="deleteInfo">
            <h2 className={styles.main_header}>
              Where can I get further information?
            </h2>
            <p className={styles.content}>
              If you have any questions about our use of cookies or other
              technologies, please email us at contact@famstep.com or by post
              to:
            </p>
            <p className={styles.content}>
              FAMSTEP PRIVATE LIMITED <br /> Safiya Bldg, R No 2, Bombay Colny,
              Diva, Mumbra, Thane <br /> THANE , MAHARASHTRA 400612 <br /> India
              Phone: 96195 27143 <br />
            </p>
          </div>
        </div>
        <MegaFooter />
      </div>
    </>
  );
}
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return {
    props: {
      session,
    },
  };
}
export default CookiePolicy;
