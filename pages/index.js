import React, { useEffect, useRef, useState } from "react";
import Navbar from "../layouts/NoSessionNavbar";
import Image from "next/image";
import styles from "../styles/landingPage.module.scss";
import landingPage from "../assets/newIcons/landingPage.png";
import BgBackground from "../assets/newIcons/5.png";
import bottomCollab from "../assets/newIcons/bottomCollab.png";
import Link from "next/link";
import { getSession } from "next-auth/react";
import MegaFooter from "../components/LandingPage/MegaFooter";
import TestiSlider from "../components/LandingPage/Slider";
import LaunchingPageSoon from "../components/LaunchingPageSoon";
import { format, parse, isValid } from "date-fns";
import { SiTicktick } from "react-icons/si";

function Landing({ admin }) {
  const Edate = new Date(admin);
  const dateNow = new Date();
  const difference = Edate - dateNow;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const min = Math.floor((difference / 1000 / 60) % 60);
  const sec = Math.floor((difference / 1000) % 60);

  // React.useEffect(() => {
  //   document.body.style.overflow = "hidden";
  // }, [true]);
  const videoRef = useRef(null);
  const videoBgRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);

    if (videoBgRef.current) {
      videoBgRef.current.playbackRate = 0.9; // Adjust playback speed (0.9 = slightly slower)
    }

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Adjust playback speed (0.5 = half-speed)
    }
  }, []);


  return (
    <>
      {/* {true && (
        <LaunchingPageSoon days={days} hours={hours} min={min} sec={sec} />
      )} */}
      <Navbar
        select={"Elevate Your Skills, Achieve Your Dreams"}
      />
      <div className={styles.main}>
        <div className={styles.center}>
          <div className={styles.firstWrappers}>
            <p>
              Collaborate with Experts to Bring Your Ideas to Life
            </p>
            <div className={styles.firstWrapper}>
              {/* <div className={styles.firstWrapper1} >
                <Spline
                  scene="https://prod.spline.design/TUPrAKS8sLvaBssE/scene.splinecode"
                />
              </div> */}

              <div className={styles.BgWithText} >
                {!isClient ? (
                  <Image
                    src={BgBackground}
                    alt="webImage"
                    priority
                    unoptimized
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <video
                    src={`https://famstep-storage.s3.ap-south-1.amazonaws.com/landing/Planet.mp4`}
                    ref={videoBgRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>

              <div className={styles.headingFirst}>
                <Image
                  src={landingPage}
                  alt="webImage"
                  priority
                  unoptimized
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "contain",
                  }}
                />

              </div>
            </div>
          </div>

          <div className={styles.secondWrapper}>
            <div className={styles.secondHead}>
              <p className={styles.what} > WHAT IS FAMSTEP?</p>
              <p className={styles.all} >Your all-in-one social productivity network.</p>
            </div>
            <div className={styles.secondWrapperHead} >
              <div className={styles.headingSec}>
                <SiTicktick className={styles.headingIcon} />
                <h2>Freelancing</h2>
                <p>
                  Famstep provides skill development, freelancing jobs, hands-on
                  projects, internships, and competitions all on a single, dynamic
                  platform.
                </p>
              </div>

              <div className={styles.headingSec}>
                <SiTicktick className={styles.headingIcon} />
                <h2>Freelancing</h2>
                <p>
                  Famstep provides skill development, freelancing jobs, hands-on
                  projects, internships, and competitions all on a single, dynamic
                  platform.
                </p>
              </div>

              <div className={styles.headingSec}>
                <SiTicktick className={styles.headingIcon} />
                <h2>Freelancing</h2>
                <p>
                  Famstep provides skill development, freelancing jobs, hands-on
                  projects, internships, and competitions all on a single, dynamic
                  platform.
                </p>
              </div>
            </div>
          </div>

          {/* <div className={styles.thirdWrapper}>
            <div className={styles.headingThird}>
              <h2>Diverse income streams.</h2>
              <p>
                From affiliation and influencing to publicity options, Famstep
                offers multiple ways for entrepreneurs and freelancers to
                increase their income.
              </p>
            </div>
            <div className={styles.headingThirdImgWrapper}>
              <div className={styles.headingThirdImg}>
                <Image
                  src={third}
                  alt="webImage"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div> */}

          {/* <div className={styles.fourthWrapper}>
            <div className={styles.headingFourImgWrapper}>
              <div className={styles.headingFourImg}>
                <Image
                  src={fourth}
                  alt="webImage"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
            <div className={styles.headingFour}>
              <h2>Connect with potential clients and employers.</h2>
              <p>
                Famstep bridges the gap between talent and opportunity. Our
                platform helps users get noticed and connect with potential
                clients and employers, ensuring businesses find and hire the
                best talent.
              </p>
            </div>
          </div> */}

          {/* <div className={styles.fifthWrapper}>
            <div className={styles.headingFifth}>
              <h2>Compete and win.</h2>
              <p>
                Participate in competitions and challenges to showcase your
                skills, win prizes, secure sponsored projects, or even land job
                opportunities.
              </p>
            </div>
            <div className={styles.headingFifthImgWrapper}>
              <div className={styles.headingFifthImg}>
                <Image
                  src={fifth}
                  alt="webImage"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div> */}

          {/* <div className={styles.sixthWrapper}>
            <div className={styles.headingSixthImgWrapper}>
              <div className={styles.headingSixthImg}>
                <Image
                  src={sixth}
                  alt="webImage"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
            <div className={styles.headingSixth}>
              <h2>Gain real-world experience.</h2>
              <p>
                Famstep links students and young professionals with real company
                projects and freelance job openings, providing hands-on
                experience that employers value.
              </p>
            </div>
          </div> */}
        </div>
        <TestiSlider />
        <div className={styles.bottomWrapper}>
          {!isClient ? (
            <Image
              src={bottomCollab}
              alt="webImage"
              priority
              unoptimized
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "cover",
              }}
            />
          ) : (
            <>

              <video
                src={`https://famstep-storage.s3.ap-south-1.amazonaws.com/landing/Collabs.mp4`}
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <p>
                {/* Discover the perfect talent for your business with Famstep&apos;s */}
                {/* hiring feature. Join Famstep today to elevate your skills and
            advance your career. */}
                Be a Part of Change Today
              </p>
              <Link href="/login">
                <div className={styles.getStartedBut}>
                  <input type="button" value="Get started" />
                </div>
              </Link>
            </>
          )}
        </div>
        <MegaFooter />
        {/*<Footer />*/}
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  const admin = "2024-09-15 00:00";
  // const Sdate = new Date(admin);
  // const contestStartDate = isValid(Sdate)
  //   ? format(Sdate, "yyyy-MM-dd HH:mm")
  //   : "Invalid Date";
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      admin,
    },
  };
}

export default Landing;
