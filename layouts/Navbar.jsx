import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../styles/Navbar.module.scss";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import SearchModal from "./SearchModal";
import Notification from "./Notification";
import Meprof from "./Meprof";
import Navbars from "./MobNav";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { ContextProvider } from "../global/context";
import ComingSoonModel from "../components/ComingSoonModel";
import { MdWorkOutline } from "react-icons/md";
import {
  fetchProjects,
  searchFetchData,
  userFetchData,
  userFollowData, fetchUserProject
} from "../swrUtils/navbarSWR";
function Navbar({ select, session, border }) {
  const {
    data: searchData,
    mutate: mutatesearchData,
    error: fsearchError,
  } = searchFetchData();

  const {
    data: userData,
    mutate: mutateuserData,
    error: userError,
  } = userFetchData();

  const {
    data: followerData,
    mutate: mutatefollowerData,
    error: followerError,
  } = userFollowData();
  const {
    data: projectData,
    mutate: mutateprojectData,
    error: projectDataError,
  } = fetchProjects();
  const {
    data: projectUserData,
    mutate: mutateUserprojectData,
    error: projectUserDataError,
  } = fetchUserProject();

  const isNotify = projectData?.data.flatMap(
    (post) => post.collabRequests?.map((request) => request.notification) || []
  );
  const isUserNotify = projectUserData?.data.flatMap(
    (post) => post.collabRequests?.map((request) => request.userCollab) || []
  );

  const sortedSearch = searchData?.message.sort(
    (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
  );
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  let meproficons = useRef(null);
  const router = useRouter();

  const [svgtoggle, setSvgtoggle] = useState(select);
  const [notification, setNotification] = useState(false);
  const [meproficon, setMeproficon] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchinput, setSearchinput] = useState("");
  const [nameList, setNameList] = useState();
  const [histnameList, setHistNameList] = useState(false);
  const [showError, setShowError] = useState("");
  const [mobNotification, setmobNotification] = useState(false);
  const {
    socket,
    totalMessageNotify,
    CreateNotifyRef,
    RegisterNotifyRef,
    showIcon,
    setShowIcon,
    switchAccount,
    countLikeDot,
    setCountLikeDot,
  } = useContext(ContextProvider);

  // using ref for closing and opening notificaion, me and search model
  useEffect(() => {
    const notificationcheck = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotification(false);
      }
    };

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearch(false);
      }
    };

    const checkprof = (e) => {
      if (meproficons.current && !meproficons.current.contains(e.target)) {
        setMeproficon(false);
      }
    };

    document.addEventListener("mousedown", checkprof, true);
    document.addEventListener("mousedown", notificationcheck, true);
    document.addEventListener("mousedown", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", checkprof, true);
      document.removeEventListener("mousedown", notificationcheck, true);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  // These states are used for notification
  // const [showIcon, setShowIcon] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [showCollabDot, setShowCollabDot] = useState(false);
  const [showNetIcon, setshowNetIcon] = useState(false);
  /* fetch users and followers data for handling notification */

  /* *******************  Scoreboard handling  ************************* */
  async function fetchLevel(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  const {
    data: codeData,
    mutate: mutatecodeData,
    error: UserDataError,
  } = useSWR(`/api/code/codeLevel`, fetchLevel);
  /* this is to control follow-req notification */
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
      // Check if any notification is true in either array
      const hasNotification = followedUser?.includes(true) || groupUser?.includes(true);
      setShowIcon(hasNotification);
      setshowNetIcon(
        followedNetUser?.includes(true) || groupUser?.includes(true)
      );
    }
  }, [followerData]);

  const fContest = RegisterNotifyRef?.current[0];
  const constId = fContest?._id;
  const filteredContest = fContest?.contestState == "ongoing";
  const userNotify = fContest?.participants.find(
    (value) => value.user == session.user.id
  );

  //   useEffect(() => {
  //     if (CreateNotifyRef.current) {
  //       setShowIcon(session?.user?.contestNotification);
  //     }
  //   }, [CreateNotifyRef.current]);

  //   useEffect(() => {
  //     if (filteredContest) {
  //       setShowIcon(userNotify?.isNotified);
  //     }
  //   }, [fContest]);

  //   collab notification handle
  useEffect(() => {
    if (projectData?.data) {
      // Check if isNotify array exists and has any true values
      const hasNotification = isNotify?.some(value => value === true);
      if (hasNotification) {
        setShowIcon(true);
      }
    }
    if (projectUserData?.data) {
      // Check if isUserNotify array exists and has any true values
      const hasUserNotification = isUserNotify?.some(value => value === true);
      if (hasUserNotification) {
        setShowIcon(true);
      }
    }
  }, [projectData?.data, projectUserData?.data]);

  /* this is to control home notification */
  useEffect(() => {
    // Load showDot value from local storage on page load
    const storedShowDot = localStorage.getItem("showDot") === "true";
    setShowDot(storedShowDot);

    if (followerData) {
      const postUser = followerData?.dats?.following.map(
        (follow) => follow.postNotification
      );
      setShowDot(postUser?.includes(true));
    }

    if (userData) {
      setShowCollabDot(userData.data.collabNotification);
    }
  }, [followerData, userData]);

  const handleDotCollab = async () => {
    try {
      await axios.put(`/api/collab/collabNotifyDot`);
      mutateuserData();
    } catch (error) {
      console.error(error);
    }
  };

  //search function
  const CheckSearch = async (e) => {
    let value = e.target.value;

    try {
      if (!value && !searchData) {
        // setNameList();
        setSearch(true);
        setShowError("No recent searches.");
      } else if (!value) {
        // endpoint for history

        if (sortedSearch.length > 0) {
          setSearch(true);
          setNameList(sortedSearch);
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
  /* ********notification******* */
  const allRequests = [
    ...(followerData?.data?.followRequests || []),
    ...(followerData?.data?.groupInvites || []),
  ];
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
    if (isNotify) {
      try {
        await axios.post("/api/collab/notificationCollab");
        mutateprojectData();
      } catch (error) {
        console.error(error);
      }
    }
    setShowIcon(false);
  };

  /* ****************Home Notification*************** */
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
  /* Network notification */
  const handleNetNotification = async () => {
    if (showNetIcon) {
      try {
        // Update notification for followerData
        await axios.post("/api/notification/updateNetNotification");
        mutatefollowerData();
      } catch (error) {
        console.error(error);
      }
      setshowNetIcon(false);
    }
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (switchAccount) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [switchAccount]);
  return (
    <>
      {/* head title */}
      <Head>
        <title>{`${select ? select : "collab"} | Famstep`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {switchAccount && <ComingSoonModel />}
      <Navbars

        projectData={projectData}
        projectUserData={projectUserData}
        select={select}
        allRequests={allRequests}
        userData={userData}
        session={session}
        showIcon={showIcon}
        showNetIcon={showNetIcon}
        showDot={showDot}
        setShowDot={setShowDot}
        mutatefollowerData={mutatefollowerData}
        searchData={sortedSearch}
        mutatesearchData={mutatesearchData}
        notification={notification}
        setNotification={setNotification}
        followerData={followerData}
        mutateuserData={mutateuserData}
        userNotify={userNotify}
        setShowIcon={setShowIcon}
        setshowNetIcon={setshowNetIcon}
        contestId={codeData?.subData?._id}
      />

      {/* navbar */}
      <section className={styles.navbar} style={{ borderBottom: border === "bottom" ? "1px solid #cccccc" : undefined }}>
        {/* navbar center */}
        <div className={styles.navbar_section}>
          {/* logo and search input */}
          <section className={styles.logo_search}>
            {/* logo control */}
            <div className={styles.logo_image} style={{ cursor: "pointer" }}>
              <Link href="/home">
                <span>
                  <svg
                    viewBox="0 0 718 211"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.logo_svg}
                  >
                    <rect
                      x="508.692"
                      y="75.3672"
                      width="61.5316"
                      height="21.5466"
                      rx="5"
                      fill="#08529B"
                    />
                    <path
                      d="M524.707 69.334H554.209L566.852 74.5052H512.064L524.707 69.334Z"
                      fill="#08529B"
                      fillOpacity="0.5"
                    />
                    <rect
                      x="476.662"
                      y="148.626"
                      width="124.749"
                      height="21.5466"
                      rx="5"
                      fill="#08529B"
                    />
                    <path
                      d="M492.677 141.731H585.396L598.04 147.764H480.034L492.677 141.731Z"
                      fill="#08529B"
                      fillOpacity="0.5"
                    />
                    <rect
                      x="492.678"
                      y="111.564"
                      width="92.7189"
                      height="21.5466"
                      rx="5"
                      fill="#08529B"
                    />
                    <path
                      d="M508.726 104.67H570.224L582.868 110.703H496.049L508.726 104.67Z"
                      fill="#08529B"
                      fillOpacity="0.5"
                    />
                    <path
                      d="M64.6714 51.9498C60.7047 51.9498 57.8464 52.8831 56.0964 54.7498C54.3464 56.6165 53.4714 59.7665 53.4714 64.1998V71.3748H75.3464L72.3714 90.6248H53.4714V164.3H25.8214V90.6248H11.8214V71.3748H25.8214V63.1498C25.8214 53.8165 28.8547 46.2331 34.9214 40.3998C41.1047 34.4498 49.9131 31.4748 61.3464 31.4748C70.5631 31.4748 79.0214 33.4581 86.7214 37.4248L79.1964 55.4498C74.5297 53.1165 69.6881 51.9498 64.6714 51.9498ZM154.102 137.35C154.102 140.85 154.569 143.416 155.502 145.05C156.552 146.683 158.185 147.908 160.402 148.725L154.627 166.75C148.91 166.283 144.244 165.058 140.627 163.075C137.01 160.975 134.21 157.708 132.227 153.275C126.16 162.608 116.827 167.275 104.227 167.275C95.0102 167.275 87.6602 164.591 82.1769 159.225C76.6935 153.858 73.9519 146.858 73.9519 138.225C73.9519 128.075 77.6852 120.316 85.1519 114.95C92.6185 109.583 103.41 106.9 117.527 106.9H126.977V102.875C126.977 97.3915 125.81 93.6581 123.477 91.6748C121.144 89.5748 117.06 88.5248 111.227 88.5248C108.194 88.5248 104.519 88.9915 100.202 89.9248C95.8852 90.7415 91.4519 91.9081 86.9019 93.4248L80.6019 75.2248C86.4352 73.0081 92.3852 71.3165 98.4519 70.1498C104.635 68.9831 110.352 68.3998 115.602 68.3998C128.902 68.3998 138.644 71.1415 144.827 76.6248C151.01 82.1081 154.102 90.3331 154.102 101.3V137.35ZM112.277 147.5C118.577 147.5 123.477 144.525 126.977 138.575V122.125H120.152C113.852 122.125 109.127 123.233 105.977 125.45C102.944 127.666 101.427 131.108 101.427 135.775C101.427 139.508 102.36 142.425 104.227 144.525C106.21 146.508 108.894 147.5 112.277 147.5ZM278.851 68.3998C286.201 68.3998 292.093 70.9081 296.526 75.9248C300.959 80.8248 303.176 87.6498 303.176 96.3998V164.3H275.526V101.125C275.526 92.8415 272.901 88.6998 267.651 88.6998C264.734 88.6998 262.168 89.6915 259.951 91.6748C257.734 93.6581 255.576 96.6915 253.476 100.775V164.3H225.826V101.125C225.826 92.8415 223.201 88.6998 217.951 88.6998C215.151 88.6998 212.584 89.7498 210.251 91.8498C208.034 93.8331 205.876 96.8081 203.776 100.775V164.3H176.126V71.3748H200.276L202.201 82.2248C205.818 77.5581 209.784 74.1165 214.101 71.8998C218.534 69.5665 223.551 68.3998 229.151 68.3998C234.401 68.3998 238.893 69.6831 242.626 72.2498C246.476 74.8165 249.276 78.4331 251.026 83.0998C254.759 78.0831 258.843 74.4081 263.276 72.0748C267.826 69.6248 273.018 68.3998 278.851 68.3998ZM356.678 68.3998C363.328 68.3998 369.57 69.3915 375.403 71.3748C381.236 73.3581 386.37 76.1581 390.803 79.7748L380.653 95.3498C373.07 90.5665 365.428 88.1748 357.728 88.1748C354.111 88.1748 351.311 88.8165 349.328 90.0998C347.461 91.2665 346.528 92.9581 346.528 95.1748C346.528 96.9248 346.936 98.3831 347.753 99.5498C348.686 100.6 350.495 101.708 353.178 102.875C355.861 104.041 360.003 105.441 365.603 107.075C375.286 109.875 382.461 113.55 387.128 118.1C391.911 122.533 394.303 128.716 394.303 136.65C394.303 142.95 392.495 148.433 388.878 153.1C385.261 157.65 380.303 161.15 374.003 163.6C367.703 166.05 360.703 167.275 353.003 167.275C345.186 167.275 337.895 166.05 331.128 163.6C324.478 161.15 318.82 157.766 314.153 153.45L327.628 138.4C335.445 144.466 343.67 147.5 352.303 147.5C356.503 147.5 359.77 146.741 362.103 145.225C364.553 143.708 365.778 141.55 365.778 138.75C365.778 136.533 365.311 134.783 364.378 133.5C363.445 132.216 361.636 131.05 358.953 130C356.27 128.833 352.011 127.433 346.178 125.8C336.961 123.116 330.078 119.383 325.528 114.6C320.978 109.816 318.703 103.866 318.703 96.7498C318.703 91.3831 320.22 86.5998 323.253 82.3998C326.403 78.0831 330.836 74.6998 336.553 72.2498C342.386 69.6831 349.095 68.3998 356.678 68.3998ZM466.823 159.925C463.439 162.258 459.473 164.066 454.923 165.35C450.489 166.633 446.056 167.275 441.623 167.275C421.323 167.158 411.173 155.958 411.173 133.675V90.6248H398.048V71.3748H411.173V51.2498L438.823 48.0998V71.3748H460.173L457.198 90.6248H438.823V133.325C438.823 137.641 439.523 140.733 440.923 142.6C442.323 144.466 444.539 145.4 447.573 145.4C450.723 145.4 454.048 144.408 457.548 142.425L466.823 159.925Z"
                      fill="#08529B"
                    />
                    <path
                      d="M665.011 72.1547C676.678 72.1547 685.369 76.4713 691.086 85.1047C696.803 93.738 699.661 105.813 699.661 121.33C699.661 130.896 698.144 139.471 695.111 147.055C692.194 154.521 687.936 160.413 682.336 164.73C676.736 168.93 670.203 171.03 662.736 171.03C653.403 171.03 645.878 167.821 640.161 161.405V203.93L612.511 206.905V75.1297H636.836L638.236 85.4547C641.853 80.9047 645.994 77.5797 650.661 75.4797C655.328 73.263 660.111 72.1547 665.011 72.1547ZM654.336 150.73C665.419 150.73 670.961 141.046 670.961 121.68C670.961 110.713 669.736 103.13 667.286 98.9297C664.836 94.613 661.161 92.4547 656.261 92.4547C653.111 92.4547 650.136 93.388 647.336 95.2547C644.653 97.1213 642.261 99.8047 640.161 103.305V142.505C643.894 147.988 648.619 150.73 654.336 150.73Z"
                      fill="#08529B"
                    />
                  </svg>
                </span>
              </Link>
            </div>

            {/* search control */}
            <div ref={searchRef} className={styles.search}>
              <input
                type="text"
                autoComplete="off"
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
                <div className={styles.search_icon}>
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

              {/* search result modified by Arshad*/}
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

          {/* navbar icons section modified by Arshad (controlling notifications)*/}
          <section className={styles.icons}>
            <Link href="/home">
              <span
                className={styles.nav_icons}
                onClick={() => {
                  socket?.current?.emit("changed page");
                  setSvgtoggle("Home");
                  handleHomeClick();
                }}
                style={
                  svgtoggle === "Home" ? { transform: "translateY(.8rem)" } : {}
                }
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
                <p
                  className={styles.menu_name}
                  style={{ opacity: svgtoggle === "Home" ? "0" : "null" }}
                >
                  Home
                </p>
                {showDot && <div className={styles.net_notification_dot} />}
              </span>
            </Link>

            <Link href="/network">
              <span
                className={styles.nav_icons}
                onClick={() => {
                  setSvgtoggle("Network");
                  handleNetNotification();
                  socket?.current?.emit("changed page");
                }}
                style={
                  svgtoggle === "Network"
                    ? { transform: "translateY(.8rem)" }
                    : {}
                }
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
                <p
                  className={styles.menu_name}
                  style={{ opacity: svgtoggle === "Network" ? "0" : "null" }}
                >
                  Network
                </p>
              </span>
            </Link>

            <Link href="/collab">
              <span
                className={styles.nav_icons}
                onClick={() => {
                  setSvgtoggle("Collabs");
                  handleDotCollab();
                  socket?.current?.emit("changed page");
                }}
                style={
                  svgtoggle === "Collabs"
                    ? { transform: "translateY(.8rem)" }
                    : {}
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className={styles.home_svg}
                  style={
                    svgtoggle === "Collabs"
                      ? {
                        fill: "#08529B",
                        strokeWidth: "0rem",
                        stroke: "white",
                      }
                      : {}
                  }
                >
                  {svgtoggle === "Collabs" ? (
                    <>
                      <path
                        d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                        clipRule="evenodd"
                      />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                    </>
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                    />
                  )}
                </svg>
                {showCollabDot && (
                  <div className={styles.collab_notification_dot} />
                )}

                <p
                  className={styles.menu_name}
                  style={{ opacity: svgtoggle === "Collabs" ? "0" : "null" }}
                >
                  Collabs
                </p>
              </span>
            </Link>



            <Link href="/message">
              <span
                className={styles.nav_icons}
                onClick={() => {
                  setSvgtoggle("Message");
                  socket?.current?.emit("changed page");
                }}
                style={
                  svgtoggle === "Message"
                    ? { transform: "translateY(.8rem)" }
                    : {}
                }
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
                <p
                  className={styles.menu_name}
                  style={{ opacity: svgtoggle === "Message" ? "0" : "null" }}
                >
                  Message
                </p>
                {totalMessageNotify?.length !== 0 && (
                  <div className={styles.message_dot}>
                    {totalMessageNotify?.length}
                  </div>
                )}
              </span>
            </Link>

            {/* notification modal */}
            <div
              className={styles.nav_icons}
              ref={notificationRef}
              style={notification ? { transform: "translateY(.8rem)" } : {}}
            >
              <div
                className={styles.notification}
                onClick={handleNotificationClick}
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
              <p
                className={styles.menu_name}
                style={{ opacity: notification ? "0" : "null" }}
                onClick={handleNotificationClick}
              >
                Notification
              </p>
              {/* notification section modified by Arshad */}
              {notification && (
                <Notification
                  followusername={null}
                  allRequests={null}
                  userData={userData}
                  projectData={projectData}
                  projectUserData={projectUserData}
                  session={session}
                  countLikeDot={countLikeDot}
                  setCountLikeDot={countLikeDot}
                  setNotification={setNotification}
                  CreateNotifyRef={CreateNotifyRef.current}
                  RegisterNotifyRef={RegisterNotifyRef.current}
                />
              )}
            </div>

            {/* more option in profile */}
            <div className={styles.proficon_upper} ref={meproficons}>
              <div className={styles.circle_cover}>
                <div
                  className={styles.me_circle}
                  style={
                    meproficon ? { opacity: "1", visibility: "visible" } : {}
                  }
                ></div>
                {(userData?.data?.designation === "" ||
                  userData?.data?.location === "" ||
                  userData?.data?.skills.length === 0) && (
                    <div className={styles.UnfinishedDot} />
                  )}
                <div
                  className={styles.prof_icon}
                  onClick={() => {
                    socket?.current?.emit("changed page");
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
                      objectFit: "cover",
                    }}
                    alt="famstep brand logo"
                  />
                </div>
              </div>
              {/* Meprof modal */}
              {meproficon && (
                <Meprof
                  setMeproficon={setMeproficon}
                  userData={userData?.data}
                  session={session}
                />
              )}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

export default Navbar;
