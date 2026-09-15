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
import { MdModeEditOutline } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import useSWR from "swr";
import axios from "axios";
import ConnectionsList from "../../layouts/ProfileModal/ConnectionsList";
import ProjectsProfile from "../../layouts/ProjectsProfile";
import Achievement from "../../model/achievments";
import SkillsModal from "../../layouts/gettingStarted/SkillsModal";
import NoPostCover from "../../components/profileComp/NoPostCover";
import { BiSolidImage } from "react-icons/bi";
import { VscMention } from "react-icons/vsc";
import { BsCollectionFill } from "react-icons/bs";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import AddImage from "../../layouts/post/PostImage";
import Announcement from "../../layouts/ProfileModal/Announcement";
import Link from "next/link";

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

// Create a wrapper component to handle authorization
const AuthorizedFamstep = ({ session, achievementsFetch, postColl, usersRender }) => {
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id !== "67f7c821696aed22412e4b06") {
      router.push("/home");
    }
  }, [session, router]);

  if (session?.user?.id !== "67f7c821696aed22412e4b06") {
    return null;
  }

  return <FamstepContent
    session={session}
    achievementsFetch={achievementsFetch}
    postColl={postColl}
    usersRender={usersRender}
  />;
};

// Main component with all the hooks
const FamstepContent = ({ session, achievementsFetch, postColl, usersRender }) => {
  const router = useRouter();
  const { model, skillModal, setSkillModal, createpost } = useContext(ContextProvider);
  const [toggleState, setToggleState] = useState("post");
  const [editDetail, setEditDetail] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [friendList, setFriendList] = useState("");
  const bottomRef = useRef(null);
  const radioRef = useRef(null);
  const AchieveRef = useRef(null);

  const {
    data: usersData,
    mutate: mutatefollowerData,
    error: followerError,
  } = useSWR("/api/profile/famstep", fetchUsers);

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
      setSize(size + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [isLoadingMore, isReachingEnd]);

  const userData = usersData?.userDataS;

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
    if (
      editDetail ||
      friendList ||
      editSkills ||
      skillModal ||
      model ||
      createpost
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [editDetail, friendList, editSkills, skillModal, model, createpost]);
  const [announc, setAnnounc] = useState();

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
          userdp={session?.user.image}
          name={session?.user.name}
          ImageData={posts}
          session={session}
          mutateImageData={mutateImageData}
        />
      )}

      {editSkills && (
        <Announcement
          userData={userData}
          usersData={usersData}
          session={session}
          setEditSkills={setEditSkills}
          editSkills={editSkills}
          mutatefollowerData={mutatefollowerData}
          announce={usersData.announcement[0]}
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
                    priority
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
                        <RiVerifiedBadgeFill
                          className={styles.blue_tick1}
                          style={{
                            color: `${usersRender?.verifiedTick.color}`,
                          }}
                        />
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
              <div className={styles.name_icon} style={{ marginBottom: "1rem" }}>
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
                    onClick={() => {
                      router.push(`/me/settings`);
                    }}
                  />
                </div>
              </div>

              {/* add bio desktop */}
              <div className={styles.profile_bio}>
                <p className={styles.profileAbout} >Bio</p>
                {usersRender?.userBio ? (
                  <pre className={styles.user_bio}>{usersRender.userBio}</pre>
                ) : (
                  <div className={styles.bio_button}>
                    <input type="button" value="Add Bio" onClick={handleEdit} />
                  </div>
                )}
              </div>
            </div>

            {/* second card lower part */}
            <div className={styles.rank}>
              <div className={styles.rank_levelCover}>
                <div className={styles.skills}>
                  <p>Announcement</p>
                  <div className={styles.skillsEditIcon} onClick={skillFunc}>
                    <MdModeEditOutline className={styles.skillsEdit} />
                  </div>
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

              <input type="radio" name="tabs" id="tab1" defaultChecked ref={AchieveRef} />
              <label
                id={styles.labelMe}
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

              <input type="radio" name="tabs" id="tab2" ref={radioRef} />

              <label
                id={styles.labelMe}
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
                id={styles.labelMe}
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

              <input type="radio" name="tabs" id="tab4" />

              <label
                id={styles.labelMe}
                htmlFor="tab4"
                onClick={(e) => {
                  setToggleState("Collections");
                }}
                className={
                  toggleState === "Collections"
                    ? styles["disable-bg-color"]
                    : ""
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
                      NoPostMessage={"Collection"}
                    />
                  </>
                )}
              </>
            )}

            {toggleState === "standouts" && (
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

// Export the authorized wrapper component
export default function Famstep(props) {
  return <AuthorizedFamstep {...props} />;
}

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
