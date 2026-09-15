import React from "react";
import styles from "../../styles/aboutUsPage.module.scss";
import Navbar from "../../layouts/NoSessionNavbar";
import Image from "next/image";
import about3d from "../../assets/newIcons/about3d.png";
import second from "../../assets/newIcons/second.png";
import { getSession, useSession } from "next-auth/react";
import MegaFooter from "../../components/LandingPage/MegaFooter";
import { BsLightningCharge } from "react-icons/bs";
import { GoGoal } from "react-icons/go";
import { IoTelescopeSharp } from "react-icons/io5";

function AboutPage({session}) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (event) => {
      event.preventDefault();
      container.scrollLeft += event.deltaY;
    };

    container.addEventListener("wheel", handleWheel);

    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <>
      <Navbar select={"About"} session={session} />
      <div className={styles.main}>
        <div className={styles.center}>
          <div className={styles.firstWrapper}>
            <div className={styles.headingFirst}>
              <h1>About US</h1>
              <p>
                Famstep is a dynamic platform designed to empower college
                students, young professionals, freelancers and entrepreneurs by
                providing skills development, competition, internships and
                networking opportunities so We connect users with peers and
                companies who can create dreams in their careers, helping them
                build their identities and careers.
              </p>
            </div>
            <div className={styles.headingFirstImg}>
              <Image
                src={second}
                alt="webImage"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
          <div className={styles.mission}>
            <div className={`${styles.motive} ${styles.marginRight}`}>
              <div className={styles.name_Icon}>
                <BsLightningCharge className={styles.motive_Icon} />
                <p className={styles.headline_Mission}>Our Mission</p>
              </div>
              <p className={styles.motiveContent}>
                To provide a platform where users can develop skills, showcase
                talents, and connect with like-minded individuals and companies
                to achieve their career goals.
              </p>
            </div>

            <div className={`${styles.motive} ${styles.marginRight}`}>
              <div className={styles.name_Icon}>
                <GoGoal className={styles.motive_Icon} />
                <p className={styles.headline_Mission}>Our Motive</p>
              </div>
              <p className={styles.motiveContent}>
                We empower you by connecting you with top experts. Learn from
                the best, gain confidence, and acquire the skills needed to
                secure employment in your chosen field.
              </p>
            </div>

            <div className={styles.motive}>
              <div className={styles.name_Icon}>
                <IoTelescopeSharp className={styles.motive_Icon} />
                <p className={styles.headline_Mission}>Our Vision</p>
              </div>
              <p className={styles.motiveContent}>
                To be the leading platform that recognizes and nurtures talent,
                enabling individuals to achieve their full potential and gain
                the recognition they deserve.
              </p>
            </div>
          </div>

          <div className={styles.secondWrapper}>
            <div className={styles.headingSecImgWrapper}>
              <div className={styles.headingSecImg}>
                <Image
                  src={about3d}
                  alt="webImage"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
            <div className={styles.headingSec}>
              <h2>Why Famstep?</h2>
              <p>
                Famstep is not just a platform; it&apos;s a journey towards
                realizing your full potential. Whether you&apos;re just starting
                or looking to advance your career, Famstep provides the tools,
                resources, and community support you need to succeed. We believe
                that talent should be celebrated and that everyone deserves the
                opportunity to shine. <br /> Join us at Famstep and start
                building your future today. No more waiting for the &ldquo;right
                time&rdquo;—if you have the talent, the time is now!
              </p>
            </div>
          </div>

          <div className={styles.fullLength}>
            <div className={styles.content}>
              <p className={styles.heading}>Core Values of Famstep</p>
              <p className={styles.subheading}>
                By upholding these core values, Famstep aims to create a
                platform that not only educates but also inspires and empowers
                individuals to achieve their fullest potential.
              </p>
            </div>

            <div className={styles.containerSlide} ref={containerRef}>
              <div className={styles.container}>
                <p className={styles.container_heading}>Empowerment</p>
                <p className={styles.container_content}>
                  We believe in empowering individuals to take control of their
                  career paths by providing the tools, resources, and
                  opportunities needed to succeed. Famstep is dedicated to
                  helping users unlock their potential and achieve their goals.
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.container_heading}>Continuous Learning</p>
                <p className={styles.container_content}>
                  Education doesn&apos;t stop after graduation. At Famstep, we
                  promote a culture of lifelong learning, encouraging users to
                  continuously develop their skills and knowledge to stay
                  competitive in an ever-evolving job market.
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.container_heading}>
                  Innovation and Creativity
                </p>
                <p className={styles.container_content}>
                  We are committed to fostering innovation and creativity in
                  everything we do. Famstep constantly seeks new and effective
                  ways to deliver educational content, build communities, and
                  connect users with opportunities.
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.container_heading}>Collaboration</p>
                <p className={styles.container_content}>
                  Success is best achieved through collaboration. Famstep values
                  the power of community and teamwork, encouraging users to
                  connect, share knowledge, and support each other&apos;s growth.
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.container_heading}>Excellence</p>
                <p className={styles.container_content}>
                  We strive for excellence in all aspects of our platform, from
                  the quality of our content and services to the user experience
                  we provide. Famstep is committed to maintaining high standards
                  and delivering value to our users.
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.container_heading}>Recognition</p>
                <p className={styles.container_content}>
                  Talent deserves to be recognized. Famstep is dedicated to
                  providing opportunities for users to showcase their abilities,
                  gain recognition, and build a professional identity that
                  stands out in the job market.
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.container_heading}>Community Engagement</p>
                <p className={styles.container_content}>
                  We prioritize active participation and collaboration within
                  our community, ensuring Famstep evolves to meet user needs. We
                  believe in giving back and creating a positive impact for all
                  members.
                </p>
              </div>
            </div>
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
export default AboutPage;
