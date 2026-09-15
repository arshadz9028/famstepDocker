import React, { useState, useContext, useEffect, useRef } from "react";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/Famstep.module.scss";
import loaderStyles from "../../styles/ImageLoading.module.scss";
import Image from "next/image";
import { getSession } from "next-auth/react";
import connectDb from "../../database/conn";
import Collection from "../../model/postCollection";
import Zoomphoto from "../../layouts/post/Zoomphoto";
import EditProfile from "../../layouts/EditProfile";
import { ContextProvider } from "../../global/context";
import ProfilePost from "../../components/ProfilePost";
import UserFollow from "../../model/followModel";
import User from "../../model/userModel";
import useSWR from "swr";
import axios from "axios";
import ConnectionsList from "../../layouts/ProfileModal/ConnectionsList";
import Achievement from "../../model/achievments";
import EditSkills from "../../layouts/ProfileModal/EditSkills";
import SkillsModal from "../../layouts/gettingStarted/SkillsModal";
import NoPostCover from "../../components/profileComp/NoPostCover";
import { BiSolidImage } from "react-icons/bi";
import { VscMention } from "react-icons/vsc";
import { FiAward } from "react-icons/fi";
import useSWRInfinite from "swr/infinite";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import AddImage from "../../layouts/post/PostImage";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/router";
import {
  useFollowerData,
  getPendingStatus,
  handleFollowRequest,
  handleCloseButton,
} from "../../utils/followerUtils";
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

const Famstep = ({ FollowerData,session, achievementsFetch, postColl, usersRender }) => {
  const router = useRouter()
  const {
    data: usersData,
    mutate: mutatefollowerData,
    error: followerError,
  } = useSWR("/api/profile/famstep", fetchUsers);
  const famstep = '67f7c821696aed22412e4b06'
  const userData = usersData?.userDataS;

  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateImageData,
  } = useSWRInfinite(
    (index) => `/api/home/imageFetch?profile=${famstep}&page=${index + 1}&limit=9`,
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

  const followusername = '67f7c821696aed22412e4b06';

  const follow =
  FollowerData?.following.length !== 0
    ? FollowerData?.following.map((foll) => foll.userid)
    : null;
      const { followerData, mutateFollowerData } = useFollowerData(followusername);
    
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
 const chatWithSelected = async () => {
    try {
      const res = await axios.post(`/api/message/chat`, { newSelected:famstep });
      await router.push(`/message/${res.data._id}`);

    } catch (error) {
      return <> Failed to load profile page. </>;
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [isLoadingMore, isReachingEnd]);
  const { model, skillModal, setSkillModal, createpost } = useContext(ContextProvider);
  const [toggleState, setToggleState] = useState("post");
  const [editDetail, setEditDetail] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [friendList, setFriendList] = useState("");
  const bottomRef = useRef(null);
  const radioRef = useRef(null);
  const AchieveRef = useRef(null);


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
    if (editDetail || friendList || editSkills || skillModal || model || createpost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [editDetail, friendList, editSkills, skillModal, model, createpost]);

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
          userdp={userData?.image}
          name={userData?.name}
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
          announcementLatest={usersData.announcement[0].announcement}
        />
      )}

      {model ? (
        <Zoomphoto
          dp={userData?.image}
          userName={userData?.username}
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
                    priority
                    src={userData?.image}
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
                    style={{ cursor: "pointer", marginRight: "5rem" }}
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
            {/* second card upper part desktop and tablets */}
            <div className={styles.secondCard_upper}>
              <div className={styles.name_icon} style={{ marginBottom: "1rem" }}>
                <div className={styles.name}>
                  <p className={styles.nameP} id={styles.nameP}>
                    {userData?.username}
                  </p>

                </div>

                <div className={styles.strangerMobCover} >
                  <div className={styles.strangerMob}>
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
                    <div
                      className={styles.follow_buttons}
                      onClick={chatWithSelected}

                    >
                      <button >
                        <p>Message</p>
                      </button>

                    </div>
                  </div>

                </div>
              </div>

              {/* add bio desktop */}
              <div className={styles.profile_bio}>
                <p className={styles.profileAbout} >Bio</p>
                {userData?.userBio && (
                  <div style={{ width: "100%" }}>
                    <pre className={styles.user_bio}>{userData?.userBio}</pre>
                  </div>
                )}

              </div>
            
            </div>

            {/* second card lower part */}
            <div className={styles.rank}>
              <div className={styles.rank_levelCover}>
                <div className={styles.skills}>
                  <p>Announcement</p>

                </div>
                <pre className={styles.announcementContent} >
                  {usersData?.announcement[0]?.announcement}
                </pre>
              </div>
            </div>
          </div>
        </div>

       
        {/* tab section*/}
        <div className={styles.profile_tab}>
          <div className={styles.profileTabBig}>
            <div className={styles.tab_center}>
              {/* <FlipProvider> */}

              <input type="radio" name="tabs" defaultChecked id="tab1" ref={AchieveRef}  />
              <label
                id={styles.labelProfile}
                htmlFor="tab1"
                onClick={(e) => {
                  setToggleState("post");
                }}
                className={
                  toggleState === "post" ? styles["disable-bg-color"] : ""
                }
              >
                POSTS
              </label>

              <input type="radio" name="tabs" id="tab2" ref={radioRef}/>

              <label
                id={styles.labelProfile}
                htmlFor="tab2"
                onClick={(e) => {
                  setToggleState("standouts");
                }}
                className={
                  toggleState === "standouts" ? styles["disable-bg-color"] : ""
                }
              >
                STANDOUTS
              </label>

              <input type="radio" name="tabs" id="tab3" />
              <label
                id={styles.labelProfile}
                htmlFor="tab3"
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
              {/* </FlipProvider> */}
            </div>
          </div>
        </div>

        {/* gallery photo section  */}
        <div className={styles.acchieventes}>
          <div
            className={
              toggleState === "standouts" || toggleState === "About"
                ? styles.acchieve_centerAbout
                : styles.acchieve_center
            }
          >

            {toggleState === "post" && (
              <>
                {postData?.data.length > 0 ? (
                  postData?.data.map((value, index) => {
                    return (
                      <ProfilePost
                        key={value?._id}
                        postData={value}
                        userId={userData?.id}
                        userName={userData?.username}
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
                        NoPostMessage={"Post"}
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

            {/* About section */}

            {toggleState === "standouts" && (
              <>
                <NoPostCover
                  NoPostIcons={FiAward}
                  NoPostMessage={"standouts"}
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
                        userId={userData?.id}
                        userName={userData?.username}
                      />
                    );
                  })
                ) : (
                  <>
                    <NoPostCover
                      NoPostIcons={VscMention}
                      NoPostMessage={"Mention"}
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
  const currentUserData = 'famstep';

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
      const currentUser = session?.user?.id;

  const followerData = await UserFollow.findOne({ user: currentUser });

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
              FollowerData: JSON.parse(JSON.stringify(followerData)),

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
export default Famstep;

