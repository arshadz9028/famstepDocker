import React, { useState, useContext, useEffect, useRef } from "react";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/Profile.module.scss";
import loaderStyles from "../../styles/ImageLoading.module.scss";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import connectDb from "../../database/conn";
import User from "../../model/userModel";
import chatModel from "../../model/chatModel";
import About from "../../layouts/About";
import ProfileAction from "../../layouts/models/ProfileAction";
import { ContextProvider } from "../../global/context";
import SearchHistory from "../../model/searchHistoryModel";
import { getSession } from "next-auth/react";
import UserFollow from "../../model/followModel";
import UserBlock from "../../model/blockModel";
import useSWR from "swr";
import { useRouter } from "next/router";
import ConnectionsList from "../../layouts/ProfileModal/ConnectionsList";
import ProfilePost from "../../components/ProfilePost";
import ProjectsProfile from "../../layouts/ProjectsProfile";
import Collection from "../../model/postCollection";
import Achievement from "../../model/achievments";
import office from "../../assets/icons/office-building.png";
import graduate from "../../assets/icons/graduate-cap.png";
import NoPostCover from "../../components/profileComp/NoPostCover";
import { BiSolidImage } from "react-icons/bi";
import { GrAchievement } from "react-icons/gr";
import { MdOutlineEngineering } from "react-icons/md";
import { VscMention } from "react-icons/vsc";
import { PiEmptyFill } from "react-icons/pi";
import { GiBilledCap } from "react-icons/gi";
import { FaCrown } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";
import { HiLightBulb } from "react-icons/hi";
import Zoomphoto from "../../layouts/post/Zoomphoto";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import {
  useFollowerData,
  getPendingStatus,
  handleFollowRequest,
  handleCloseButton,
} from "../../utils/followerUtils";
import useSWRInfinite from "swr/infinite";
import ProfileAchievements from "../../components/Achievements/ProfileAchievements";
import { IoIosLock } from "react-icons/io";

async function fetchFollowers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
async function fetchPhoto(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
async function fetchAbout(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default function Profile({
  userData,
  FollowerData,
  session,
  blockedUser,
  blockedUser2,
  postColl,
  achievementsFetch,
  profileChatId,
}) {
  const router = useRouter();
  const { profile } = router.query;
  const blockUserC = blockedUser?.blockedIds.map((user) => user.userId);
  const blockUserCondition = blockUserC?.includes(session?.user?.id);
  const blockSession = blockedUser2?.blockedIds.map((user) => user.userId);
  const blockSessionCondition = blockSession?.includes(profile);
  const bottomRef = useRef(null);
  const radioRef = useRef(null);
  const AchieveRef = useRef(null);

  const [toggleState, setToggleState] = useState("post");
  const { model } = useContext(ContextProvider);

  const [friendList, setFriendList] = useState("");


  // const userData = usersData?.data;

  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateImageData,
  } = useSWRInfinite(
    (index) =>
      `/api/home/imageFetch/?profile=${profile}&page=${index + 1}&limit=9`,
    fetchPhoto,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const posts = data ? data.flatMap((page) => page.data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1]?.data?.length === 0;

  const postData = { data: posts };
  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight &&
      !isLoadingMore &&
      !isReachingEnd
    ) {
      setSize(size + 1); // Load more posts
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [isLoadingMore, isReachingEnd]);

  const {
    data: userFetchData,
    mutate: mutateuserFetchData,
    error: userFetchDataError,
  } = useSWR(`/api/profile/profileFetch/?profile=${profile}`, fetchAbout);

  const goToUserAbout = (e) => {
    if (radioRef.current) {
      radioRef.current.checked = true;
    }
    setToggleState("About");
    e.preventDefault();
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 0);
  };

  const follow =
    FollowerData?.following.length !== 0
      ? FollowerData?.following.map((foll) => foll.userid)
      : null;
  const followusername = userData._id;
  const [prfAction, setPrfAction] = useState(false);

  const { followerData, mutateFollowerData } = useFollowerData(followusername);

  const praisevalue =
    followerData?.dats?.praise.length !== 0
      ? followerData?.dats?.praise.map((val) => val?.userid?._id)
      : null;

  const { pendingStatus, pendingValue } = getPendingStatus(
    followerData,
    session
  );
  const [followStatus, setFollowStatus] = useState(
    follow?.includes(followusername) ? "following" : "follow"
  );

  const follow_request = async () => {
    await handleFollowRequest(followStatus, followusername, mutateFollowerData);
    setFollowStatus(followStatus === "following" ? "follow" : "following");
  };
  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "2rem", // Set your custom font size
  };
  const profilehandle = () => {
    setPrfAction(true);
  };
  /* handling praise user */
  const praiseFilter = session.user.level > userData.level;
  const handlePraise = async () => {
    if (praiseFilter) {
      try {
        await axios.post(`/api/profile/praiseUser/?profile=${profile}`);
        mutateFollowerData();
      } catch (error) {
        console.error("Error praising user:", error);
      }
    }
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (model) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [model]);

  const hasEducationOrExperience =
    userFetchData?.AboutData &&
    (userFetchData.AboutData.education?.length != 0 ||
      userFetchData.AboutData.experience?.length != 0);

  const goToUserAchievement = (e) => {
    if (AchieveRef.current) {
      AchieveRef.current.checked = true;
    }
    setToggleState("achievements");
    e.preventDefault();
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 0);
  };

  return (
    <>
      <Navbar select={"Profile"} session={session} />
      <ProfileAction
        prfAction={prfAction}
        setPrfAction={setPrfAction}
        userData={userData}
        blockedUser2={blockedUser2}
        blockedUser={blockedUser}
        session={session}
        message={userData._id}
        profileChatId={profileChatId}
      />
      {model ? (
        <Zoomphoto
          mutateImageData={mutateImageData}
          userName={session?.user.username}
          dp={session?.user.image}
          imageData={postData}
        />
      ) : (
        <> </>
      )}
      {friendList != "" && (
        <ConnectionsList
          setFriendList={setFriendList}
          friendList={friendList}
          mutatefollowerData={mutateFollowerData}
          followerData={followerData?.dats}
          session={session}
          userId={followerData.user}
          FollowerDataSession={FollowerData}
        />
      )}
      {/* profile page */}
      <section className={styles.section_profile_page}>
        {/* Upper three cards section */}
        <div className={styles.main_profile}>
          {/* for center the things */}
          <div
            className={styles.profile_header}
            id={userData?.userBio ? "profile_header1" : "profile_header"}
          >
            {/* first profile card */}
            <div className={styles.firstCard}>
              <div>
                <div className={styles.profile_pic}>
                  <Image
                    alt="Profile Image"
                    priority
                    // unoptimized
                    src={userData.image}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className={styles.profile_name}>
                  <h3>
                    {userData?.name}
                    {userData?.verifiedTick.color !== "" && (
                      <span className={styles.blue_tick}>
                        <RiVerifiedBadgeFill
                          className={styles.blue_tick1}
                          style={{ color: `${userData?.verifiedTick.color}` }}
                        />
                      </span>
                    )}
                  </h3>

                  <p className={styles.title}>{userData?.designation}</p>

                  <p className={styles.titleP} style={{ marginTop: "1rem" }}>{userData?.location}</p>
                </div>
                <div className={styles.follow}>
                  <p
                    onClick={() => {
                      if (
                        !blockUserCondition &&
                        !blockSessionCondition &&
                        followerData?.dats?.followers.length
                      ) {
                        setFriendList("Followers");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span style={{ color: "black", paddingRight: ".5rem" }}>
                      {" "}
                      {followerData?.dats
                        ? followerData?.dats?.followers.length
                        : 0}
                    </span>{" "}
                    followers
                  </p>
                  <p
                    onClick={() => {
                      if (
                        !blockUserCondition &&
                        !blockSessionCondition &&
                        followerData?.dats?.following.length
                      ) {
                        setFriendList("Following");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span style={{ color: "black", paddingRight: ".5rem" }}>
                      {" "}
                      {followerData?.dats
                        ? followerData?.dats?.following.length
                        : 0}
                    </span>{" "}
                    following
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.centerUpperImage}>
              <div className={styles.centerImageCover}>
                {userData?.background && <Image
                  src={userData?.background}
                  alt="background Image"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  style={{
                    objectFit: "cover",
                  }}
                />}
                {/* {admin && (
                  <div
                    className={styles.adminEdit}
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    <MdOutlineEdit className={styles.adminEditIcons} />
                  </div>
                )} */}
              </div>

            </div>

            {/* second card upper part */}
            <div className={styles.secondCard_upper}>
              <div
                className={styles.name_icon}
                // id={hasEducationOrExperience ? undefined : "name_icon"}
                style={{
                  marginBottom: userFetchData?.AboutData == null || userFetchData?.AboutData.education.length == 0 &&
                    userFetchData?.AboutData.experience.length == 0 ? "1rem" : "0rem"
                }}
              >
                {/* <style jsx global>
                  {`
                    @media (max-width: 970px) {
                      #name_icon {
                        padding: 0rem;
                      }
                      #profile_header {
                        height: 50rem;
                        grid-template-rows: 0.9fr 3.5fr 2fr 2fr;
                      }

                      #profile_header1 {
                        height: 58rem;
                        grid-template-rows: 0.9fr 3.5fr 2fr 2fr;
                      }
                      #user_bio {
                        height: 6rem;
                      }
                    }
                  `}
                </style> */}
                <div className={styles.name}>
                  <p className={styles.nameP} id={styles.nameP}>
                    {userData.username}
                  </p>
                </div>
                <div className={styles.strangerMobCover} >
                  <div className={styles.strangerMob}>
                    {!blockUserCondition && !blockSessionCondition ? (
                      <>
                        <div
                          className={styles.follow_buttons}
                          onClick={follow_request}
                          style={
                            pendingStatus || pendingValue ? { backgroundColor: "#08529B" } : {}
                          }
                        >
                          <button style={pendingStatus || pendingValue ? { color: "white" } : {}}>
                            {pendingStatus ? (
                              <p>Unfollow</p>
                            ) : pendingValue ? (
                              <p>Pending</p>
                            ) : (
                              <p>Follow</p>
                            )}
                          </button>
                        </div>

                        <div className={styles.tooltip}>
                          <div
                            className={
                              praiseFilter ? styles.follow_buttons : styles.follow_buttonsNoHover
                            }
                            onClick={handlePraise}
                            style={
                              praisevalue?.includes(session.user.id)
                                ? { backgroundColor: "#08529B" }
                                : {}
                            }
                          >
                            <button
                              style={
                                praisevalue?.includes(session.user.id) ? { color: "white" } : {}
                              }
                            >
                              {praisevalue?.includes(session.user.id) ? (
                                <p>Unpraise</p>
                              ) : (
                                <p>Praise</p>
                              )}
                            </button>
                            {!praiseFilter && (
                              <p className={styles.tooltiptext}>
                                To praise {userData.name}&apos;s profile, your competition level
                                must be high.
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: "500",
                          color: "#8A8A8A",
                          textAlign: "center",
                        }}
                      >
                        Follow and praise actions are blocked.
                      </span>
                    )}
                  </div>
                  <div className={styles.settingsIcon} onClick={profilehandle}>
                    <BsThreeDots style={{ fill: "#8A8A8A", cursor: "pointer" }} />
                  </div>
                </div>
              </div>
              <div
                className={styles.highlights_first_tablet}
              >
                {hasEducationOrExperience && (
                  <>
                    {userFetchData?.AboutData?.experience[0]?.working &&
                      userFetchData?.AboutData?.education[0]?.studying ? (
                      <div className={styles.highlights}>
                        <Image
                          className={styles.pic}
                          priority
                          src={office}
                          alt="award"
                        />

                        <p>
                          {userFetchData.AboutData.experience[0].company}
                          <i
                            className={styles.highlightsSeemore}
                            onClick={goToUserAbout}
                          >
                            ...see more
                          </i>
                        </p>
                      </div>
                    ) : (
                      <div className={styles.highlights}>
                        {userFetchData?.AboutData?.experience[0]?.working && (
                          <>
                            <Image
                              className={styles.pic}
                              priority
                              src={office}
                              alt="award"
                            />
                            <p>
                              {userFetchData.AboutData.experience[0].company}
                              <i
                                className={styles.highlightsSeemore}
                                onClick={goToUserAbout}
                              >
                                ...see more
                              </i>
                            </p>
                          </>
                        )}

                        {userFetchData?.AboutData?.education[0]?.studying && (
                          <>
                            <Image
                              className={styles.pic}
                              priority
                              src={graduate}
                              alt="award"
                            />
                            <p>
                              {userFetchData.AboutData.education[0].college}{" "}
                              <i
                                className={styles.highlightsSeemore}
                                onClick={goToUserAbout}
                              >
                                ...see more
                              </i>
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* add bio desktop */}
              <div className={styles.profile_bio}>
                <p className={styles.profileAbout} >Bio</p>
                {userData?.userBio ? (
                  <div style={{ width: "100%" }}>
                    <pre className={styles.user_bio}>{userData?.userBio}</pre>
                  </div>
                ) : (
                  <div className={styles.bio_buttonStranger}>
                    <p>Hi, My name is {userData?.name}. I haven&apos;t added a bio just yet—stay tuned!</p>
                  </div>
                )}

              </div>
            </div>

            {/* second card lower part */}
            <div className={styles.rank}>
              <div className={styles.rank_levelCover}>
                <div className={styles.rank_level}>
                  <div className={styles.ranknumber}>
                    <p className={styles.rankScore}>{userData?.level}</p>
                    <p>LEVEL</p>
                  </div>
                  <div
                    className={styles.ranknumber}
                    onClick={() => setFriendList("Praise")}
                    style={{ cursor: "pointer" }}
                  >
                    <p className={styles.rankScore}>
                      {followerData?.dats
                        ? followerData?.dats?.praise.length
                        : 0}
                    </p>
                    <p>PRAISE</p>
                  </div>
                </div>
                <div className={styles.badges}>
                  <div className={styles.award_svg}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 8.999a6.99 6.99 0 0 0 2.879 5.646l.001.001a6.972 6.972 0 0 0 1.881.979l.051.019a6.906 6.906 0 0 0 1.163.271 6.79 6.79 0 0 0 1.024.085H12c.35 0 .69-.034 1.027-.084l.182-.028c.336-.059.664-.139.981-.243l.042-.016C17 14.693 19 12.078 19 8.999 19 5.14 15.86 2 12 2S5 5.14 5 8.999zM12 4c2.756 0 5 2.242 5 4.999h-2A3.003 3.003 0 0 0 12 6V4zM7.521 16.795V22L12 20.5l4.479 1.5.001-5.205a8.932 8.932 0 0 1-8.959 0z" />
                    </svg>
                  </div>
                  <p>badges</p>
                </div>
                <div className={styles.awards}>
                  <div
                    className={styles.badgeCover1}
                    style={{
                      border:
                        userData?.badges?.knowledge?.color != ""
                          ? `2px solid ${userData?.badges?.knowledge?.color}`
                          : undefined,
                    }}
                  >
                    <div className={styles.badgeCover}>
                      {userData?.badges?.knowledge?.color == "" && (
                        <IoIosLock className={styles.badgeCoverIconLock} />
                      )}
                      <FaGraduationCap
                        className={styles.badgeCoverIcon}
                        style={{
                          color:
                            userData?.badges?.knowledge?.color !== ""
                              ? `${userData?.badges?.knowledge?.color}`
                              : undefined,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={styles.badgeCover1}
                    style={{
                      border:
                        userData?.badges?.judgment?.color != ""
                          ? `2px solid ${userData?.badges?.judgment?.color}`
                          : undefined,
                    }}
                  >
                    <div className={styles.badgeCover}>
                      {userData?.badges?.judgment?.color == "" && (
                        <IoIosLock className={styles.badgeCoverIconLock} />
                      )}
                      <HiLightBulb
                        className={styles.badgeCoverIcon}
                        style={{
                          color:
                            userData?.badges?.judgment?.color !== ""
                              ? `${userData?.badges?.judgment?.color}`
                              : undefined,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={styles.badgeCover1}
                    style={{
                      border:
                        userData?.badges?.admin?.color != ""
                          ? `2px solid ${userData?.badges?.admin?.color}`
                          : undefined,
                    }}
                  >
                    <div className={styles.badgeCover}>
                      {userData?.badges?.admin?.color == "" && (
                        <IoIosLock className={styles.badgeCoverIconLock} />
                      )}

                      <GiBilledCap
                        className={styles.badgeCoverIcon}
                        style={{
                          color:
                            userData?.badges?.admin?.color !== ""
                              ? `${userData?.badges?.admin?.color}`
                              : undefined,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={styles.badgeCover1}
                    style={{
                      border:
                        userData?.badges?.leader?.color != ""
                          ? `2px solid ${userData?.badges?.leader?.color}`
                          : undefined,
                      marginRight: "0rem",
                    }}
                  >
                    <div className={styles.badgeCover}>
                      {userData?.badges?.leader?.color == "" && (
                        <IoIosLock className={styles.badgeCoverIconLock} />
                      )}

                      <FaCrown
                        className={styles.badgeCoverIcon}
                        style={{
                          color:
                            userData?.badges?.leader?.color !== ""
                              ? `${userData?.badges?.leader?.color}`
                              : undefined,
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>


            {/* third card lower part */}

            <div className={styles.skill_main}>
              <div className={styles.skills}>
                <p>Skills</p>
                {/* <p>Skills</p> */}
              </div>
              {userData?.skills && userData.skills.length > 0 ? (
                userData?.skills.map((val, index) => {
                  return (
                    <pre className={styles.usersSkills} key={val._id} style={{ color: "#08529B" }}>
                      {val.skill}
                    </pre>
                  );
                })
              ) : (
                <div className={`${styles.SkillsNotAvailStranger} `} style={{ cursor: "default" }}>
                  <p className={styles.SkillsNotPara} >{userData?.name} hasn&apos;t added </p> <p className={styles.SkillsNotPara2} >any skills yet.</p>
                </div>
              )
              }
              {/* <table>
                <thead>
                  <tr>
                    <th />
                    <th>Ranks</th>
                    <th>Score</th>
                  </tr>
                </thead>
                {userData?.skills.map((val, index) => {
                
                  return (
                    <tbody key={index}>
                      <tr>
                        <td style={{ color: "#08529B", textAlign: "left" }}>
                          {val.skill}
                        </td>
                        {val.points === 0 ? (
                          <td>0</td>
                        ) : (
                          <td>{val.rank}</td>
                        )}
                        <td>{val.points}</td>
                      </tr>
                    </tbody>
                  );
                })}
              </table> */}
            </div>
          </div>
        </div>

        {/* story section */}

        {/* condition for block user or not */}
        {/* tab section*/}
        <div
          className={styles.profile_tab}
          style={{
            display:
              !blockUserCondition && !blockSessionCondition
                ? undefined
                : "none",
          }}
        >
          <div className={styles.profileTabBig}>

            <div className={styles.tab_center} id="tab_center">
              <style jsx global>
                {`
                #tab_center {
                  justify-content: center;
                }
                @media (max-width: 767px) {
                  #tab_center {
                    justify-content: space-between;
                  }
                  #profile_header {
                    height: auto;
                    grid-template-rows: repeat(5, auto);
                  }
                  #profile_header1 {
                    height: auto;
                    grid-template-rows: repeat(5, auto);
                  }
                  #user_bio {
                    max-height: 10rem;
                  }
                }
              `}
              </style>
              {/* <FlipProvider> */}

              <input type="radio" name="tabs" id="tab1" ref={AchieveRef} />
              <label
                id={styles.labelProfile}
                htmlFor="tab1"
                onClick={(e) => {
                  setToggleState("achievements");
                }}
                className={
                  toggleState === "achievements" ? styles["disable-bg-color"] : ""
                }
              >
                ACHIEVEMENTS
              </label>

              <>
                <input type="radio" name="tabs" defaultChecked id="tab2" />
                <label
                  id={styles.labelProfile}
                  htmlFor="tab2"
                  onClick={(e) => {
                    setToggleState("post");
                  }}
                  className={
                    toggleState === "post" ? styles["disable-bg-color"] : ""
                  }
                >
                  POSTS
                </label>
              </>
              <input type="radio" name="tabs" id="tab3" />
              <label
                id={styles.labelProfile}
                htmlFor="tab3"
                onClick={(e) => {
                  setToggleState("projects");
                }}
                className={
                  toggleState === "projects" ? styles["disable-bg-color"] : ""
                }
              >
                PROJECTS
              </label>
              <input type="radio" name="tabs" id="tab4" ref={radioRef} />
              <label
                id={styles.labelProfile}
                htmlFor="tab4"
                onClick={(e) => {
                  setToggleState("About");
                }}
                className={
                  toggleState === "About" ? styles["disable-bg-color"] : ""
                }
                ref={bottomRef}
              >
                ABOUT
              </label>
              <input type="radio" name="tabs" id="tab5" />
              <label
                id={styles.labelProfile}
                htmlFor="tab5"
                onClick={(e) => {
                  setToggleState("Tagged");
                }}
                className={
                  toggleState === "Tagged" ? styles["disable-bg-color"] : ""
                }
              >
                MENTIONED
              </label>

              <div className={styles.gliderProfile} />
            </div>
          </div>
          {/* </FlipProvider> */}
        </div>
        {/* gallery photo section  */}
        <div className={styles.acchieventes}>
          {blockUserCondition || blockSessionCondition ? (
            <div className={styles.handleBlock}>
              <PiEmptyFill className={styles.userBlocked} />
              <p>This user&apos;s information is unavailable.</p>
            </div>
          ) : (
            <div
              className={
                toggleState === "projects" || toggleState === "About"
                  ? styles.acchieve_centerAbout
                  : styles.acchieve_center
              }
            >
              {/* map for images */}
              {toggleState === "achievements" && (
                <>
                  {achievementsFetch.length > 0 ? (
                    achievementsFetch?.map((value) => {
                      return (
                        <div className={styles.cards} key={value?._id}>
                          <ProfileAchievements value={value.solution} />
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <NoPostCover
                        NoPostIcons={GrAchievement}
                        NoPostMessage={"No Achievements Available Yet"}
                      />
                    </>
                  )}

                  {/* map end for images */}
                </>
              )}
              {toggleState === "post" && (
                <>
                  {postData?.data.length > 0 ? (
                    postData?.data.map((value, index) => {
                      return (
                        <ProfilePost
                          key={value?._id}
                          postData={value}
                          userId={session?.user.id}
                          userName={session?.user.username}
                        />
                      );
                    })
                  ) : (
                    <>
                      {!isLoadingInitialData && (
                        <NoPostCover
                          NoPostIcons={BiSolidImage}
                          NoPostMessage={"No Post Available Yet"}
                        />
                      )}
                    </>
                  )}

                  {isLoadingMore && (
                    <div
                      className={loaderStyles.loaderCover}
                      style={{ height: isLoadingInitialData ? "70vh" : "auto" }}
                    >
                      <div className={loaderStyles.loader} />
                    </div>
                  )}

                  {postData?.data.length != 0 && isReachingEnd && (
                    <div className={loaderStyles.ParaCover}>
                      <p className={loaderStyles.loaderCoverP}>
                        There are no more posts to display.
                      </p>
                    </div>
                  )}
                </>
              )}

              {toggleState === "About" && (
                <>
                  {hasEducationOrExperience ? (
                    <About
                      mutateuserFetchData={mutateuserFetchData}
                      userAbout={userFetchData?.AboutData}
                      userId={session?.user.id}
                    />
                  ) : (
                    <>
                      <NoPostCover
                        NoPostIcons={FaGraduationCap}
                        NoPostMessage={"Not Updated Yet"}
                      />
                    </>
                  )}
                </>
              )}
              {toggleState === "projects" && (
                <>
                  {userFetchData?.AboutData != null &&
                    userFetchData?.AboutData?.project.length != 0 ? (
                    <ProjectsProfile
                      mutateuserFetchData={mutateuserFetchData}
                      userAbout={userFetchData?.AboutData}
                      userId={session?.user.id}
                    />
                  ) : (
                    <>
                      <NoPostCover
                        NoPostIcons={MdOutlineEngineering}
                        NoPostMessage={"Not Updated Yet"}
                      />
                    </>
                  )}
                </>
              )}
              {toggleState === "Tagged" && (
                <>
                  {postColl?.PostTags.length > 0 ? (
                    postColl?.PostTags.map((value, index) => {
                      return (
                        <ProfilePost
                          postData={value}
                          key={value?._id}
                          userId={session?.user.id}
                          userName={session?.user.username}
                        />
                      );
                    })
                  ) : (
                    <>
                      <NoPostCover
                        NoPostIcons={VscMention}
                        NoPostMessage={"No Mention Available Yet"}
                      />
                    </>
                  )}
                </>
              )}
              {/* map will be end */}
            </div>
          )}
        </div>
      </section >

      {/* <Zoomphoto/> */}
    </>
  );
}

/* SSR */

export async function getServerSideProps({ req, query }) {
  await connectDb();

  const session = await getSession({ req });
  const { profile } = query;
  const currentUser = session?.user?.id;

  if (profile == "67f7c821696aed22412e4b06") {
    return {
      redirect: {
        destination: `/profile/famstep`,
        permanent: false,
      },
    };
  }

  if (profile === currentUser) {
    return {
      redirect: {
        destination: `/me`,
        permanent: false,
      },
    };
  }

  // Redirect for new users
  const { isNewUser } = session?.user || {};
  if (isNewUser) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Fetch necessary data
  const userData = await User.findOne({ _id: profile });

  const followerData = await UserFollow.findOne({ user: currentUser });
  const profileChat = await chatModel.findOne(
    {
      $and: [
        { users: { $elemMatch: { $eq: currentUser } } },
        { users: { $elemMatch: { $eq: profile } } },
      ],
    },
    { _id: 1 }
  );
  const profileChatId = profileChat ? profileChat._id : null;

  const userIdToFollow = userData?._id;
  const userFollow = await UserFollow.find({
    $and: [{ user: currentUser }, { following: { userid: userIdToFollow } }],
  });

  // Update or create search history
  const currentDate = new Date();
  let userHistory = await SearchHistory.findOne({ user: currentUser });
  if (!userHistory) {
    await SearchHistory.create({
      user: currentUser,
      histUser: [{ userId: userData?._id, currentDate }],
    });
  } else {
    userHistory.histUser.push({ userId: userData?._id, currentDate });
    await userHistory.save();
  }

  // Fetch blocked users
  const blockedUser = await UserBlock.findOne({ user: profile });
  const blockedUser2 = await UserBlock.findOne({ user: currentUser });

  // Fetch post collections and tags
  let postColl = await Collection.findOne({ userId: profile })
    .populate("PostCollections")
    .populate("PostTags");

  postColl = await User.populate(postColl, {
    path: "PostCollections.userid",
    select: "image",
  });

  postColl = await User.populate(postColl, {
    path: "PostTags.userid",
    select: "image",
  });

  // Handle achievements
  const achievements = await Achievement.find();
  const sortedAchievements = achievements.filter(
    (achieve) => achieve.userId.toString() === profile
  );

  return {
    props: {
      session,
      postColl: JSON.parse(JSON.stringify(postColl)),
      userData: JSON.parse(JSON.stringify(userData)),
      FollowerData: JSON.parse(JSON.stringify(followerData)),
      blockedUser: JSON.parse(JSON.stringify(blockedUser)),
      blockedUser2: JSON.parse(JSON.stringify(blockedUser2)),
      achievementsFetch: JSON.parse(JSON.stringify(sortedAchievements)),
      profileChatId: JSON.parse(JSON.stringify(profileChatId)),
    },
  };
}
