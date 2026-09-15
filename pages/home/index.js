import React, { useState, useContext, useEffect } from "react";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/Home.module.scss";
import loaderStyles from "../../styles/ImageLoading.module.scss";
import Image from "next/image";
import Createpost from "../../components/post/Createpost";
import ide from "../../assets/icons/ide.png";
import post1 from "../../assets/icons/post.png";
import Postcard from "../../components/post/Postcard";
import { getSession } from "next-auth/react";
import AddImage from "../../layouts/post/PostImage";
import { ContextProvider } from "../../global/context";
import connectDb from "../../database/conn";
import Post from "../../model/postModel";
import UserFollow from "../../model/followModel";
import User from "../../model/userModel";
import { DateFormatted } from "../../config/userPostTime";
import Zoomphoto from "../../layouts/post/Zoomphoto";
import { useRouter } from "next/router";
import axios from "axios";
import homeRightbar from "../../assets/newIcons/homeRightbar.jpg";
import { IoImage } from "react-icons/io5";
import NoCardsMessage from "../../components/network/NoCardsMessage";
import useSWRInfinite from "swr/infinite";
import { PiCodeBold } from "react-icons/pi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import HomeSide from "../../components/home/HomeSide";
import Footer from "../../layouts/PageFooter";
import frequests from "../../model/frequestModel";
import { IoAddCircleOutline } from "react-icons/io5";
import MobileZoomPhoto from "../../components/home/MobileZoomPhoto";
async function fetchPhoto(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

function Home({ session, lenOfFollower, userData, allUsers, userSuggested }) {
  const {
    model,
    setisGrpPost,
    setCreatepost,
    minimized,
    setMinimized,
    setGrpId,
    minimizeId,
    createpost,
  } = useContext(ContextProvider);
  const [postimage, setPostimage] = useState(false);
  const router = useRouter();

  //infinite scroll usind swr

  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateImageData,
  } = useSWRInfinite(
    (index) => `/api/home/imageGallery?page=${index + 1}&limit=5`,
    fetchPhoto,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  // Combine pages of data
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

  //infinite scroll end

  const handleMaximize = () => {
    setMinimized(false);

    if (minimizeId.ideCode) {
      router.push(`/ideCode/${minimizeId.ideCode}`);
    } else {
      router.push("/ide");
    }
  };

  const handleIde = async () => {
    setMinimized(false);
    router.push("/ide");
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (createpost || model) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [createpost, model]);

  // const CallMigration = async() =>{
  //   await axios.post("/api/migration")
  // }
  // useEffect(() => {
  //   CallMigration()

  // }, [])

  //click left side card to go profile
  const GoToProfile = () => {
    router.push(`/me`);
  };

  return (
    <>
      {/* {switchAccount && (
        <ComingSoonModel
          switchAccount={switchAccount}
          setSwitchAccount={setSwitchAccount}
        />
      )} */}

      <Navbar select={"Home"} session={session} />

      {createpost && (
        <AddImage
          userdp={session?.user.image}
          name={session?.user.name}
          ImageData={posts}
          session={session}
          mutateImageData={mutateImageData}
        />
      )}
      {/* {model && (
        <MobileZoomPhoto
          dp={props.dp}
          userName={props.userName}
          sessionUser={props.session}
          imageData={imageData}
          mutateImageData={props.mutateImageData}
          commentsData={commentsData}
          mutateComment={mutateComment}
          languageTag={Zoomphoto.languageTag}
          likes={props.likes}
          setMediaQueries={setMediaQueries}
        />
      )} */}
      {model && (
        <Zoomphoto
          allUsers={allUsers}
          dp={session?.user.image}
          userName={session?.user.username}
          session={session}
          // imageData={posts}
          mutateImageData={mutateImageData}
        />
      )}

      <section className="home_page">
        <div className={styles.homepage_center}>
          <div className={styles.home_grid}>
            {/*----- - - - - - left sidebar --- --- - ------*/}
            <div className={styles.left_sidebar}>
              {/* components */}
              <div className={styles.leftside_prof}>
                <div className={styles.two_images} onClick={GoToProfile} >
                  {/* <div className={styles.bg}>
                    <Image
                      src={userData?.background}
                      className={styles.topImage_background}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "cover",
                      }}
                      alt="user_background_image"
                    />
                  </div> */}

                  <div className={styles.dp}>
                    <Image
                      src={userData.image}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "cover",
                      }}
                      className={styles.profile_image}
                      alt="user_dp"
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

                    <p className={styles.title}>{userData.designation}</p>
                  </div>
                </div>


                <div className={styles.follow}>
                  <p>
                    <span style={{ color: "black" }}>
                      {lenOfFollower ? lenOfFollower?.followers.length : 0}{" "}
                    </span>
                    followers
                  </p>
                  <p>
                    <span style={{ color: "black" }}>
                      {" "}
                      {lenOfFollower ? lenOfFollower?.following.length : 0}
                    </span>{" "}
                    following
                  </p>
                </div>
              </div>
              {/* components */}
            </div>
            {/*----- - - - - - center post content--- --- - ------*/}

            <div className={styles.main_content}>
              {/*create a post components */}
              <div
                className={
                  `${styles.create_post_cotainer} ${styles.create_margin}`
                }
                // onMouseLeave={() => setPostimage(false)}
              >
                {/* <div className={styles.option_post}> */}
                  {/* <div
                    className={styles.dividerVertical}
                    style={{ opacity: postimage ? "1" : "0" }}
                  /> */}

                  {/* <Createpost
                    icons={ask}
                    title="Ask a question"
                    postimage={postimage}
                  /> */}
                  {/* <Createpost
                    icons={post1}
                    title="Create a post"
                    postimage={postimage}
                    onClick={() => {
                      setCreatepost(true);
                      setisGrpPost(false);
                      setGrpId("");
                    }}
                  />
                  <Createpost
                    onClick={handleIde}
                    icons={ide}
                    title="Online IDE"
                    postimage={postimage}
                  /> */}
                  {/* <Createpost
                    icons={ad}
                    title="Advertisement"
                    postimage={postimage}
                  /> */}
                {/* </div> */}
                {/* <div
                  className={styles.dividerBorder}
                  style={{ opacity: postimage ? "1" : "0" }}
                /> */}
                <div className={styles.flex_both}>
                  <div className={styles.circle_img}
                    onClick={() => {
                      setCreatepost(true);
                    }} >
                    <IoAddCircleOutline style={{ width: "100%", height: "100%" }} />
                  </div>
                  <input
                    readOnly
                    className={styles.post_input}
                    type="text"
                    name="createPost"
                    id="createPost"
                    value="Share your knowledge—create a post and inspire others!"
                    onClick={() => {
                      setCreatepost(true);
                    }}
                  />
                </div>
              </div>
              {/* winner card by hanzala */}
              {/* <Hanzala/> */}
              {/* <Winnerhome/> */}

              {posts?.length > 0 ? (
                posts?.map((value) => {
                  const date = new Date(value?.createdAt);
                  return (
                    <Postcard
                      mutateImageData={mutateImageData}
                      key={`post-card-${value?._id}`} // Add a unique key prop
                      value={value}
                      session={session}
                      time={DateFormatted(date)}
                      allUsers={allUsers}
                      lenOfFollower={lenOfFollower}
                    />
                  );
                })
              ) : (
                <>
                  {!isLoadingInitialData && (
                    <NoCardsMessage
                      MessageRectIcon={IoImage}
                      MessageContent={`Start following others to unlock inspiring posts, stories, and knowledge!`}
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

              {posts?.length !== 0 && isReachingEnd && (
                <div className={loaderStyles.ParaCover}>
                  <p className={loaderStyles.loaderCoverP}>
                    There are no more posts to display.
                  </p>
                </div>
              )}
            </div>

            {/*----- - - - - - right sidebar --- --- - ------*/}

            <div className={styles.right_sidebar}>
              <div className={styles.right_sidebarRequest}>
                {true ? (
                  <div className={styles.rightSideBarCover}>
                    <div className={styles.SuggestedSideBarCover}>
                      <p className={styles.suggestion}>Suggested for you</p>
                      <p
                        className={styles.suggestionExplore}
                        onClick={() => router.push(`/network/contacts`)}
                      >
                        Explore
                      </p>
                    </div>
                    {userSuggested.slice(0, 6).map((value) => (
                      <HomeSide
                        key={value._id} // Use a unique identifier from your data
                        session={session}
                        followusername={value._id}
                        userData={value}
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
                  <>
                    <Image
                      src={homeRightbar}
                      priority
                      alt="ads"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </>
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
    const userFollowing = reqAccepted?.following?.map((value) => value.userid) || [];
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

        if (userFreq?.followRequests.some(req => req.IsAccepted === false)) {
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
