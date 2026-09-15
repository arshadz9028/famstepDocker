import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../styles/Navbar.module.scss";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import SearchModal from "./SearchModal";
import Notification from "./Notification";
import Meprof from "./Meprof";
import ide from "../assets/icons/ide.png";
import post1 from "../assets/icons/post.png";
import { ContextProvider } from "../global/context";
import { IoAddCircleSharp, IoAddCircleOutline } from "react-icons/io5";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
function Navbar({
  select,
  userData,
  session,
  setShowIcon,
  showIcon,
  searchData,
  mutatesearchData,
  showNetIcon,
  mutatefollowerData,
  showDot,
  setShowDot,
  followerData,
  mutateuserData,
  setshowNetIcon, contestId,
  projectData,
  projectUserData
}) {
  const {
    setSelectedImage,
    toggle,
    boxes,
    setBoxes,
    totalMessageNotify,
    CreateNotifyRef,
    RegisterNotifyRef,
    seteditPost,setOpenDetails
  } = useContext(ContextProvider);
  const router = useRouter()
  const searchRef = useRef(null);
  let meproficons = useRef(null);
  const notificationRef = useRef(null);

  const [svgtoggle, setSvgtoggle] = useState(select);
  const [meproficon, setMeproficon] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchinput, setSearchinput] = useState("");
  const addUserInputRef = useRef(null);
  const [nameList, setNameList] = useState();
  const [histnameList, setHistNameList] = useState(false);
  const [showError, setShowError] = useState("");
  const [notification, setNotification] = useState(false);

  // using ref for closing and opening notificaion, me and search model
  useEffect(() => {

    const checkprof = (e) => {
      if (meproficons.current && !meproficons.current.contains(e.target)) {
        setMeproficon(false);
      }
    };

    document.addEventListener("mousedown", checkprof, true);

    return () => {
      document.removeEventListener("mousedown", checkprof, true);
    };
  }, []);

  // checking search input length
  const CheckSearch = async (e) => {
    let value = e.target.value;

    try {
      if (!value && !searchData) {
        setSearch(true);
        setShowError("No recent searches.");
      } else if (!value) {
        // endpoint for history

        if (searchData.length > 0) {
          setSearch(true);
          setNameList(searchData);
          setHistNameList(true);
          setShowError("");
        }
      } else if (value.trim()) {
        setSearch(true);
        setHistNameList(false);
        const response = await axios.post("/api/auth/find/findSearch", {
          value,
        });

        setNameList(response.data.message);
        setShowError("");
      }
    } catch (error) {
      if (error) {
        setShowError("User not found.");
      }
    }
    mutate("/api/auth/find/checkHistory");
  };
  const handleHomeClick = async () => {
    try {
      if (showDot) {
        await axios.post("/api/notification/updateHome");
      }
      mutatefollowerData();
    } catch (error) {
      console.error(error);
    }
    setShowDot(false);
  };

  const handleNotificationClick = async () => {
    setNotification(!notification);

    if (followerData) {
      try {
        // Update notification for followerData
        await axios.post("/api/notification/updateNotification");
        mutatefollowerData();
      } catch (error) {
        console.error(error);
      }
    }
    if (userData) {
      try {
        // Update notification for userData
        await axios.put("/api/notification/updateNotification");
        mutateuserData();
      } catch (error) {
        console.error(error);
      }
    }
    if (userNotify?.isNotified) {
      try {
        // Update notification for contest
        await axios.post("/api/notification/contestNotification", { constId });
        mutateuserData();
      } catch (error) {
        console.error(error);
      }
    }
    setShowIcon(false);
  };
  const fContest = RegisterNotifyRef?.current[0];
  const constId = fContest?._id;
  const filteredContest = fContest?.contestState == "ongoing";
  const userNotify = fContest?.participants.find(
    (value) => value.user == session.user.id
  );
  /* This useEffect is controlling contest notifications */
  /* WILL BE CHANGE AND SHIFT TO ADMIN  */
  useEffect(() => {
    if (CreateNotifyRef?.current) {
      setShowIcon(session?.user?.contestNotification);
    }
  }, [CreateNotifyRef?.current]);

  useEffect(() => {
    if (filteredContest) {
      setShowIcon(userNotify?.isNotified);
    }
  }, [fContest]);
  useEffect(() => {
    if (followerData) {
      const followedUser = followerData?.data?.followRequests.map(
        (follow) => follow.notification
      );
      const groupUser = followerData?.data?.groupInvites.map(
        (group) => group.grpNotification
      );
      const followedNetUser = followerData?.data?.followRequests.map(
        (follow) => follow.NetNotification
      );
      setShowIcon(followedUser?.includes(true) || groupUser?.includes(true));
      setshowNetIcon(
        followedNetUser?.includes(true) || groupUser?.includes(true)
      );
    }
  }, [followerData]);
  const handleNetNotification = async () => {
    try {
      // Update notification for followerData
      await axios.post("/api/notification/updateNetNotification");
      mutatefollowerData();
    } catch (error) {
      console.error(error);
    }
    setshowNetIcon(false);
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (notification) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [notification]);

  return (
    <>
      {/* head title */}
      <Head>
        <title>{`${select} | Famstep`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {/* jsx for mobile navbar */}
      <section
        className={styles.mobile_navbar}
        style={toggle ? { display: "none" } : {}}
      >
        {/* notification section modified by Arshad */}
        {notification && (
          <Notification
          projectData={projectData}
        projectUserData={projectUserData}
            followusername={null}
            allRequests={null}
            userData={userData}
            session={session}
            setNotification={setNotification}
            CreateNotifyRef={CreateNotifyRef.current}
            RegisterNotifyRef={RegisterNotifyRef.current}
          />
        )}

        <div
          className={styles.uppar_nav}
          style={svgtoggle === "Message" || svgtoggle === "earnings" || svgtoggle === "Settings and Privacy" ? { display: "none" } : {}}
        >
          <div className={styles.content} style={{ width: search ? "100vw" : undefined }} >
            <section className={styles.logo_search}>
              {/* logo control */}
              {!search ? (
                <div
                  className={styles.logo_image}
                  style={{ cursor: "pointer" }}
                >
                  <Link href="/home">
                    <span>
                      <svg
                        viewBox="0 0 148 115"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="38"
                          y="5"
                          width="73"
                          height="25"
                          rx="5"
                          fill="#08529B"
                        />
                        <path
                          d="M57 0H92L107 4H42L57 0Z"
                          fill="#08529B"
                          fillOpacity="0.5"
                        />
                        <rect
                          y="90"
                          width="148"
                          height="25"
                          rx="5"
                          fill="#08529B"
                        />
                        <path
                          d="M19 82H129L144 89H4L19 82Z"
                          fill="#08529B"
                          fillOpacity="0.5"
                        />
                        <rect
                          x="19"
                          y="47"
                          width="110"
                          height="25"
                          rx="5"
                          fill="#08529B"
                        />
                        <path
                          d="M38.0398 39H111L126 46H23L38.0398 39Z"
                          fill="#08529B"
                          fillOpacity="0.5"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
              ) : (
                <div className={styles.searchBack}>
                  <IoIosArrowBack onClick={() => setSearch(false)} />
                </div>
              )}
              {/* search control */}
              <div ref={searchRef} className={styles.search}>
                <input
                  autoComplete="off"
                  type="text"
                  id={search ? styles.search_input : null}
                  value={searchinput}
                  onClick={CheckSearch}
                  onChange={(e) => {
                    setSearchinput(e.target.value);
                    CheckSearch(e);
                  }}
                  placeholder="Search"
                />
                {/* search icon */}
                {!search && (
                  <div className={styles.search_icon} onClick={CheckSearch}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={styles.search_svg}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                )}

                {/* search result */}
                {search && (
                  <SearchModal
                    showError={showError}
                    nameList={nameList}
                    histnameList={histnameList}
                    searchData={searchData}
                    mutatesearchData={mutatesearchData}
                    setNameList={setNameList}
                    setSearchinput={setSearchinput}
                    setSearch={setSearch}
                  />
                )}
              </div>
            </section>
            {/* navbar icons section  */}
            {!search && (
              <section className={styles.icons}>


                <div
                  className={styles.nav_icons}
                  onClick={handleNotificationClick}
                  ref={notificationRef}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={styles.home_svg}
                    style={
                      notification ? { fill: "#08529B", stroke: "white" } : {}
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                  {showIcon && <div className={styles.net_notification_dot} />}
                </div>

                {/* more option in profile */}
                <div className={styles.proficon_upper} ref={meproficons}>
                  {(userData?.data?.designation === "" ||
                    userData?.data?.location === "" ||
                    userData?.data?.skills.length === 0) && (
                      <div className={styles.UnfinishedDot} />)}
                  <div className={styles.circle_cover}>
                    <div
                      className={styles.me_circle}
                      style={
                        meproficon
                          ? { opacity: "1", visibility: "visible" }
                          : {}
                      }
                    ></div>

                    <div
                      className={styles.prof_icon}
                      onClick={() => {
                        setMeproficon(!meproficon);
                      }}
                    >
                      <Image
                        src={session?.user.image}
                        priority
                        quality={5}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: "cover"
                        }}
                        alt="famstep brand logo"
                      />
                    </div>
                  </div>
                  {/* Meprof modal */}
                  {meproficon && <Meprof userData={userData?.data} setMeproficon={setMeproficon} />}
                </div>
              </section>
            )}
          </div>
        </div>
        <div className={styles.lower_nav}>
          <div className={styles.lower_content}>
            {/* navbar icons section  */}
            <section className={styles.lower_nav_icons}>
              <Link href="/home">
                <span
                  className={styles.nav_icons}
                  onClick={() => {
                    setSvgtoggle("Home");
                    handleHomeClick();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className={styles.home_svg}
                    style={
                      svgtoggle === "Home"
                        ? { fill: "#08529B", stroke: "white" }
                        : {}
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>

                  {showDot && <div className={styles.net_notification_dot} />}
                </span>
              </Link>

              {/* <Link href="/explore">
                <span
                  className={styles.nav_icons}
                  onClick={() => {
                    setSvgtoggle("Explore");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={styles.home_svg}
                    style={
                      svgtoggle === "Explore"
                        ? {
                          fill: "#08529B",
                          strokeWidth: "0rem",
                          stroke: "white",
                        }
                        : {}
                    }
                  >
                    <path d="M12,10.9 C11.39,10.9 10.9,11.39 10.9,12 C10.9,12.61 11.39,13.1 12,13.1 C12.61,13.1 13.1,12.61 13.1,12 C13.1,11.39 12.61,10.9 12,10.9 Z M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M14.19,14.19 L6,18 L9.81,9.81 L18,6 L14.19,14.19 Z" />
                  </svg>
                </span>
              </Link> */}
              <Link href="/message">
                <div
                  className={styles.nav_icons}
                  onClick={() => {
                    setSvgtoggle("Message");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className={styles.home_svg}
                    style={
                      svgtoggle === "Message"
                        ? { fill: "#08529B", stroke: "white" }
                        : {}
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>

                  {totalMessageNotify?.length !== 0 && (
                    <div className={styles.message_dot}>
                      {totalMessageNotify?.length}
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="createPost" ref={addUserInputRef}>
                <div
                  className={styles.nav_icons}
                  onClick={() => {
                    setBoxes((boxes) => !boxes);
                  }}
                >
                  {!boxes ? (
                    <IoAddCircleOutline className={styles.home_svg_add} />
                  ) : (
                    <IoAddCircleSharp
                      className={styles.home_svg_add}
                      style={{
                        fill: "#08529B",
                        stroke: "none",
                        strokeWidth: "0px",
                      }}
                    />
                  )}
                </div>
                {boxes && (
                  <div className={styles.boxes} id="boxes">
                    <div className={styles.boxs_center}>
                      {/* <Link href="/create-post">
                        <div>
                          <Image src={ask} />
                        </div>
                      </Link> */}
                      <Link href="/collab">
                        <div className={styles.boxesIconsCover} onClick={() => { setOpenDetails(true) }}>
                          <div className={styles.boxesIcons}>
                            <Image
                              src={ide}
                              className={styles.boxesImage}
                              alt="famstepIcons"
                            />
                          </div>
                          <p className={styles.option_name}>Collab</p>
                        </div>
                      </Link>
                      <div className={styles.dividerVertical} />
                      <Link href="/create-post">
                        <div className={styles.boxesIconsCover} onClick={() => { setSelectedImage([]) }} >
                          <div
                            className={styles.boxesIcons}
                            style={{ height: "3rem" }}
                          >
                            <Image
                              src={post1}
                              className={styles.boxesImage}
                              alt="famstepIcons"
                            />
                          </div>
                          <p className={styles.option_name}>Post</p>
                        </div>
                      </Link>
                      {/* <Link href="/post">
                        <div>
                          <Image src={ad} />
                        </div>
                      </Link> */}
                    </div>
                  </div>
                )  }
              </div>

              {/* <span
                className={styles.nav_icons}
                onClick={() => {
                  setSvgtoggle("Scoreboard");
                  router.push(`/scoreboard?stage=${contestId}`);

                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={styles.home_svg}
                  style={
                    svgtoggle === "Scoreboard"
                      ? {
                        fill: "#08529B",
                        strokeWidth: ".1rem",
                        stroke: "#08529B",
                      }
                      : {}
                  }
                >
                  <path d="M3 12h4v9H3v-9zm14-4h4v13h-4V8zm-7-6h4v19h-4V2z" />
                </svg>
              </span> */}


              <Link href="/collab">
                <span
                  className={styles.nav_icons}
                  onClick={() => {
                    setSvgtoggle("Collabs");

                  }}
                >
                  {svgtoggle === "Collabs" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={styles.home_svg}
                      style={{
                        fill: "#08529B",
                        strokeWidth: "0rem",
                        stroke: "white",
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={styles.home_svg}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                  )}
                  {showNetIcon && (
                    <div className={styles.net_notification_dot1} />
                  )}
                </span>
              </Link>

              <Link href="/network">
                <span
                  className={styles.nav_icons}
                  onClick={() => {
                    setSvgtoggle("Network");
                    handleNetNotification();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className={styles.home_svg}
                    style={
                      svgtoggle === "Network"
                        ? { fill: "#08529B", stroke: "#08529B" }
                        : {}
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                  {showNetIcon && (
                    <div className={styles.net_notification_dot1} />
                  )}
                </span>
              </Link>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

export default Navbar;
