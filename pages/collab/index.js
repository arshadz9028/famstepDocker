import React, { useState, useContext, useEffect, useRef } from "react";
import Navbar from "../../layouts/Navbar";
import styles from "./gigs.module.scss";
import loaderStyles from "../../styles/ImageLoading.module.scss";
import Image from "next/image";
import { getSession } from "next-auth/react";
import CollabPost from "../../components/Collab/CollabPost";
import { ContextProvider } from "../../global/context";
import connectDb from "../../database/conn";
import Post from "../../model/postModel";
import UserFollow from "../../model/followModel";
import User from "../../model/userModel";
import { DateFormatted } from "../../config/userPostTime";
import { useRouter } from "next/router";
import { PiCodeBold } from "react-icons/pi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import HomeSide from "../../components/home/HomeSide";
import Footer from "../../layouts/PageFooter";
import frequests from "../../model/frequestModel";
import CollabCard from "../../components/Collab/CollabCard";
import useSWR from "swr";
import AcceptCollab from "../../components/Collab/AcceptCollab";
import ViewProposal from "../../components/Collab/ViewProposal";
import { FcCollaboration } from "react-icons/fc";
import { GiShakingHands } from "react-icons/gi";
import { fetchCollabs } from "../../utils/mutate";
import SubmitProposal from "../../components/Collab/SubmitProposal";
import { GiBullseye } from "react-icons/gi";
import DraggableButton from "../../components/common/DraggableButton";

// Add this default position outside the component
const DEFAULT_POSITION = { x: 20, y: 500 }; // fallback y position of 500px

function Home({ session, lenOfFollower, userData, allUsers, userSuggested }) {
  const {
    setisGrpPost,
    setCreatepost,
    minimized,
    setMinimized,
    setGrpId,
    minimizeId,
    createpost,
    collabID, openDetails, setOpenDetails, isEditCollab, setIsEditCollab
  } = useContext(ContextProvider);
  const router = useRouter();
  const [viewProp, setViewProp] = useState(false);
  const [PropData, setPropData] = useState([]);
  const [subRequest, setSubRequest] = useState(false);
  const [selectCollabData, setselectCollabData] = useState();
  const {
    data: posts,
    mutate: mutateImageData,
    error: fetchDataError,
  } = fetchCollabs();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(DEFAULT_POSITION);

  const usersReq = posts?.data
    .filter((val) => val?.userid?._id === session.user.id) // Filter by user ID
    .flatMap((post) => post.collabRequests); // Flatten collabRequests from all matching posts into one array
  console.log("usersReq", usersReq);
  const filteredCollabs = posts?.data.filter(
    (value) => value._id === collabID
  )[0];

  const handleMaximize = () => {
    setMinimized(false);

    if (minimizeId.ideCode) {
      router.push(`/ideCode/${minimizeId.ideCode}`);
    } else {
      router.push("/ide");
    }
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (createpost || openDetails || subRequest) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [createpost, openDetails, subRequest]);

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(prevState => !prevState);
  };

  // Set the actual position after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setButtonPosition({ x: 20, y: window.innerHeight - 150 });
    }
  }, []);

  return (
    <>
      <Navbar select={"Collabs"} session={session} />
      {viewProp && (
        <ViewProposal setViewProp={setViewProp} PropData={PropData} />
      )}
      {subRequest && (
        <SubmitProposal
          setSubRequest={setSubRequest}
          ImageData={selectCollabData}
          isEditCollab={isEditCollab}
          mutateImageData={mutateImageData}
          setIsEditCollab={setIsEditCollab}

        />
      )}
      {openDetails && (
        <CollabPost
          userdp={session?.user.image}
          name={session?.user.name}
          ImageData={filteredCollabs}
          session={session}
          mutateImageData={mutateImageData}
          setOpenDetails={setOpenDetails}
          collabID={collabID}
          isEditCollab={isEditCollab}
          setIsEditCollab={setIsEditCollab}
        />
      )}

      <section className="home_page">
        <div className={styles.homepage_center}>
          <div className={styles.home_grid}>
            
            <div className={styles.main_content}>
              {/*create a post components */}
              <div className={`${styles.create_post_cotainer}`}>
                <div className={styles.flex_both}>
                  <div className={styles.circle_img}>
                    <Image
                      src={session?.user.image}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "cover",
                      }}
                      alt="creat_post_user_image"
                    />
                  </div>
                  <input
                    readOnly
                    className={styles.post_input}
                    type="text"
                    name="createPost"
                    id="createPost"
                    value="Post Your Project Details for Collaboration"
                    onClick={() => {
                      setOpenDetails(true);
                      setIsEditCollab(false);
                      setisGrpPost(false);
                      setGrpId("");
                    }}
                  />
                </div>
              </div>

              {posts?.data
                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((value) => {
                  const date = new Date(value?.createdAt);
                  return (
                    <CollabCard
                      setselectCollabData={setselectCollabData}
                      subRequest={subRequest}
                      setSubRequest={setSubRequest}
                      mutateImageData={mutateImageData}
                      key={`post-card-${value?._id}`} // Add a unique key prop
                      value={value}
                      session={session}
                      time={DateFormatted(date)}
                      allUsers={allUsers}
                      lenOfFollower={lenOfFollower}
                      setOpenDetails={setOpenDetails}
                      openDetails={openDetails}
                      isEditCollab={isEditCollab}
                      setIsEditCollab={setIsEditCollab}
                    />
                  );
                })}
            </div>

            {/*----- - - - - - right sidebar --- --- - ------*/}

            <div className={styles.right_sidebar}>
              <div className={styles.right_sidebarRequest}>
                {usersReq?.length > 0 ? (
                  <div className={styles.rightSideBarCover}>
                    <div className={styles.SuggestedSideBarCover}>
                      <p className={styles.suggestion}>Proposal Requests</p>
                      {/* <p
                        className={styles.suggestionExplore}
                        onClick={() => router.push(`/network/contacts`)}
                      >
                        Explore
                      </p> */}
                    </div>
                    {usersReq?.map((value) => (
                      <AcceptCollab
                        setPropData={setPropData}
                        collabID={value._id}
                        key={value._id} // Use a unique identifier from your data
                        session={session}
                        followusername={value._id}
                        userData={value}
                        setViewProp={setViewProp}
                        setShowMobileSidebar={setShowMobileSidebar}
                        follow={
                          lenOfFollower?.following.length !== 0
                            ? lenOfFollower?.following.map(
                              (foll) => foll.userid
                            )
                            : null
                        }
                        myFollower={
                          lenOfFollower?.followers.length !== 0
                            ? lenOfFollower?.followers.map(
                              (foll) => foll.userid
                            )
                            : null
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.rightSideBarCover}>
                    <div className={styles.NoproposalCover}>
                      <div className={styles.NoproposalCircle}>
                        <GiShakingHands
                          className={styles.rightSideNoproposal}
                        />
                      </div>
                      <p className={styles.NoproposalContent}>
                        No collaboration notifications available at the moment.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Footer />
            </div>
            {minimized && (
              <div className={styles.maximize_code} onClick={handleMaximize}>
                <PiCodeBold className={styles.maximize_codeIcon} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Replace the mobile sidebar toggle button with the DraggableButton component */}
      {!showMobileSidebar && (
        <DraggableButton
          onClick={toggleMobileSidebar}
          initialPosition={buttonPosition}
          size={60}
          buttonStyles={{ backgroundColor: "#ff4500"}}
        >
          <GiBullseye size={32} />
        </DraggableButton>
      )}

      {/* Mobile sidebar backdrop */}
      {showMobileSidebar && (
        <div
          onClick={toggleMobileSidebar}
          className={styles.mobileSidebarBackdrop}
        ></div>
      )}

      {/* Mobile sidebar */}
      {showMobileSidebar && (
        <div className={styles.mobileSidebar}>
          <div className={styles.mobileSidebarHeader}>
            <h3>Proposal Requests</h3>
            <button
              onClick={toggleMobileSidebar}
              className={styles.mobileSidebarCloseBtn}
            >
              ✖
            </button>
          </div>
          <div className={styles.mobileSidebarContent}>
            {usersReq?.length > 0 ? (
              <div className={styles.rightSideBarCoverMob}>
               
                {usersReq?.map((value) => (
                  <AcceptCollab
                    setPropData={setPropData}
                    collabID={value._id}
                    key={value._id}
                    session={session}
                    followusername={value._id}
                    userData={value}
                    setViewProp={setViewProp}
                    setShowMobileSidebar={setShowMobileSidebar}
                    follow={
                      lenOfFollower?.following.length !== 0
                        ? lenOfFollower?.following.map(
                          (foll) => foll.userid
                        )
                        : null
                    }
                    myFollower={
                      lenOfFollower?.followers.length !== 0
                        ? lenOfFollower?.followers.map(
                          (foll) => foll.userid
                        )
                        : null
                    }
                  />
                ))}
              </div>
            ) : (
              <div className={styles.rightSideBarCoverMob}>
                <div className={styles.NoproposalCover}>
                  <div className={styles.NoproposalCircle}>
                    <GiShakingHands
                      className={styles.rightSideNoproposal}
                    />
                  </div>
                  <p className={styles.NoproposalContent}>
                    No collaboration notifications available at the moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const session = await getSession({ req });
  const { userPostId } = query;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const { id, username, isNewUser } = session.user;
    if (isNewUser) {
      return {
        redirect: {
          destination: "/getting-started",
          permanent: false,
        },
      };
    }

    await connectDb();
    const userId = session.user.id;
    const userName = session.user.username;

    const reqAccepted = await UserFollow.findOne({ user: userId });
    const userFollowing =
      reqAccepted?.following?.map((value) => value.userid) || [];
    const followIds = await User.find({ _id: { $in: userFollowing } });

    const ImageData = await Post.findOne({ _id: userPostId });
    const sessionUser = await User.findById(userId);

    const userDataFetched = await User.find({
      $and: [
        { username: { $ne: userName } },
        { _id: { $nin: followIds.map((fflw) => fflw._id) } },
      ],
    }).lean();

    const userSuggested = await Promise.all(
      userDataFetched.map(async (user) => {
        const userFreq = await frequests.findOne({ user: user._id });

        if (userFreq?.followRequests.some((req) => req.IsAccepted === false)) {
          return null;
        }

        const sessionLocation = sessionUser?.location || "";
        const sessionLocationParts = sessionLocation.split(/[ ,]+/);
        const locationRegex = new RegExp(sessionLocationParts.join("|"), "i");

        return locationRegex.test(user.location) ? user : null;
      })
    );

    // Filter out null values from the result
    const filteredUserSuggested = userSuggested.filter(Boolean);

    const lenOfFollower = await UserFollow.findOne({ user: id });
    const userData = await User.findOne({ username: username });
    const allUsers = await User.find({ username: { $ne: username } });

    return {
      props: {
        session,
        allUsers: JSON.parse(JSON.stringify(allUsers)),
        ImageData: JSON.parse(JSON.stringify(ImageData)),
        userData: JSON.parse(JSON.stringify(userData)),
        userSuggested: JSON.parse(JSON.stringify(filteredUserSuggested)),
        lenOfFollower: JSON.parse(JSON.stringify(lenOfFollower)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
}

export default Home;
