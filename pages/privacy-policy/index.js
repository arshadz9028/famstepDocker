import React from "react";
import styles from "../../styles/policies.module.scss";
import MegaFooter from "../../components/LandingPage/MegaFooter";
import Navbar from "../../layouts/NoSessionNavbar";
import { getSession } from "next-auth/react";

function Privacy({session}) {
  return (
    <>
      <Navbar select={"About"} session={session} />

      <div className={styles.main}>
        <div className={styles.center}>
          <div className={styles.upperSection}>
            <h2 className={styles.main_header1}>PRIVACY POLICY</h2>
            <p className={styles.subtitle}>Last updated September 04, 2024</p>
          </div>
          <div className={styles.upperSection}>
            <p className={styles.content}>
              Privacy Notice for Famstep Private Limited At Famstep Private
              Limited (<strong>&ldquo;we,&ldquo; &ldquo;us,&ldquo;</strong> or
              <strong> &ldquo;our&ldquo;</strong>), we value your privacy and
              are committed to protecting your personal information. This
              Privacy Notice explains how and why we collect, access, store,
              use, and share (<strong>&ldquo;process&ldquo;</strong>) your
              personal information when you engage with our services (
              <strong>&ldquo;Services&ldquo;</strong>), including:
            </p>

            <ul className={styles.content_list}>
              <li>
                Visiting our website at&nbsp;
                <a
                  href="https://famstep.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.famstep.com
                </a>
                , or any other website of ours that links to this Privacy
                Notice.
              </li>
              <li>
                Downloading and using our mobile application (Famstep), or any
                other applications that reference this Privacy Notice.
              </li>
              <li>
                Using our platform, which is designed to help users showcase
                their talents, enhance their skills, and connect with
                opportunities. Unlike other platforms that focus on a single
                area such as motivation, competitions, job listings, or
                freelancing, Famstep offers a comprehensive journey from skill
                development to career growth.
              </li>
              <li>
                Engaging with us through sales, marketing, events, or any other
                related interactions.
              </li>
            </ul>

            <p className={styles.subtitle}>Why We Process Your Information</p>
            <p className={styles.content}>
              We process your personal information to enhance your experience,
              improve our services, and provide a seamless platform that
              supports your journey from learning to career advancement.
            </p>
            <p className={styles.subtitle}>Questions or Concerns?</p>
            <p className={styles.content}>
              Understanding your privacy rights is important. This Privacy
              Notice outlines your choices and rights regarding your personal
              information. We take responsibility for ensuring that your data is
              processed securely and respectfully. If you have any concerns or
              do not agree with our policies, we recommend that you refrain from
              using our Services.
            </p>
            <br />
            <p className={styles.content}>
              For further questions or inquiries, feel free to contact us
              at&nbsp;
              <a
                href="https://famstep.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.famstep.com
              </a>
              .
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>SUMMARY OF KEY POINTS</h2>
            <p className={styles.subtitle}>
              This summary highlights key aspects of our Privacy Notice. For
              more detailed information on any of these topics, you can follow
              the provided links or use the table of contents to navigate to the
              relevant section.
            </p>
            <br />
            <ul className={styles.content_list}>
              <li>
                <p className={styles.subtitle}>
                  What personal information do we process?
                </p>
                When you use our Services, we may collect and process personal
                information based on how you interact with us and the features
                you use. Learn more about the&nbsp;
                <a href="#personalinfo" rel="noopener noreferrer">
                  personal information we collect.
                </a>
              </li>
              <li>
                <p className={styles.subtitle}>
                  Do we process sensitive personal information?
                </p>
                In some jurisdictions, certain data such as racial or ethnic
                origin, sexual orientation, or religious beliefs may be
                considered sensitive. We do not process sensitive personal
                information.
              </li>
              <li>
                <p className={styles.subtitle}>
                  How do we process your information?
                </p>
                We process your data to provide, improve, and manage our
                Services, communicate with you, ensure security, prevent fraud,
                and comply with legal requirements. Your information is
                processed only when we have a valid legal reason to do so.&nbsp;
                <a href="#personalinfo1" rel="noopener noreferrer">
                  Learn more about how we process your information.
                </a>
              </li>

              <li>
                <p className={styles.subtitle}>
                  Do we collect information from third parties?
                </p>
                Yes, we may collect information from third-party sources like
                public databases, social media platforms, marketing partners,
                and other external providers.&nbsp;
                <a href="#personalinfo2" rel="noopener noreferrer">
                  Learn more about third-party data collection.
                </a>
              </li>

              <li>
                <p className={styles.subtitle}>
                  When and with whom do we share your information?
                </p>
                We may share your personal information in specific circumstances
                and with selected third parties.&nbsp;
                <a href="#personalinfo3" rel="noopener noreferrer">
                  Learn more about our data security measures.
                </a>
              </li>
              <li>
                <p className={styles.subtitle}>What are your rights?</p>
                Depending on your location, you may have certain rights
                regarding your personal data, such as the right to access,
                correct, or delete your information.&nbsp;
                <a href="#personalinfo4" rel="noopener noreferrer">
                  Learn more about your privacy rights.
                </a>
              </li>
              <br />
              <p className={styles.content}>
                For more information on how we handle your data, please review
                our full Privacy Notice.
              </p>
            </ul>
          </div>

          <div className={styles.upperSection} id="personalinfo">
            <h2 className={styles.main_header}>
              1. WHAT INFORMATION DO WE COLLECT?
            </h2>
            <p className={styles.subtitleHigh}>
              Personal information you disclose to us
            </p>
            <p className={styles.content}>
              <strong>In Short:</strong> We collect personal information that
              you provide to us.
            </p>
            <p className={styles.content}>
              We collect personal information that you voluntarily provide to us
              when you register on the Services, express an interest in
              obtaining information about us or our products and Services, when
              you participate in activities on the Services, or otherwise when
              you contact us.
            </p>
            <p className={styles.content}>
              <strong>Personal Information Provided by You.</strong> The
              personal information that we collect depends on the context of
              your interactions with us and the Services, the choices you make,
              and the products and features you use. The personal information we
              collect may include the following:
            </p>
            <ul className={styles.content_list}>
              <li>names</li>
              <li>email addresses</li>
              <li>job titles</li>
              <li>usernames</li>
              <li>profile Image</li>
              <li>passwords</li>
              <li>interest</li>
              <li>skills</li>
              <li>contact preferences</li>
              <li>contact or authentication data</li>
              <li>billing addresses</li>
            </ul>
            <p className={styles.content}>
              <strong>Sensitive Information. </strong> We do not process
              sensitive information.
            </p>
            <p className={styles.content}>
              <strong>Social Media Login Data.</strong> We may provide you with
              the option to register with us using your existing account
              details, like your Google and github. If you choose to register in
              this way, we will collect certain profile information about you
              from the account provider, as described in the section
              called&nbsp; &quot;
              <a href="#personalinfo5" rel="noopener noreferrer">
                HOW DO WE HANDLE YOUR SOCIAL LOGINS?
              </a>
              &quot; &nbsp;below.
            </p>
            <p className={styles.content}>
              <strong>Application Data. </strong>If you use our application(s),
              we also may collect the following information if you choose to
              provide us with access or permission:
            </p>
            <ul className={styles.content_list}>
              <li>
                Geolocation Information. We may request access or permission to
                track location-based information from your mobile device, either
                continuously or while you are using our mobile application(s),
                to provide certain location-based services. If you wish to
                change our access or permissions, you may do so in your
                device&apos;s settings.
              </li>
              <li>
                Mobile Device Access. We may request access or permission to
                certain features from your mobile device, including your mobile
                device&apos;s camera, microphone, calendar, contacts, sms
                messages, storage, and other features. If you wish to change our
                access or permissions, you may do so in your device&apos;s
                settings.
              </li>
              <li>
                Mobile Device Data. We automatically collect device information
                (such as your mobile device ID, model, and manufacturer),
                operating system, version information and system configuration
                information, device and application identification numbers,
                browser type and version, hardware model Internet service
                provider and/or mobile carrier, and Internet Protocol (IP)
                address (or proxy server). If you are using our application(s),
                we may also collect information about the phone network
                associated with your mobile device, your mobile device&apos;s
                operating system or platform, the type of mobile device you use,
                your mobile deviceMobile Device Data. We automatically collect
                device information (such as your mobile device ID, model, and
                manufacturer), operating system, version information and system
                configuration information, device and application identification
                numbers, browser type and version, hardware model Internet
                service provider and/or mobile carrier, and Internet Protocol
                (IP) address (or proxy server). If you are using our
                application(s), we may also collect information about the phone
                network associated with your mobile device, your mobile
                device&apos;s operating system or platform, the type of mobile
                device you use, your mobile device&apos;s unique device ID, and
                information about the features of our application(s) you
                accessed.s unique device ID, and information about the features
                of our application(s) you accessed.
              </li>
              <li>
                Push Notifications. We may request to send you push
                notifications regarding your account or certain features of the
                application(s). If you wish to opt out from receiving these
                types of communications, you may turn them off in your
                device&apos;s settings.
              </li>
            </ul>
            <p className={styles.content}>
              This information is primarily needed to maintain the security and
              operation of our application(s), for troubleshooting, and for our
              internal analytics and reporting purposes.
            </p>
            <br />
            <p className={styles.content}>
              All personal information that you provide to us must be true,
              complete, and accurate, and you must notify us of any changes to
              such personal information.
            </p>
            <p className={styles.subtitleHigh}>
              Information automatically collected
            </p>
            <p className={styles.content}>
              <strong>In Short:</strong> Some information — such as your
              Internet Protocol (IP) address and/or browser and device
              characteristics — is collected automatically when you visit our
              Services.
            </p>
            <p className={styles.content}>
              Like many businesses, we also collect information through cookies
              and similar technologies.
            </p>
            <p className={styles.content}>
              The information we collect includes:
            </p>

            <ul className={styles.content_list}>
              <li>
                Log and Usage Data. Log and usage data is service-related,
                diagnostic, usage, and performance information our servers
                automatically collect when you access or use our Services and
                which we record in log files. Depending on how you interact with
                us, this log data may include your IP address, device
                information, browser type, and settings and information about
                your activity in the Services (such as the date/time stamps
                associated with your usage, pages and files viewed, searches,
                and other actions you take such as which features you use),
                device event information (such as system activity, error reports
                (sometimes called &ldquo;crash dumps&ldquo;), and hardware
                settings).
              </li>
              <li>
                Device Data. We collect device data such as information about
                your computer, phone, tablet, or other device you use to access
                the Services. Depending on the device used, this device data may
                include information such as your IP address (or proxy server),
                device and application identification numbers, location, browser
                type, hardware model, Internet service provider and/or mobile
                carrier, operating system, and system configuration information.
              </li>
              <li>
                Location Data. We collect location data such as information
                about your device&apos;s location, which can be either precise
                or imprecise. How much information we collect depends on the
                type and settings of the device you use to access the Services.
                For example, we may use GPS and other technologies to collect
                geolocation data that tells us your current location (based on
                your IP address). You can opt out of allowing us to collect this
                information either by refusing access to the information or by
                disabling your Location setting on your device. However, if you
                choose to opt out, you may not be able to use certain aspects of
                the Services.
              </li>
            </ul>

            <p className={styles.subtitleHigh}>Google API</p>
            <p className={styles.content}>
              Our use of information received from Google APIs will adhere
              to&nbsp;
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the&nbsp;
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy#limited-use"
                target="_blank"
                rel="noopener noreferrer"
              >
                Limited Use requirements.
              </a>
            </p>
          </div>

          <div className={styles.upperSection} id="personalinfo1">
            <h2 className={styles.main_header}>
              2. HOW DO WE PROCESS YOUR INFORMATION?
            </h2>
            <p className={styles.content}>
              <strong>In Short:</strong> We process your information to provide,
              improve, and administer our Services, communicate with you, for
              security and fraud prevention, and to comply with law. We may also
              process your information for other purposes with your consent.
            </p>
            <p className={styles.subtitle}>
              We process your personal information for a variety of reasons,
              depending on how you interact with our Services, including:
            </p>{" "}
            <br />
            <ul className={styles.content_list}>
              <li>
                <strong>
                  To facilitate account creation and authentication and
                  otherwise manage user accounts.
                </strong>
                We may process your information so you can create and log in to
                your account, as well as keep your account in working order.
              </li>
              <li>
                <strong>
                  To save or protect an individual&apos;s vital interest.
                </strong>
                We may process your information when necessary to save or
                protect an individual&apos;s vital interest, such as to prevent
                harm.
              </li>
            </ul>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
            </h2>

            <p className={styles.content}>
              <strong>In Short:</strong> We only process your personal
              information when we believe it is necessary and we have a valid
              legal reason (i.e., legal basis) to do so under applicable law,
              like with your consent, to comply with laws, to provide you with
              services to enter into or fulfill our contractual obligations, to
              protect your rights, or to fulfill our legitimate business
              interests.
            </p>
            <p className={styles.subtitle}>
              If you are located in the EU or UK, this section applies to you.
            </p>
            <p className={styles.content}>
              The General Data Protection Regulation (GDPR) and UK GDPR require
              us to explain the valid legal bases we rely on in order to process
              your personal information. As such, we may rely on the following
              legal bases to process your personal information:
            </p>

            <ul className={styles.content_list}>
              <li>
                <strong>Consent.</strong>
                We may process your information if you have given us permission
                (i.e., consent) to use your personal information for a specific
                purpose. You can withdraw your consent at any time. Learn more
                about&nbsp;
                <a href="#personalinfo6" rel="noopener noreferrer">
                  withdrawing your consent.
                </a>
              </li>
              <li>
                <strong>Legal Obligations.</strong>
                We may process your information where we believe it is necessary
                for compliance with our legal obligations, such as to cooperate
                with a law enforcement body or regulatory agency, exercise or
                defend our legal rights, or disclose your information as
                evidence in litigation in which we are involved.
              </li>
              <li>
                <strong>Vital Interests.</strong>
                We may process your information where we believe it is necessary
                to protect your vital interests or the vital interests of a
                third party, such as situations involving potential threats to
                the safety of any person.
              </li>
            </ul>
            <p className={styles.subtitle}>
              If you are located in Canada, this section applies to you.
            </p>
            <p className={styles.content}>
              We may process your information if you have given us specific
              permission (i.e., express consent) to use your personal
              information for a specific purpose, or in situations where your
              permission can be inferred (i.e., implied consent). You can &nbsp;
              <a href="#personalinfo6" rel="noopener noreferrer">
                withdrawing your consent.
              </a>
              &nbsp;at any time.
            </p>
            <p className={styles.content}>
              In some exceptional cases, we may be legally permitted under
              applicable law to process your information without your consent,
              including, for example:
            </p>

            <ul className={styles.content_list}>
              <li>
                If collection is clearly in the interests of an individual and
                consent cannot be obtained in a timely way
              </li>
              <li>For investigations and fraud detection and prevention</li>
              <li>
                For business transactions provided certain conditions are met
              </li>
              <li>
                If it is contained in a witness statement and the collection is
                necessary to assess, process, or settle an insurance claim
              </li>
              <li>
                For identifying injured, ill, or deceased persons and
                communicating with next of kin
              </li>
              <li>
                If we have reasonable grounds to believe an individual has been,
                is, or may be victim of financial abuse
              </li>
              <li>
                If it is reasonable to expect collection and use with consent
                would compromise the availability or the accuracy of the
                information and the collection is reasonable for purposes
                related to investigating a breach of an agreement or a
                contravention of the laws of Canada or a province
              </li>
              <li>
                If disclosure is required to comply with a subpoena, warrant,
                court order, or rules of the court relating to the production of
                records
              </li>
              <li>
                If it was produced by an individual in the course of their
                employment, business, or profession and the collection is
                consistent with the purposes for which the information was
                produced
              </li>
              <li>
                If the collection is solely for journalistic, artistic, or
                literary purposes
              </li>
              <li>
                If the information is publicly available and is specified by the
                regulations
              </li>
            </ul>
          </div>

          <div className={styles.upperSection} id="personalinfo3">
            <h2 className={styles.main_header}>
              4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </h2>

            <p className={styles.content}>
              <strong>In Short:</strong> We may share information in specific
              situations described in this section and/or with the following
              third parties.
            </p>

            <p className={styles.content}>
              We may need to share your personal information in the following
              situations:
            </p>

            <ul className={styles.content_list}>
              <li>
                <strong>Business Transfers. </strong>
                We may share or transfer your information in connection with, or
                during negotiations of, any merger, sale of company assets,
                financing, or acquisition of all or a portion of our business to
                another company.
              </li>
              <li>
                <strong>When we use Google Maps Platform APIs. </strong>
                We may share your information with certain Google Maps Platform
                APIs (e.g., Google Maps API, Places API). Google Maps uses GPS,
                Wi-Fi, and cell towers to estimate your location. GPS is
                accurate to about 20 meters, while Wi-Fi and cell towers help
                improve accuracy when GPS signals are weak, like indoors. This
                data helps Google Maps provide directions, but it is not always
                perfectly precise. We obtain and store on your device
                (&ldquo;cache&ldquo;) your location for one (1) months . You may
                revoke your consent anytime by contacting us at the contact
                details provided at the end of this document.
              </li>
              <li>
                <strong>Affiliates. </strong>
                We may share your information with our affiliates, in which case
                we will require those affiliates to honor this Privacy Notice.
                Affiliates include our parent company and any subsidiaries,
                joint venture partners, or other companies that we control or
                that are under common control with us.
              </li>
              <li>
                <strong>Business Partners. </strong>
                We may share your information with our business partners to
                offer you certain products, services, or promotions.
              </li>
              <li>
                <strong>Offer Wall. </strong>
                Our application(s) may display a third-party hosted &ldquo;offer
                wall.&ldquo; Such an offer wall allows third-party advertisers
                to offer virtual currency, gifts, or other items to users in
                return for the acceptance and completion of an advertisement
                offer. Such an offer wall may appear in our application(s) and
                be displayed to you based on certain data, such as your
                geographic area or demographic information. When you click on an
                offer wall, you will be brought to an external website belonging
                to other persons and will leave our application(s). A unique
                identifier, such as your user ID, will be shared with the offer
                wall provider in order to prevent fraud and properly credit your
                account with the relevant reward.
              </li>
            </ul>
          </div>

          <div className={styles.upperSection} id="personalinfo2">
            <h2 className={styles.main_header}>
              5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
            </h2>

            <p className={styles.content}>
              <strong>In Short:</strong> We are not responsible for the safety
              of any information that you share with third parties that we may
              link to or who advertise on our Services, but are not affiliated
              with, our Services.
            </p>

            <p className={styles.content}>
              The Services , including our offer wall, may link to third-party
              websites, online services, or mobile applications and/or contain
              advertisements from third parties that are not affiliated with us
              and which may link to other websites, services, or applications.
              Accordingly, we do not make any guarantee regarding any such third
              parties, and we will not be liable for any loss or damage caused
              by the use of such third-party websites, services, or
              applications. The inclusion of a link towards a third-party
              website, service, or application does not imply an endorsement by
              us. We cannot guarantee the safety and privacy of data you provide
              to any third-party websites. Any data collected by third parties
              is not covered by this Privacy Notice. We are not responsible for
              the content or privacy and security practices and policies of any
              third parties, including other websites, services, or applications
              that may be linked to or from the Services. You should review the
              policies of such third parties and contact them directly to
              respond to your questions.
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </h2>

            <p className={styles.content}>
              <strong>In Short:</strong> We may use cookies and other tracking
              technologies to collect and store your information.
            </p>

            <p className={styles.content}>
              We may use cookies and similar tracking technologies (like web
              beacons and pixels) to gather information when you interact with
              our Services. Some online tracking technologies help us maintain
              the security of our Services and your account , prevent crashes,
              fix bugs, save your preferences, and assist with basic site
              functions.
            </p>

            <p className={styles.content}>
              We also permit third parties and service providers to use online
              tracking technologies on our Services for analytics and
              advertising, including to help manage and display advertisements,
              to tailor advertisements to your interests, or to send abandoned
              shopping cart reminders (depending on your communication
              preferences). The third parties and service providers use their
              technology to provide advertising about products and services
              tailored to your interests which may appear either on our Services
              or on other websites.
            </p>
            <p className={styles.content}>
              To the extent these online tracking technologies are deemed to be
              a &ldquo;sale&ldquo;/&ldquo;sharing&ldquo; (which includes
              targeted advertising, as defined under the applicable laws) under
              applicable US state laws, you can opt out of these online tracking
              technologies by submitting a request as described below under
              section &ldquo;
              <a href="#personalinfo7" rel="noopener noreferrer">
                DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </a>
              &ldquo;
            </p>
            <p className={styles.content}>
              Specific information about how we use such technologies and how
              you can refuse certain cookies is set out in our Cookie Notice .
            </p>
            <p className={styles.subtitleHigh}>Google Analytics</p>
            <p className={styles.content}>
              We may share your information with Google Analytics to track and
              analyze the use of the Services. The Google Analytics Advertising
              Features that we may use include: Remarketing with Google
              Analytics , Google Display Network Impressions Reporting and
              Google Analytics Demographics and Interests Reporting. <br /> To
              opt out of being tracked by Google Analytics across the Services,
              visit&nbsp;
              <a
                data-custom-class="link"
                href="https://tools.google.com/dlpage/gaoptout"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://tools.google.com/dlpage/gaoptout
              </a>
              .
              <br />
              You can opt out of Google Analytics Advertising Features
              through&nbsp;
              <a
                data-custom-class="link"
                href="https://adssettings.google.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Ads Settings
              </a>
              &nbsp; and Ad Settings for mobile apps. <br /> Other opt out means
              include&nbsp;
              <a
                data-custom-class="link"
                href="http://optout.networkadvertising.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                http://optout.networkadvertising.org/
              </a>
              &nbsp; and &nbsp;
              <a
                data-custom-class="link"
                href="http://www.networkadvertising.org/mobile-choice"
                rel="noopener noreferrer"
                target="_blank"
              >
                http://www.networkadvertising.org/mobile-choice
              </a>
              . For more information on the privacy practices of Google, please
              visit the&nbsp;
              <a
                data-custom-class="link"
                href="https://policies.google.com/privacy"
                rel="noopener noreferrer"
                target="_blank"
              >
                Google Privacy & Terms page
              </a>
              .
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              7. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?
            </h2>

            <p className={styles.content}>
              <strong>In Short:</strong>We offer products, features, or tools
              powered by artificial intelligence, machine learning, or similar
              technologies.
            </p>
            <p className={styles.subtitle}>Our AI Products</p>
            <p className={styles.content}>
              Our AI Products are designed for the following functions
            </p>

            <ul className={styles.content_list}>
              <li>AI bots</li>
              <li>AI document generation</li>
              <li>AI insights</li>
              <li>AI predictive analytics</li>
              <li>AI search</li>
              <li>Image analysis</li>
              <li>Machine learning models</li>
              <li>Natural language processing</li>
              <li>Text analysis</li>
              <li>Video analysis</li>
            </ul>
            <p className={styles.subtitle}>How We Process Your Data Using AI</p>
            <p className={styles.content}>
              All personal information processed using our AI Products is
              handled in line with our Privacy Notice and our agreement with
              third parties. This ensures high security and safeguards your
              personal information throughout the process, giving you peace of
              mind about your data&apos;s safety.
            </p>
          </div>

          <div className={styles.upperSection} id="personalinfo5">
            <h2 className={styles.main_header}>
              8. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
            </h2>

            <p className={styles.content}>
              <strong>In Short:</strong> If you choose to register or log in to
              our Services using a social media account, we may have access to
              certain information about you.
            </p>

            <p className={styles.content}>
              Our Services offer you the ability to register and log in using
              your third-party account details (like your google or github
              logins). Where you choose to do this, we will receive certain
              profile information about you from your social media provider. The
              profile information we receive may vary depending on the social
              media provider concerned, but will often include your name, email
              address, friends list, and profile picture, as well as other
              information you choose to make public on such a social media
              platform.
            </p>
            <p className={styles.content}>
              We will use the information we receive only for the purposes that
              are described in this Privacy Notice or that are otherwise made
              clear to you on the relevant Services. Please note that we do not
              control, and are not responsible for, other uses of your personal
              information by your third-party social media provider. We
              recommend that you review their privacy notice to understand how
              they collect, use, and share your personal information, and how
              you can set your privacy preferences on their sites and apps.
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              9. HOW LONG DO WE KEEP YOUR INFORMATION?
            </h2>
            <p className={styles.content}>
              <strong>In Short:</strong> We keep your information for as long as
              necessary to fulfill the purposes outlined in this Privacy Notice
              unless otherwise required by law.
            </p>

            <p className={styles.content}>
              We will only keep your personal information for as long as it is
              necessary for the purposes set out in this Privacy Notice, unless
              a longer retention period is required or permitted by law (such as
              tax, accounting, or other legal requirements). No purpose in this
              notice will require us keeping your personal information for
              longer than the period of time in which users have an account with
              us .
            </p>
            <p className={styles.content}>
              When we have no ongoing legitimate business need to process your
              personal information, we will either delete or anonymize such
              information, or, if this is not possible (for example, because
              your personal information has been stored in backup archives),
              then we will securely store your personal information and isolate
              it from any further processing until deletion is possible.
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              10. HOW DO WE KEEP YOUR INFORMATION SAFE?
            </h2>

            <p className={styles.content}>
              <strong>In Short:</strong> We aim to protect your personal
              information through a system of organizational and technical
              security measures.
            </p>

            <p className={styles.content}>
              We have implemented appropriate and reasonable technical and
              organizational security measures designed to protect the security
              of any personal information we process. However, despite our
              safeguards and efforts to secure your information, no electronic
              transmission over the Internet or information storage technology
              can be guaranteed to be 100% secure, so we cannot promise or
              guarantee that hackers, cybercriminals, or other unauthorized
              third parties will not be able to defeat our security and
              improperly collect, access, steal, or modify your information.
              Although we will do our best to protect your personal information,
              transmission of personal information to and from our Services is
              at your own risk. You should only access the Services within a
              secure environment.
            </p>
          </div>

          <div className={styles.upperSection} id="personalinfo4">
            <h2 className={styles.main_header}>
              11. WHAT ARE YOUR PRIVACY RIGHTS?
            </h2>

            <p className={styles.content}>
              <strong>In Short:</strong> Depending on your state of residence in
              the US or in some regions, such as the European Economic Area
              (EEA), United Kingdom (UK), Switzerland, and Canada, you have
              rights that allow you greater access to and control over your
              personal information. You may review, change, or terminate your
              account at any time, depending on your country, province, or state
              of residence.
            </p>

            <p className={styles.content}>
              In some regions (like the EEA, UK, Switzerland, and Canada), you
              have certain rights under applicable data protection laws. These
              may include the right (i) to request access and obtain a copy of
              your personal information, (ii) to request rectification or
              erasure; (iii) to restrict the processing of your personal
              information; (iv) if applicable, to data portability; and (v) not
              to be subject to automated decision-making. In certain
              circumstances, you may also have the right to object to the
              processing of your personal information. You can make such a
              request by contacting us by using the contact details provided in
              the section &ldquo;
              <a href="#contactInfo" rel="noopener noreferrer">
                HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </a>
              &ldquo; below.
            </p>
            <p className={styles.content}>
              We will consider and act upon any request in accordance with
              applicable data protection laws.
            </p>
            <p className={styles.content}>
              If you are located in the EEA or UK and you believe we are
              unlawfully processing your personal information, you also have the
              right to complain to your{" "}
              <a
                href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
                rel="noopener noreferrer"
                target="_blank"
              >
                Member State data protection authority
              </a>{" "}
              or{" "}
              <a
                href="https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/"
                rel="noopener noreferrer"
                target="_blank"
              >
                UK data protection authority
              </a>
            </p>
            <p className={styles.content}>
              If you are located in Switzerland, you may contact the{" "}
              <a
                href="https://www.edoeb.admin.ch/edoeb/en/home.html"
                rel="noopener noreferrer"
                target="_blank"
              >
                Federal Data Protection and Information Commissioner
              </a>
              .
            </p>
            <p className={styles.content} id="personalinfo6">
              <strong>Withdrawing your consent:</strong> Withdrawing your
              consent: If we are relying on your consent to process your
              personal information, which may be express and/or implied consent
              depending on the applicable law, you have the right to withdraw
              your consent at any time. You can withdraw your consent at any
              time by contacting us by using the contact details provided in the
              section &ldquo;
              <a href="#contactInfo" rel="noopener noreferrer">
                HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </a>
              &ldquo; below.
            </p>
            <p className={styles.content}>
              However, please note that this will not affect the lawfulness of
              the processing before its withdrawal nor, when applicable law
              allows, will it affect the processing of your personal information
              conducted in reliance on lawful processing grounds other than
              consent.
            </p>
            <p className={styles.content}>
              <strong>
                Opting out of marketing and promotional communications:
              </strong>
              You can unsubscribe from our marketing and promotional
              communications at any time by clicking on the unsubscribe link in
              the emails that we send, replying &ldquo;STOP &ldquo; or
              &ldquo;UNSUBSCRIBE &ldquo; to the SMS messages that we send, or by
              contacting us using the details provided in the section &ldquo;
              <a href="#contactInfo" rel="noopener noreferrer">
                HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </a>
              &ldquo; below. You will then be removed from the marketing lists.
              However, we may still communicate with you — for example, to send
              you service-related messages that are necessary for the
              administration and use of your account, to respond to service
              requests, or for other non-marketing purposes.
            </p>

            <p className={styles.subtitleHigh}>Account Information</p>
            <p className={styles.content}>
              If you would at any time like to review or change the information
              in your account or terminate your account, you can:
            </p>

            <ul className={styles.content_list}>
              <li>
                Log in to your account settings and update your user account.
              </li>
            </ul>
            <p className={styles.content}>
              Upon your request to terminate your account, we will deactivate or
              delete your account and information from our active databases.
              However, we may retain some information in our files to prevent
              fraud, troubleshoot problems, assist with any investigations,
              enforce our legal terms and/or comply with applicable legal
              requirements.
            </p>
            <p className={styles.content}>
              <strong>Cookies and similar technologies:</strong> Most Web
              browsers are set to accept cookies by default. If you prefer, you
              can usually choose to set your browser to remove cookies and to
              reject cookies. If you choose to remove cookies or reject cookies,
              this could affect certain features or services of our Services.
              You may also&nbsp;
              <a
                href="http://www.aboutads.info/choices/"
                rel="noopener noreferrer"
                target="_blank"
              >
                opt out of interest-based advertising by advertisers
              </a>{" "}
              on our Services.
            </p>
            <p className={styles.content}>
              If you have questions or comments about your privacy rights, you
              may email us at contact@famstep.com .
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              12. CONTROLS FOR DO-NOT-TRACK FEATURES
            </h2>

            <p className={styles.content}>
              Most web browsers and some mobile operating systems and mobile
              applications include a Do-Not-Track ( &quot;DNT &quot;) feature or
              setting you can activate to signal your privacy preference not to
              have data about your online browsing activities monitored and
              collected. At this stage, no uniform technology standard for
              recognizing and implementing DNT signals has been finalized. As
              such, we do not currently respond to DNT browser signals or any
              other mechanism that automatically communicates your choice not to
              be tracked online. If a standard for online tracking is adopted
              that we must follow in the future, we will inform you about that
              practice in a revised version of this Privacy Notice.
            </p>
            <p className={styles.content}>
              California law requires us to let you know how we respond to web
              browser DNT signals. Because there currently is not an industry or
              legal standard for recognizing or honoring DNT signals, we do not
              respond to them at this time.
            </p>
          </div>
          <div className={styles.upperSection} id="personalinfo7">
            <h2 className={styles.main_header}>
              13. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
            </h2>

            <p className={styles.content}>
              <strong>In Short: </strong>If you are a resident of California,
              Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky,
              Montana, New Hampshire, New Jersey, Oregon, Tennessee, Texas,
              Utah, or Virginia, you may have the right to request access to and
              receive details about the personal information we maintain about
              you and how we have processed it, correct inaccuracies, get a copy
              of, or delete your personal information. You may also have the
              right to withdraw your consent to our processing of your personal
              information. These rights may be limited in some circumstances by
              applicable law. More information is provided below.
            </p>
            <p className={styles.subtitleHigh}>
              Categories of Personal Information We Collect
            </p>
            <p className={styles.content}>
              We have collected the following categories of personal information
              in the past twelve (12) months:
            </p>

            <div className={styles.divTable}>
              <div className={styles.divTableBody}>
                <div className={styles.divTableRow}>
                  <h5 className={styles.divTableCell}>Category</h5>
                  <h5 className={styles.divTableCell}>Examples</h5>
                  <h5 className={styles.divTableCell}>Collected</h5>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}> A. Identifiers </div>
                  <div className={styles.divTableCell}>
                    Contact details, such as real name, alias, postal address,
                    telephone or mobile contact number, unique personal
                    identifier, online identifier, Internet Protocol address,
                    email address, and account name
                  </div>
                  <div className={styles.divTableCell}> NO </div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    B. Personal information as defined in the California
                    Customer Records statute
                  </div>
                  <div className={styles.divTableCell}>
                    Name, contact information, education, employment, employment
                    history, and financial information
                  </div>
                  <div className={styles.divTableCell}> NO </div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    C. Protected classification characteristics under state or
                    federal law
                  </div>
                  <div className={styles.divTableCell}>
                    Gender, age, date of birth, race and ethnicity, national
                    origin, marital status, and other demographic data
                  </div>
                  <div className={styles.divTableCell}> NO </div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    D. Commercial information
                  </div>
                  <div className={styles.divTableCell}>
                    Transaction information, purchase history, financial
                    details, and payment information
                  </div>
                  <div className={styles.divTableCell}> NO</div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    E. Biometric information
                  </div>
                  <div className={styles.divTableCell}>
                    Fingerprints and voiceprints
                  </div>
                  <div className={styles.divTableCell}> NO </div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    F. Internet or other similar network activity
                  </div>
                  <div className={styles.divTableCell}>
                    Browsing history, search history, online behavior , interest
                    data, and interactions with our and other websites,
                    applications, systems, and advertisements
                  </div>
                  <div className={styles.divTableCell}> NO </div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>G. Geolocation data</div>
                  <div className={styles.divTableCell}> Device location </div>
                  <div className={styles.divTableCell}> NO</div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    H. Audio, electronic, sensory, or similar information
                  </div>
                  <div className={styles.divTableCell}>
                    Images and audio, video or call recordings created in
                    connection with our business activities
                  </div>
                  <div className={styles.divTableCell}> NO </div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    I. Professional or employment-related information
                  </div>
                  <div className={styles.divTableCell}>
                    Business contact details in order to provide you our
                    Services at a business level or job title, work history, and
                    professional qualifications if you apply for a job with us
                  </div>
                  <div className={styles.divTableCell}> NO </div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    J. Education Information
                  </div>
                  <div className={styles.divTableCell}>
                    Student records and directory information
                  </div>
                  <div className={styles.divTableCell}> NO </div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    K. Inferences drawn from collected personal information
                  </div>
                  <div className={styles.divTableCell}>
                    Inferences drawn from any of the collected personal
                    information listed above to create a profile or summary
                    about, for example, an individual’s preferences and
                    characteristics
                  </div>
                  <div className={styles.divTableCell}> YES </div>
                </div>
                <div className={styles.divTableRow}>
                  <div className={styles.divTableCell}>
                    L . Sensitive personal Information
                  </div>
                  <div className={styles.divTableCell}> </div>
                  <div className={styles.divTableCell}> NO </div>
                </div>
              </div>
            </div>

            <p className={styles.content}>
              We may also collect other personal information outside of these
              categories through instances where you interact with us in person,
              online, or by phone or mail in the context of:
            </p>
            <ul className={styles.content_list}>
              <li>Receiving help through our customer support channels;</li>
              <li>Participation in customer surveys or contests; and</li>
              <li>
                Facilitation in the delivery of our Services and to respond to
                your inquiries.
              </li>
            </ul>
            <p className={styles.content}>
              We will use and retain the collected personal information as
              needed to provide the Services or for:
            </p>
            <ul className={styles.content_list}>
              <li>Category H - 6 months</li>
              <li>Category K - 6 months</li>
            </ul>

            <p className={styles.subtitleHigh}>
              Sources of Personal Information
            </p>
            <p className={styles.content}>
              Learn more about the sources of personal information we collect in
              &quot;
              <a href="#personalinfo" rel="noopener noreferrer">
                WHAT INFORMATION DO WE COLLECT?
              </a>
              &quot;
            </p>
            <p className={styles.subtitleHigh}>
              How We Use and Share Personal Information
            </p>
            <p className={styles.content}>
              Learn about how we use your personal information in the section,
              &quot;
              <a href="#personalinfo1" rel="noopener noreferrer">
                HOW DO WE PROCESS YOUR INFORMATION?
              </a>
              &quot;
            </p>
            <p className={styles.subtitle}>
              Will your information be shared with anyone else?
            </p>
            <p className={styles.content}>
              We may disclose your personal information with our service
              providers pursuant to a written contract between us and each
              service provider. Learn more about how we disclose personal
              information to in the section, &quot;
              <a href="#personalinfo3" rel="noopener noreferrer">
                WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </a>{" "}
              &quot;
            </p>
            <p className={styles.content}>
              We may use your personal information for our own business
              purposes, such as for undertaking internal research for
              technological development and demonstration. This is not
              considered to be &quot;selling&quot; of your personal information.
            </p>
            <p className={styles.content}>
              We have not disclosed, sold, or shared any personal information to
              third parties for a business or commercial purpose in the
              preceding twelve (12) months. We will not sell or share personal
              information in the future belonging to website visitors, users,
              and other consumers.
            </p>
            <p className={styles.subtitleHigh}>Your Rights</p>
            <p className={styles.content}>
              You have rights under certain US state data protection laws.
              However, these rights are not absolute, and in certain cases, we
              may decline your request as permitted by law. These rights
              include:
            </p>

            <ul className={styles.content_list}>
              <li>
                <strong>Right to know </strong> whether or not we are processing
                your personal data{" "}
              </li>
              <li>
                <strong>Right to access </strong> your personal data{" "}
              </li>
              <li>
                <strong>Right to correct </strong> inaccuracies in your personal
                data{" "}
              </li>
              <li>
                <strong>Right to request </strong>the deletion of your personal
                data{" "}
              </li>
              <li>
                <strong>Right to obtain a copy </strong> of the personal data
                you previously shared with us{" "}
              </li>
              <li>
                <strong>Right to non-discrimination </strong> for exercising
                your rights{" "}
              </li>
              <li>
                <strong>Right to opt out </strong> of the processing of your
                personal data if it is used for targeted advertising (or sharing
                as defined under California&apos;s privacy law), the sale of
                personal data, or profiling in furtherance of decisions that
                produce legal or similarly significant effects
                (&quot;profiling&quot; ){" "}
              </li>
            </ul>
            <p className={styles.content}>
              Depending upon the state where you live, you may also have the
              following rights:
            </p>

            <ul className={styles.content_list}>
              <li>
                Right to obtain a list of the categories of third parties to
                which we have disclosed personal data (as permitted by
                applicable law, including California&apos;s and Delaware&apos;s
                privacy law){" "}
              </li>
              <li>
                Right to obtain a list of specific third parties to which we
                have disclosed personal data (as permitted by applicable law,
                including Oregon&apos;s privacy law)
              </li>
              <li>
                Right to limit use and disclosure of sensitive personal data (as
                permitted by applicable law, including California&apos;s privacy
                law)
              </li>
              <li>
                Right to opt out of the collection of sensitive data and
                personal data collected through the operation of a voice or
                facial recognition feature (as permitted by applicable law,
                including Florida&apos;s privacy law)
              </li>
            </ul>

            <p className={styles.subtitleHigh}>How to Exercise Your Rights</p>
            <p className={styles.content}>
              To exercise these rights, you can contact us by emailing us at
              contact@famstep.com, by visiting{" "}
              <a
                href="https://famstep.com/contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.famstep.com/contact
              </a>
              , or by referring to the contact details at the bottom of this
              document.
            </p>
            <p className={styles.content}>
              Under certain US state data protection laws, you can designate an
              authorized agent to make a request on your behalf. We may deny a
              request from an authorized agent that does not submit proof that
              they have been validly authorized to act on your behalf in
              accordance with applicable laws.
            </p>
            <p className={styles.subtitleHigh}>Request Verification</p>
            <p className={styles.content}>
              Upon receiving your request, we will need to verify your identity
              to determine you are the same person about whom we have the
              information in our system. We will only use personal information
              provided in your request to verify your identity or authority to
              make the request. However, if we cannot verify your identity from
              the information already maintained by us, we may request that you
              provide additional information for the purposes of verifying your
              identity and for security or fraud-prevention purposes.
            </p>
            <p className={styles.content}>
              If you submit the request through an authorized agent, we may need
              to collect additional information to verify your identity before
              processing your request and the agent will need to provide a
              written and signed permission from you to submit such request on
              your behalf.
            </p>
            <p className={styles.subtitleHigh}>Appeals</p>
            <p className={styles.content}>
              Under certain US state data protection laws, if we decline to take
              action regarding your request, you may appeal our decision by
              emailing us at contact@famstep.com . We will inform you in writing
              of any action taken or not taken in response to the appeal,
              including a written explanation of the reasons for the decisions.
              If your appeal is denied, you may submit a complaint to your state
              attorney general.
            </p>
            <p className={styles.subtitleHigh}>
              California &quot;Shine The Light&quot; Law
            </p>
            <p className={styles.content}>
              California Civil Code Section 1798.83, also known as the
              &quot;Shine The Light&quot; law, permits our users who are
              California residents to request and obtain from us, once a year
              and free of charge, information about categories of personal
              information (if any) we disclosed to third parties for direct
              marketing purposes and the names and addresses of all third
              parties with which we shared personal information in the
              immediately preceding calendar year. If you are a California
              resident and would like to make such a request, please submit your
              request in writing to us by using the contact details provided in
              the section&nbsp;&ldquo;
              <a href="#contactInfo" rel="noopener noreferrer">
                HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </a>
              &ldquo;
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              14. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?
            </h2>

            <p className={styles.content}>
              <strong>In Short:</strong> You may have additional rights based on
              the country you reside in.
            </p>

            <p className={styles.subtitleHigh}>Australia and New Zealand</p>

            <p className={styles.content}>
              We collect and process your personal information under the
              obligations and conditions set by Australia&apos;s Privacy Act
              1988 and New Zealand&apos;s Privacy Act 2020 (Privacy Act).
            </p>
            <p className={styles.content}>
              This Privacy Notice satisfies the notice requirements defined in
              both Privacy Acts, in particular: what personal information we
              collect from you, from which sources, for which purposes, and
              other recipients of your personal information.
            </p>
            <p className={styles.content}>
              If you do not wish to provide the personal information necessary
              to fulfill their applicable purpose, it may affect our ability to
              provide our services, in particular:
            </p>

            <ul className={styles.content_list}>
              <li>offer you the products or services that you want</li>
              <li>respond to or help with your requests </li>
              <li>manage your account with us</li>
              <li>confirm your identity and protect your account </li>
            </ul>
            <p className={styles.content}>
              At any time, you have the right to request access to or correction
              of your personal information. You can make such a request by
              contacting us by using the contact details provided in the section
              &ldquo;
              <a href="#deleteInfo" rel="noopener noreferrer">
                HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
                YOU?
              </a>
              &ldquo;
            </p>
            <p className={styles.content}>
              If you believe we are unlawfully processing your personal
              information, you have the right to submit a complaint regarding a
              breach of the Australian Privacy Principles to the Office of the
              Australian Information Commissioner or a breach of New
              Zealand&apos;s Privacy Principles to the Office of the New Zealand
              Privacy Commissioner.
            </p>
            <p className={styles.subtitleHigh}>Republic of South Africa</p>
            <p className={styles.content}>
              At any time, you have the right to request access to or correction
              of your personal information. You can do so by contacting us using
              the details provided in the section &ldquo;
              <a href="#deleteInfo" rel="noopener noreferrer">
                HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
                YOU?
              </a>
              &ldquo;
            </p>
            <p className={styles.content}>
              If you are not satisfied with how we handle any complaints
              regarding our processing of personal information, you can contact
              the relevant regulatory authority for further assistance.
            </p>
          </div>

          <div className={styles.upperSection}>
            <h2 className={styles.main_header}>
              15. DO WE MAKE UPDATES TO THIS NOTICE?
            </h2>

            <p className={styles.content}>
              <strong>In Short: </strong> Yes, we will update this notice as
              necessary to stay compliant with relevant laws.
            </p>
            <p className={styles.content}>
              We may update this Privacy Notice from time to time. The updated
              version will be indicated by an updated &quot;Revised&quot; date
              at the top of this Privacy Notice. If we make material changes to
              this Privacy Notice, we may notify you either by prominently
              posting a notice of such changes or by directly sending you a
              notification. We encourage you to review this Privacy Notice
              frequently to be informed of how we are protecting your
              information.
            </p>
          </div>
          <div className={styles.upperSection} id="contactInfo">
            <h2 className={styles.main_header}>
              16. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </h2>

            <p className={styles.content}>
              If you have questions or comments about this notice, you may email
              us at contact@famstep.com or contact us by post at:
            </p>
            <p className={styles.content}>
              FAMSTEP PRIVATE LIMITED <br /> Safiya Bldg, R No 2, Bombay Colny,
              Diva, Mumbra, Thane <br /> THANE , MAHARASHTRA 400612 <br /> India
            </p>
          </div>
          <div className={styles.upperSection} id="deleteInfo">
            <h2 className={styles.main_header}>
              17. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
              YOU?
            </h2>

            <p className={styles.content}>
              Based on the applicable laws of your country or state of residence
              in the U.S., you may have the right to access the personal
              information we collect from you, understand how it has been
              processed, correct any inaccuracies, or request the deletion of
              your personal data. You may also have the right to withdraw your
              consent to the processing of your personal information. These
              rights may be subject to certain limitations under applicable law.
              To review, update, or delete your personal information, please
              contact us by emailing contact@famstep.com or by visiting&nbsp;
              <a
                href="https://famstep.com/contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.famstep.com/contact.
              </a>
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
export default Privacy;
