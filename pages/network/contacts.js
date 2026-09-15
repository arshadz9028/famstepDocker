import React, { useState, useEffect } from "react";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/network.module.scss";
import loaderStyles from "../../styles/ImageLoading.module.scss";
import Friend_Request from "../../components/network/Friend_Request";
import ScoreTab from "../../layouts/Network/NetworkTab";
import axios from "axios";
import useSWR from "swr";
import User from "../../model/userModel";
import { getSession } from "next-auth/react";
import connectDb from "../../database/conn";
import UserFollow from "../../model/followModel";
import { FaUserFriends } from "react-icons/fa";
import NoCardsMessage from "../../components/network/NoCardsMessage";
import useSWRInfinite from "swr/infinite";
import NetProfileCard from "../../components/network/NetProfileCard";
import Link from "next/link";

async function fetchUser(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
async function fetchFollowers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
function Contacts({ session, lenOfFollower, userExist }) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateUserData,
  } = useSWRInfinite(
    (index) => `/api/user/netSuggestedUser?page=${index + 1}&limit=16`,
    fetchUser,
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

  const userData = { data: posts };
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
    data: followerData,
    mutate: mutatefollowerData,
    error: followerError,
  } = useSWR("/api/profile/follow/follwerFetch", fetchFollowers);
  const [friendList, setFriendList] = useState("");
  const [invitations, setInvitations] = useState(false);
  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (friendList || invitations) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [friendList, invitations]);
  const [acceptedInvitations, setAcceptedInvitations] = useState(0);

  useEffect(() => {
    const countAcceptedInvitations = followerData?.data?.followRequests.reduce(
      (count, req) => (req.IsAccepted ? count + 1 : count),
      0
    );

    setAcceptedInvitations(countAcceptedInvitations);
  }, [followerData]);
  return (
    <>
      <Navbar select={"Network"} session={session} />
      <ScoreTab
        selected={"Suggested Users"}
        pages={"Community"}
        pageLink={"/network"}
        Suggested={"Suggested Users"}
        SuggestedLink={"/network/contacts"}
        groups={"Groups"}
        groupsLink={"/network/groups"}
        likeMinded={"Like-minded people"}
        likeMindedLink={"/network/likemindedpeople"}
      />
      <section className={styles.network_page}>
        <div className={styles.network_center_contact}>
          <div className={styles.invitationsHeaderCover} >
            {userData?.data?.length != 0 ? (
              <>
                {/* <div className={styles.invitationsHeader}>
                  <p>
                    Explore new connections and expand your network with people
                    you may know.
                  </p>
                </div> */}

                <div className={styles.net_card}>
                  {userData?.data.map((value, index) => {
                    return (
                      <div key={value._id}>

                        <Friend_Request
                          index={index}
                          userData={value}
                          followerData={followerData}
                          session={session}
                          id={value._id}
                          userExist={userExist}
                          mutatefollowerData={mutatefollowerData}
                          followusername={value._id}
                          follow={
                            lenOfFollower?.following.length !== 0
                              ? lenOfFollower?.following.map((foll) => foll.userid)
                              : null

                          }
                          mutateUserData={mutateUserData}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {!isLoadingInitialData && <NoCardsMessage
                  MessageRectIcon={FaUserFriends}
                  MessageContent={`You've connected with everyone—no more users left to follow!`}
                />}
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

            {isReachingEnd && userData?.data?.length != 0 && (
              <div className={loaderStyles.ParaCover}>
                <p className={loaderStyles.loaderCoverP}>
                  You may have viewed all friend suggestions.{" "}
                </p>
              </div>
            )}
          </div>

          <div className={styles.rightSideBarExtra}>
            {/* profileCard */}
            <NetProfileCard
              userExist={userExist}
              lenOfFollower={lenOfFollower}
              setFriendList={setFriendList}
            />
            <div className={styles.sideMenu}>
              <Link href='/network'>
                <p className={styles.sideHover1} >Community</p>
              </Link>
              <Link href='/network/contacts'>
                <p className={styles.sideHover} >Suggested Users </p>
              </Link>
              <Link href='/network/likemindedpeople'>
                <p  className={styles.sideHover1} >Like-minded people</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  const username = session?.user.username;
  const userid = session?.user.id;
  await connectDb();
  const userExist = await User.findOne({ username });
  const lenOfFollower = await UserFollow.findOne({ user: userid });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { isNewUser } = session?.user;
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
      userExist: JSON.parse(JSON.stringify(userExist)),
      lenOfFollower: JSON.parse(JSON.stringify(lenOfFollower)),
    },
  };
}
export default Contacts;
