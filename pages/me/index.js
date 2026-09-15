import React, { useState, useContext, useEffect, useRef } from "react";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/Profile.module.scss";
import loaderStyles from "../../styles/ImageLoading.module.scss";
import Image from "next/image";
import { getSession } from "next-auth/react";
import connectDb from "../../database/conn";
import Collection from "../../model/postCollection";
import Zoomphoto from "../../layouts/post/Zoomphoto";
import EditProfile from "../../layouts/EditProfile";
import About from "../../layouts/About";
import { ContextProvider } from "../../global/context";
import ProfilePost from "../../components/ProfilePost";
import UserFollow from "../../model/followModel";
import User from "../../model/userModel";
import { MdModeEditOutline } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import useSWR from "swr";
import axios from "axios";
import ConnectionsList from "../../layouts/ProfileModal/ConnectionsList";
import ProjectsProfile from "../../layouts/ProjectsProfile";
import Achievement from "../../model/achievments";
import office from "../../assets/icons/office-building.png";
import graduate from "../../assets/icons/graduate-cap.png";
import EditSkills from "../../layouts/ProfileModal/EditSkills";
import SkillsModal from "../../layouts/gettingStarted/SkillsModal";
import NoPostCover from "../../components/profileComp/NoPostCover";
import { BiSolidImage } from "react-icons/bi";
import { GrAchievement } from "react-icons/gr";
import { VscMention } from "react-icons/vsc";
import { BsCollectionFill } from "react-icons/bs";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import { GiBilledCap } from "react-icons/gi";
import { FaCrown } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";
import { HiLightBulb } from "react-icons/hi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ProfileAchievements from "../../components/Achievements/ProfileAchievements";
import { IoIosLock } from "react-icons/io";
import UpdateusProfile from "../../layouts/Network/UpdateusProfile";
import AddImage from "../../layouts/post/PostImage";

async function fetchAbout(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
async function fetchUsers(url) {
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

const Profile = ({ session, achievementsFetch, postColl, usersRender }) => {
  const {
    data: usersData,
    mutate: mutatefollowerData,
    error: followerError,
  } = useSWR("/api/profile/follow/userFetch", fetchUsers);
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateImageData,
  } = useSWRInfinite(
    (index) => `/api/home/imageFetch?page=${index + 1}&limit=9`,
    fetchPhoto,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const posts = data ? data.flatMap((page) => page?.data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1]?.data?.length === 0;

  const postData = { data: posts };
  // Handle infinite scrolling
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

  const Router = useRouter();
  const userData = usersData?.userDataS;
  const { model, skillModal, setSkillModal, createpost } = useContext(ContextProvider);
  const [toggleState, setToggleState] = useState("post");
  const [editDetail, setEditDetail] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [friendList, setFriendList] = useState("");
  const bottomRef = useRef(null);
  const radioRef = useRef(null);
  const AchieveRef = useRef(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [updateSkills, setUpdateSkills] = useState(false);
  const [updateDetails, setUpdateDetails] = useState(false);

  useEffect(() => {
    if (!usersRender) return;

    const shouldShowModal = usersRender.updateProfile;
    const hasEmptyDesignation = !usersRender.designation;
    const hasNoSkills = !usersRender.skills?.length;

    if (shouldShowModal) {
      setUpdateProfile(true);
      
      // Set the appropriate flags based on what needs to be updated
      if (hasEmptyDesignation && hasNoSkills) {
        setUpdateDetails(true);
        setUpdateSkills(true);
      } else if (hasEmptyDesignation) {
        setUpdateDetails(true);
      } else if (hasNoSkills) {
        setUpdateSkills(true);
      }
    }
  }, [usersRender]);

  const handleEdit = async () => {
    setEditDetail(!editDetail);
  };
  const skillFunc = async () => {
    setEditSkills(!editSkills);
  };

  const {
    data: userFetchData,
    mutate: mutateuserFetchData,
    error: userFetchDataError,
  } = useSWR(`/api/profile/profileFetch`, fetchAbout);

  useEffect(() => {
    if (editDetail || friendList || editSkills || skillModal || model || createpost || updateProfile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [editDetail, friendList, editSkills, skillModal, model, createpost, updateProfile]);

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
      { updateProfile && (
        <UpdateusProfile
          setUpdateProfile={setUpdateProfile}
          page={"me"}
          updateDetails={updateDetails}
          updateSkills={updateSkills}
          setEditDetail={setEditDetail}
        />
      )}
      {skillModal && (
        <SkillsModal
          setSkillModal={setSkillModal}
          Value={"Save"}
          mutatefollowerData={mutatefollowerData}
        />
      )}

      {editDetail && (
        <EditProfile
          userData={userData}
          setEditDetail={setEditDetail}
          editDetail={editDetail}
        />
      )}

      {createpost && (
        <AddImage
          userdp={session?.user.image}
          name={session?.user.name}
          ImageData={posts}
          session={session}
          mutateImageData={mutateImageData}
        />
      )}

      {editSkills && (
        <EditSkills
          userData={userData}
          usersData={usersData}
          session={session}
          setEditSkills={setEditSkills}
          editSkills={editSkills}
          mutatefollowerData={mutatefollowerData}
        />
      )}

      {model ? (
        <Zoomphoto
          dp={session?.user.image}
          userName={session?.user.username}
          session={session}
          // imageData={posts}
          mutateImageData={mutateImageData}
        />
      ) : (
        <></>
      )}
      {friendList != "" && (
        <ConnectionsList
          setFriendList={setFriendList}
          friendList={friendList}
          mutatefollowerData={mutatefollowerData}
          followerData={usersData?.data}
          session={session}
          userId={usersData?.data?.user._id}
        />
      )}
      {/* profile page */}
      <section className={styles.section_profile_page}>
        {/* Upper three cards section */}
        <div className={styles.main_profile}>
          {/* for center the things */}
          <div className={styles.profile_header}>
            {/* first profile card */}
            <div className={styles.firstCard}>
              <div>
                <div className={styles.profile_pic}>
                  <Image
                    alt="Profile Image"
                    // priority
                    // unoptimized
                    src={session?.user.image}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className={styles.profile_name}>
                  <h3>
                    {session?.user.name}
                    {usersRender?.verifiedTick.color !== "" && (
                      <span className={styles.blue_tick}>
                        <RiVerifiedBadgeFill className={styles.blue_tick1} style={{ color: `${usersRender?.verifiedTick.color}` }} />
                      </span>
                    )}
                  </h3>

                  <p className={styles.title}>{usersRender?.designation}</p>
                  <p className={styles.titleP} style={{ marginTop: "1rem" }}>{usersRender?.location}</p>

                </div>
                <div className={styles.follow}>
                  <p
                    onClick={() => {
                      if (usersData?.data?.followers.length !== 0) {
                        setFriendList("Followers");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span style={{ color: "black", paddingRight: ".5rem" }}>
                      {" "}
                      {usersData?.data
                        ? usersData?.data?.followers.length
                        : 0}{" "}
                    </span>{" "}
                    followers
                  </p>
                  <p
                    onClick={() => {
                      if (usersData?.data?.following.length !== 0) {
                        setFriendList("Following");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span style={{ color: "black", paddingRight: ".5rem" }}>
                      {" "}
                      {usersData?.data ? usersData?.data?.following.length : 0}
                    </span>{" "}
                    following
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.centerUpperImage}>
              <div className={styles.centerImageCover}>
                {usersRender?.background && <Image
                  src={usersRender?.background}
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


            {/* second card upper part desktop and tablets */}
            <div className={styles.secondCard_upper}>
              <div className={styles.name_icon} style={{
                marginBottom: userFetchData?.AboutData == null || userFetchData?.AboutData.education.length == 0 &&
                  userFetchData?.AboutData.experience.length == 0 ? "1rem" : "0rem"
              }}>
                <div className={styles.name}>
                  <p className={styles.nameP} id={styles.nameP}>
                    {session?.user.username}
                  </p>
                </div>

                <div className={styles.settingsIcon}>
                  <div className={styles.coverEditPencilDot}>
                    {(usersData?.userDataS?.designation === "" ||
                      usersData?.userDataS?.location === "") && (
                        <div className={styles.UnfinishedDot} />
                      )}
                    <MdModeEditOutline
                      className={styles.edit}
                      onClick={handleEdit}
                    />
                  </div>

                  <IoMdSettings
                    className={styles.settings}
                    onClick={() => Router.push(`/me/settings`)}
                  />
                </div>
              </div>
              <div
                className={styles.highlights_first_tablet}

              >
                {userFetchData?.AboutData != null &&
                  (userFetchData?.AboutData.education.length != 0 ||
                    userFetchData?.AboutData.experience.length != 0) &&(
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
                          {userFetchData.AboutData.experience[0].company}{" "}
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
                ) }
              </div>

              {/* add bio desktop */}
              <div className={styles.profile_bio}>
                <p className={styles.profileAbout} >Bio</p>
                {usersRender?.userBio ? (
                  <div style={{ width: "100%" }}>
                    <pre className={styles.user_bio}>{usersRender?.userBio}</pre>
                  </div>
                ) : (
                  <div className={styles.bio_button}>
                    <input type="button" value="Add a bio so people can learn more about you." onClick={handleEdit} />
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
                      {!usersData?.data?.praise.length
                        ? 0
                        : usersData?.data?.praise.length}
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
                  <div className={styles.tooltip}>
                    <div
                      className={styles.badgeCover1}
                      style={{ border: usersRender?.badges?.knowledge?.color !== "" ? `2px solid ${usersRender?.badges?.knowledge?.color}` : undefined }}

                    >
                      <div className={styles.badgeCover}>
                        {usersRender?.badges?.knowledge?.color == "" && (
                          <IoIosLock className={styles.badgeCoverIconLock} />
                        )}
                        <FaGraduationCap
                          className={styles.badgeCoverIcon}
                          style={{ color: usersRender?.badges?.knowledge?.color !== "" ? `${usersRender?.badges?.knowledge?.color}` : undefined }}

                        />
                      </div>
                    </div>
                    <p className={styles.tooltiptextBadge}>
                      <span>Knowledge Badge: </span>Earned when your posts are
                      marked as knowledgeable by other users.
                    </p>
                  </div>

                  <div className={styles.tooltip}>
                    <div
                      className={styles.badgeCover1}
                      style={{ border: usersRender?.badges?.judgment?.color != "" ? `2px solid ${usersRender?.badges?.judgment?.color}` : undefined }}
                    >
                      <div className={styles.badgeCover}>
                        {usersRender?.badges?.judgment?.color == "" && (
                          <IoIosLock className={styles.badgeCoverIconLock} />
                        )}
                        <HiLightBulb
                          className={styles.badgeCoverIcon}
                          style={{ color: usersRender?.badges?.judgment?.color !== "" ? `${usersRender?.badges?.judgment?.color}` : undefined }}
                        />
                      </div>
                    </div>
                    <p className={styles.tooltiptextBadge}>
                      <span>Sense of Judgment Badge: </span>Awarded when a user-liked
                      solution ranks in the top 3 during a competition.

                    </p>
                  </div>

                  <div className={styles.tooltip}>
                    <div
                      className={styles.badgeCover1}
                      style={{ border: usersRender?.badges?.admin?.color != "" ? `2px solid ${usersRender?.badges?.admin?.color}` : undefined }}
                    >
                      <div className={styles.badgeCover}>
                        {usersRender?.badges?.admin?.color == "" && (
                          <IoIosLock className={styles.badgeCoverIconLock} />
                        )}
                        <GiBilledCap
                          className={styles.badgeCoverIcon}
                          style={{ color: usersRender?.badges?.admin?.color !== "" ? `${usersRender?.badges?.admin?.color}` : undefined }}
                        />
                      </div>
                    </div>
                    <p className={styles.tooltiptextBadge}>
                      <span>Admin Badge: </span>Earned by reaching the required competition
                      level. Unlocks the ability to create learning and
                      freelancing groups.
                    </p>
                  </div>

                  <div className={styles.tooltip}>
                    <div
                      className={styles.badgeCover1}
                      style={{ border: usersRender?.badges?.leader?.color != "" ? `2px solid ${usersRender?.badges?.leader?.color}` : undefined, marginRight: "0rem" }}
                    >
                      <div className={styles.badgeCover}>
                        {usersRender?.badges?.leader?.color == "" && (
                          <IoIosLock className={styles.badgeCoverIconLock} />
                        )}
                        <FaCrown
                          className={styles.badgeCoverIcon}
                          style={{ color: usersRender?.badges?.leader?.color !== "" ? `${usersRender?.badges?.leader?.color}` : undefined }}
                        />
                      </div>
                    </div>
                    <p className={styles.tooltiptextBadge}>
                      <span>Leadership Badge: </span>Awarded to users who create
                      and effectively manage groups.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* third card upper part */}
            {/* <div className={styles.status_cover}> */}
            {/* <div className={styles.profile_info}>
                <div className={styles.prof_achivements}>
                  <div
                    className={styles.prof_achivements_cover}
                    onClick={goToUserAchievement}
                    style={{ cursor: "pointer" }}
                  >
                    <p className={styles.prof_achivementsP}>
                      {!userData ? <>0</> : userData?.achievements}
                    </p>
                    <p>Achievements</p>
                  </div>
                </div>
                <div className={styles.prof_achivements}>
                  <div className={styles.prof_achivements_cover}>
                    <p className={styles.prof_achivementsP}>
                      {!userData ? <>0</> : <>{userData.rank}</>}
                    </p>
                    <p> Rank</p>
                  </div>
                </div>
                <div className={styles.prof_achivements}>
                  <div className={styles.prof_achivements_cover}>
                    <p className={styles.prof_achivementsP}>
                      {!userData ? <>0</> : userData?.points}
                    </p>
                    <p> Score</p>
                  </div>
                </div>
              </div> */}

            {/* </div> */}
            {/* third card lower part */}

            <div className={styles.skill_main}>
              <div className={styles.skills}>
                <p>Skills</p>
                <div className={styles.skillsEditIcon} onClick={skillFunc}>
                  {usersData?.userDataS?.skills.length === 0 && (
                    <div className={styles.UnfinishedDot} />
                  )}

                  <MdModeEditOutline className={styles.skillsEdit} />
                </div>
              </div>
              {userData?.skills && userData.skills.length > 0 ? (
                userData.skills.map((val, index) => (
                  <pre
                    className={styles.usersSkills}
                    key={val._id || index} // Added a fallback key using `index` to avoid errors if `_id` is missing
                    style={{ color: "#08529B", }}
                  >
                    {val.skill}
                  </pre>
                ))
              ) : (
                <div className={styles.SkillsNotAvail} onClick={skillFunc}>
                  <p className={styles.SkillsNotPara} >Showcase your skills. Stand out.</p> <p className={styles.SkillsNotPara2} > Get noticed!</p>
                </div>
              )}

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
                    <tbody key={val._id}>
                      <tr>
                        <td style={{ color: "#08529B", textAlign: "left" }}>
                          {val.skill}
                        </td>
                        {val.points === 0 ? <td>0</td> : <td>{val.rank}</td>}
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
        {/* <div className={styles.story_cover}>
          <div className={styles.storie_middle}> */}

        {/* {'map lagega'} */}
        {/* <div className={styles.stories}>
              <div className={styles.stories_round}>
                {" "}
                <Image alt="award" priority src={post4}></Image>
              </div>
              <p className={styles.story1_name}>React JS</p>
            </div>
            <div className={styles.stories}>
              <div className={styles.stories_round}>
                {" "}
                <Image alt="award" priority src={post3}></Image>
              </div>
              <p className={styles.story1_name}>Meetings</p>
            </div>
            <div className={styles.stories}>
              <div className={styles.stories_round}>
                {" "}
                <Image alt="award" priority src={post2}></Image>
              </div>
              <p className={styles.story1_name}>Memories</p>
            </div> */}

        {/* {'map lagega'} */}

        {/* </div>
        </div> */}

        {/* tab section*/}
        <div className={styles.profile_tab}>
          <div className={styles.profileTabBig}>
            <div className={styles.tab_center}>
              {/* <FlipProvider> */}

              <input type="radio" name="tabs" id="tab1" ref={AchieveRef} />
              <label
                id={styles.labelMe}
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

              <input type="radio" name="tabs" defaultChecked id="tab2" />
              <label
                id={styles.labelMe}
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

              <input type="radio" name="tabs" id="tab3" />
              <label
                id={styles.labelMe}
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
                id={styles.labelMe}
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
                id={styles.labelMe}
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

              <input type="radio" name="tabs" id="tab6" />
              <label
                id={styles.labelMe}
                htmlFor="tab6"
                onClick={(e) => {
                  setToggleState("Collections");
                }}
                className={
                  toggleState === "Collections" ? styles["disable-bg-color"] : ""
                }
              >
                COLLECTIONS
              </label>

              <div className={styles.gliderME} />
              {/* </FlipProvider> */}
            </div>
          </div>
        </div>

        {/* gallery photo section  */}
        <div className={styles.acchieventes}>
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
                      <ProfileAchievements
                        key={value._id}
                        value={value.solution}
                      />
                    );
                  })
                ) : (
                  <>
                    <NoPostCover
                      NoPostIcons={GrAchievement}
                      NoPostMessage={"Collaborate on projects to showcase your achievements!"}
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
                        session={session}
                        mutateImageData={mutateImageData}
                      />
                    );
                  })
                ) : (
                  <>
                    {!isLoadingInitialData && (
                      <NoPostCover
                        NoPostIcons={BiSolidImage}
                        NoPostMessage={"Share your thoughts from the homepage!"}
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
            {toggleState === "Collections" && (
              <>
                {postColl?.PostCollections.length > 0 ? (
                  postColl?.PostCollections.map((value, index) => {
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
                      NoPostIcons={BsCollectionFill}
                      NoPostMessage={"No Collection Available Yet"}
                    />
                  </>
                )}
              </>
            )}
            {/* About section */}
            {toggleState === "About" && (
              <>
                <About
                  mutateuserFetchData={mutateuserFetchData}
                  userAbout={userFetchData?.AboutData}
                  userId={session?.user.id}
                />
              </>
            )}
            {toggleState === "projects" && (
              <>
                <ProjectsProfile
                  mutateuserFetchData={mutateuserFetchData}
                  userAbout={userFetchData?.AboutData}
                  userId={session?.user.id}
                />
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
                      NoPostMessage={"You haven't been mentioned yet."}
                    />
                  </>
                )}
              </>
            )}
            {/* map will be end */}
          </div>
        </div>
      </section>
    </>
  );
};
export async function getServerSideProps({ req }) {
  const secret = process.env.JWT_SECRET;
  const session = await getSession({ req });
  const userId = session?.user.id;
  const currentUserData = session?.user.username;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { id, username, isNewUser } = session?.user;
  if (isNewUser) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }
  try {
    await connectDb();
    let postColl = await Collection.findOne({ userId })
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

    const lenOfFollower = await UserFollow.findOne({ user: userId });
    const userData = await User.findOne({ username: currentUserData });

    /* handle achievments section */
    const achieve = await Achievement.find();
    const sort_achiev = achieve.filter((value) => value?.userId == userId);
    return {
      props: {
        session,
        postColl: JSON.parse(JSON.stringify(postColl)),
        usersRender: JSON.parse(JSON.stringify(userData)),
        lenOfFollower: JSON.parse(JSON.stringify(lenOfFollower)),
        achievementsFetch: JSON.parse(JSON.stringify(sort_achiev)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
}

export default Profile;
