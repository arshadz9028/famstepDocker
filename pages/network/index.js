import React, { useState, useEffect } from "react";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/network.module.scss";
import Friend_Request from "../../components/network/Friend_Request";
import Invitation from "../../components/network/Invitation";
import InvitationGroups from "../../components/network/InvitationGroups";
import Network_Grp from "../../components/network/Network_Grp";
import NetProfileCard from "../../components/network/NetProfileCard";
import ScoreTab from "../../layouts/Network/NetworkTab";
import User from "../../model/userModel";
import { getSession } from "next-auth/react";
import connectDb from "../../database/conn";
import UserFollow from "../../model/followModel";
import axios from "axios";
import useSWR from "swr";
import Link from "next/link";
import ConnectionsList from "../../layouts/ProfileModal/ConnectionsList";
import MoreInvitations from "../../components/network/MoreInvitations";
import { RiContactsLine } from "react-icons/ri";
import { BsMailbox2 } from "react-icons/bs";
import UpdateusProfile from "../../layouts/Network/UpdateusProfile";
import FeedBackModel from "../../layouts/Network/FeedbackModel";
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
async function fetchGroups(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
function Index({ session, lenOfFollower, userExist }) {
  const {
    data: userData,
    mutate: mutateUserData,
    error: UserDataError,
  } = useSWR(`/api/user/userFetch`, fetchUser);

  const {
    data: followerData,
    mutate: mutatefollowerData,
    error: followerError,
  } = useSWR("/api/profile/follow/follwerFetch", fetchFollowers);

  const {
    data: grpData,
    mutate: mutategrpData,
    error: userError,
  } = useSWR(`/api/group/groupFetch`, fetchGroups);

  const groupData = grpData?.data?.filter((group) =>
    group?.members?.some((member) => member?.user?._id === session.user.id)
  );
  const groupAdmin = grpData?.data?.filter(
    (group) => group?.admin?._id === session.user.id
  );

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

  /* useEffect for handling firend requst explor and counter */
  useEffect(() => {
    const countFollowRequests = followerData?.data?.followRequests.reduce(
      (count, req) => (req.IsAccepted ? count + 1 : count),
      0
    );

    const countGroupInvites = followerData?.data?.groupInvites.reduce(
      (count, req) => (req.IsAcctdInvite ? count + 1 : count),
      0
    );

    const totalAcceptedInvitations = countFollowRequests + countGroupInvites;

    setAcceptedInvitations(totalAcceptedInvitations);
  }, [followerData]);

  const fllowLen = followerData?.data?.followRequests.length;
  const grpLen = followerData?.data?.groupInvites.length;
  const allRequests = [
    ...(followerData?.data?.followRequests || []),
    ...(followerData?.data?.groupInvites || []),
  ];

  return (
    <>
      <Navbar select={"Network"} session={session} />
      {friendList != "" && (
        <ConnectionsList
          followerData={followerData?.dats}
          mutatefollowerData={mutatefollowerData}
          setFriendList={setFriendList}
          friendList={friendList}
          session={session}
          userId={followerData?.user}
        />
      )}

      {invitations && (
        <MoreInvitations
          followerData={followerData}
          mutatefollowerData={mutatefollowerData}
          acceptedInvitations={acceptedInvitations}
          setInvitations={setInvitations}
          invitations={invitations}
        />
      )}

      <ScoreTab
        selected={"Community"}
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
        <div className={styles.network_center}>
          <div className={styles.invitatons} style={{
            borderBottom: fllowLen + grpLen &&
              fllowLen + grpLen - acceptedInvitations !== 0 ? "1px solid #cccccc" : undefined
          }}>
            <div className={styles.invitationsMsgCover}>
              <div className={styles.invitationsMsg}>
                <p>
                  Invitations
                  <span className={styles.counter}>
                    {fllowLen + grpLen
                      ? fllowLen + grpLen - acceptedInvitations
                      : 0}
                  </span>
                </p>
              </div>
              {fllowLen + grpLen - acceptedInvitations > 2 && (
                <p onClick={() => setInvitations(true)}>Explore</p>
              )}
            </div>

            {fllowLen + grpLen &&
              fllowLen + grpLen - acceptedInvitations !== 0 ? (
              <>
                {allRequests
                  .slice(0, 2 + acceptedInvitations)
                  .map((req, index) => {
                    return (
                      <div key={req._id}>
                        {req.admin ? (
                          <div>
                            {!req.IsAcctdInvite && (
                              <InvitationGroups
                                group={req}
                                grpindex={index}
                                mutatefollowerData={mutatefollowerData}
                                followerData={followerData}
                                followusername={req.admin}
                              />
                            )}
                          </div>
                        ) : (
                          <div key={req._id}>
                            {!req.IsAccepted && (
                              <Invitation
                                follow={req}
                                index={index}
                                mutatefollowerData={mutatefollowerData}
                                followerData={followerData}
                                followusername={req.userid}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </>
            ) : (
              <div className={styles.noInvitation}>
                <BsMailbox2 className={styles.noInvitationMail} />
                <p>You don&apos;t have any invitaion</p>
              </div>
            )}
          </div>

          <div className={styles.belowNet_Card}>
            {/* //suggestion */}
            {userData?.dataSuggested?.length > 0 && (
              <div
                className={styles.suggestion}
                style={
                  userData?.dataSuggested.length
                    ? {
                      borderBottom: "1px solid #cccccc",
                      paddingBottom: "1.8rem",
                      marginBottom: "1.8rem",
                    }
                    : {
                      borderBottom: "none",
                      paddingBottom: "0",
                      marginBottom: "0",
                    }
                }
              >
                <div className={styles.invitationsMsgCover}>
                  <div className={styles.invitationsMsg}>
                    <p>
                      Explore new connections and expand your network with
                      people you may know.
                    </p>
                  </div>

                  {userData?.dataSuggested.length > 3 && (
                    <Link href="/network/contacts">
                      <p className={styles.invitationsExplore}>Explore</p>
                    </Link>
                  )}
                </div>

                <div className={styles.net_card}>
                  {userData?.dataSuggested.slice(0, 3).map((value, index) => {
                    return (
                      <div key={value._id}>
                        {
                          <Friend_Request
                            index={index}
                            userData={value}
                            followerData={followerData}
                            session={session}
                            id={value._id}
                            userExist={userExist}
                            mutateUserData={mutateUserData}
                            mutatefollowerData={mutatefollowerData}
                            followusername={value._id}
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
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* like-minded */}
            {userData?.dataLikeminded.length > 0 && (
              <div
                className={styles.suggestion}
                style={
                  userData?.dataLikeminded.length
                    ? {
                      borderBottom: "1px solid #cccccc",
                      paddingBottom: "1.8rem",
                      marginBottom: "1.8rem",
                    }
                    : {
                      borderBottom: "none",
                      paddingBottom: "0",
                      marginBottom: "0",
                    }
                }
              >
                <div className={styles.invitationsMsgCover}>
                  <div className={styles.invitationsMsg}>
                    <p>
                      Connect with like-minded minds! Here are some suggestions
                      to align with your interests.
                    </p>
                  </div>

                  {userData?.dataLikeminded.length > 3 && (
                    <Link href="/network/likemindedpeople">
                      <p className={styles.invitationsExplore}>Explore</p>
                    </Link>
                  )}
                </div>
                <div className={styles.net_card}>
                  {userData?.dataLikeminded.slice(0, 3).map((value, index) => {
                    return (
                      <div key={value._id}>
                        <Friend_Request
                          userData={value}
                          session={session}
                          id={value._id}
                          followusername={value._id}
                          mutateUserData={mutateUserData}
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
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* group */}
            {grpData?.dataGet.length > 0 && (
              <div
                className={styles.suggestion}
                style={
                  grpData?.dataGet.length
                    ? {
                      borderBottom: "1px solid #cccccc",
                      paddingBottom: "1.8rem",
                      marginBottom: "1.8rem",
                    }
                    : {
                      borderBottom: "none",
                      paddingBottom: "0",
                      marginBottom: "0",
                    }
                }
              >
                <div className={styles.invitationsMsgCover}>
                  <div className={styles.invitationsMsg}>
                    <p>
                      Discover tailored groups! Here are some to match your
                      interests. Dive in and connect with like-minded folks.
                    </p>
                  </div>

                  {grpData?.dataGet.length > 3 && (
                    <Link href="/network/groups/moregroups">
                      <p className={styles.invitationsExplore}>Explore</p>
                    </Link>
                  )}
                </div>

                <div className={styles.net_card}>
                  {grpData?.dataGet.slice(0, 3).map((value, index) => {
                    const isGrop = groupData?.some(
                      (val) => val._id === value._id
                    );
                    const isGropAd = groupAdmin?.some(
                      (val) => val._id === value._id
                    );

                    return (
                      <div key={value._id}>
                        <Network_Grp
                          memberGroup={isGrop}
                          adminGroup={isGropAd}
                          value={value}
                          mutateuserData={mutategrpData}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {userData?.dataSuggested.length == 0 &&
              userData?.dataLikeminded.length == 0 &&
              grpData?.dataGet.length == 0 && (
                <div className={styles.contestMessage} id="contestMessage">
                  <style jsx global>{`
                      #contestMessage {
                        background: white;
                        margin: 0rem;
                        padding: 5rem;
                        border-radius: 1rem;
                      }
                      #contestMessageContent {
                        font-weight: 500;
                        color: #f1f0ed;
                        line-height: 3.5rem;
                        padding: 0rem 1rem;
                      }
                      #contestMessageIcon {
                        width: 11rem;
                        height: 11rem;
                        color: #f1f0ed;
                      }
                      #contestMessageIconCircle {
                        border: 5px solid #f1f0ed;
                      }
                      @media (max-width: 767px) {
                        #contestMessage {
                          padding: 5rem 1rem;
                          margin-bottom: 1rem;
                        }
                        #contestMessageIconCircle {
                          width: 15rem;
                          height: 15rem;
                        }
                        #contestMessageIcon {
                          width: 9rem;
                          height: 9rem;
                          color: #f1f0ed;
                        }
                        #contestMessageContent {
                          color: #f1f0ed;
                          line-height: 3rem;
                          padding: 0rem 0.5rem;
                        }
                      }
                    `}</style>
                  <div
                    className={styles.contestMessageIconCircle}
                    id="contestMessageIconCircle"
                  >
                    <div
                      className={styles.contestMessageIcon}
                      id="contestMessageIcon"
                    >
                      <RiContactsLine
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  </div>
                  <p
                    className={styles.contestMessageContent}
                    id="contestMessageContent"
                  >
                    No more users or groups left to follow. You&apos;ve
                    connected with everyone available. Check back soon for
                    updates!
                  </p>
                </div>
              )}
          </div>

          <div className={styles.rightSideBar}>
            {/* profileCard */}
            <NetProfileCard
              userExist={userExist}
              lenOfFollower={lenOfFollower}
              setFriendList={setFriendList}
            />
            <div className={styles.sideMenu}>
              <Link href='/network/contacts'>
                <p className={styles.sideHover} >Community</p>
              </Link>
              <Link href='/network/contacts'>
                <p className={styles.sideHover1}>Suggested Users </p>
              </Link>
              <Link href='/network/likemindedpeople'>
                <p className={styles.sideHover1}>Like-minded people</p>
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
  console.log('rergrg', session);
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
  const username = session?.user.username;
  const userid = session?.user.id;
  await connectDb();
  const allusers = await User.find({ username: { $ne: username } });
  const userExist = await User.findOne({ username });
  const lenOfFollower = await UserFollow.findOne({ user: userid });
  return {
    props: {
      session,
      allUsers: JSON.parse(JSON.stringify(allusers)),
      userExist: JSON.parse(JSON.stringify(userExist)),
      lenOfFollower: JSON.parse(JSON.stringify(lenOfFollower)),
    },
  };
}
export default Index;
