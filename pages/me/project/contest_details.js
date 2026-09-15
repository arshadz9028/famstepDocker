import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import bgImage from "../../../assets/newIcons/famstepContest.png";
import { MdOutlineComputer, MdGroups2 } from "react-icons/md";
import { FaFacebook, FaLinkedin, FaTwitterSquare } from "react-icons/fa";
import Navbar from "../../../layouts/Navbar";
import { getSession, useSession } from "next-auth/react";
import styles from "../../../styles/contestMoreDetails.module.scss";
import insta from "../../../assets/icons/instagram.png";
import { ContextProvider } from "../../../global/context";
import ContestDetailsTab from "../../../components/Contests/ContestDetailsTab";
import ContestAbout from "../../../components/Contests/ContestAbout";
import ContestTiming from "../../../components/Contests/ContestTiming";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import axios from "axios";
import Competition from "../../../model/competition";
import User from "../../../model/userModel";

async function fetchCode(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
function Contest_details({ session ,ongoingData}) {
  const [toggleState, setToggleState] = useState("About");
  const { boxes,ongoing ,setOngoing} = useContext(ContextProvider);
  const router = useRouter();
  const { contestId } = router.query;
  const mContestId = contestId?.split("?")[0];
  const userenrolled = contestId?.split("?")[1];
  const {
    data: codeData,
    mutate: mutatecodeData,
    error: UserDataError,
  } = useSWR(`/api/code/codeFetch/?stage=${mContestId}`, fetchCode);
  useEffect(() => {
    
    setOngoing(ongoingData);
   
  }, [ongoingData]);
  return (
    <>
      <Navbar select={"contest"} session={session} />

      <div className={styles.detailsMain}>
        <div className={styles.detailsCenter}>
          <div className={styles.TopImage}>
            <Image
              src={bgImage}
              alt="contestTheme"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "cover",
              }}
            />

            <div className={styles.circleImageCover}>
              <div className={styles.circleImageWithSecond}>
                <div className={styles.imageWhiteCircle} />
                <div className={styles.imageWhiteCircle1} />
                <div className={styles.circleImage}>
                  <Image
                    src={codeData?.subData?.image}
                    alt="contestCircle"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div className={styles.contestHeading}>
                <div className={styles.contestTheme}>
                  <p>{codeData?.subData?.ContestName}</p>
                </div>
                <div className={styles.belowheading}>
                  <p>
                    <span>
                      <MdGroups2 className={styles.public} />
                    </span>{" "}
                    {codeData?.subData?.participants.length} Registered{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* top image ke niche wala circle image and time and date */}

          <div className={styles.contestTimingAndCircle}>
            <ContestTiming
              MdOutlineComputer={MdOutlineComputer}
              codeData={codeData}
            />
          </div>

          {/* tab and more about contest */}
          <div className={styles.contestbelowDetails}>
            {/* <tab> */}
            <ContestDetailsTab
              toggleState={toggleState}
              setToggleState={setToggleState}
              codeData={codeData}
            />
            {/* </tab> */}
            <ContestAbout
              toggleState={toggleState}
              setToggleState={setToggleState}
              codeData={codeData}
            />
          </div>

          {/* //right side wala section */}
          <div
            className={styles.clickToStart}
            style={{ zIndex: boxes ? "99" : "" }}
          >
            <div className={styles.clickToStartOption}>
              {userenrolled === "enroll" || ongoing[0]?.contestState === 'ongoing' ? (
                <>
                  <p className={styles.enroll}>
                    Begin the competition by clicking here.
                  </p>
                  <input
                    type="button"
                    value="START NOW"
                    className={styles.clickToStartButton}
                    onClick={() => router.push(`/ideCode/${mContestId}`)}
                  />
                </>
              ) : (
                <>
                  <p className={styles.notify}>
                    Congratulations on registering!
                  </p>

                  <p className={styles.notify}>
                    You will be notify once competition will start
                  </p>
                </>
              )}
            </div>

            <div className={styles.socialShare}>
              <p>Social Share</p>
              <div className={styles.socialShareIcons}>
                <div className={styles.socialIcons}>
                  {" "}
                  <FaLinkedin
                    className={styles.socialIcons1}
                    style={{ color: "#0077b5 " }}
                  />{" "}
                </div>
                <div className={styles.socialIcons2}>
                  {" "}
                  <Image
                    src={insta}
                    alt="insta"
                    className={styles.socialIcons2}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />{" "}
                </div>
                <div className={styles.socialIcons}>
                  {" "}
                  <FaFacebook
                    className={styles.socialIcons1}
                    style={{ color: "#316FF6" }}
                  />{" "}
                </div>
                <div className={styles.socialIcons}>
                  {" "}
                  <FaTwitterSquare
                    className={styles.socialIcons1}
                    style={{ color: "#1DA1F2" }}
                  />{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const session = await getSession({ req });
  const userid = session?.user.id;

  const { userPostId } = query;
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const userExist = await User.findOne({ _id: userid });

  const userComp = await Competition.find({});

  const level = userExist.level + 1;

  const filteredLevels = userComp?.filter((val) => val.stage == level);

 
  let ongoing = [];


  filteredLevels.forEach((value) => {
    if (value.contestState === "ongoing") {
      ongoing.push(value);
    } 
  });
  
  try {
    const { id, username, isNewUser } = session?.user;
    if (isNewUser) {
      return {
        redirect: {
          destination: "/getting-started",
          permanent: false,
        },
      };
    }

    return {
      props: {
        session,
        ongoingData: JSON.parse(JSON.stringify(ongoing)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
}

export default Contest_details;
