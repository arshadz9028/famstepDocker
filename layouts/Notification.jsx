import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/Navbar.module.scss";
import axios from "axios";
import useSWR from "swr";
import FollowNotification from "../components/notification/FollowNotification";
import ContestNotification from "../components/notification/ContestNotification";
import GroupNotification from "../components/notification/GroupNotification";
import ClosePart from "../components/profileComp/ClosePart";
import NullNotification from "./NullNotification";
import CollabNotification from "../components/notification/CollabNotification";
import UserCollab from "../components/notification/UserCollab";
async function fetchCode(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchFollowRequests(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

function Notification({
  followusername,
  session,
  userData,
  groupInfo,
  setNotification,
  CreateNotifyRef,
  RegisterNotifyRef,
  projectData,
  projectUserData,
}) {
  const [followStatus, setFollowStatus] = useState({});

  // Fetch follow request data
  const {
    data: followerData,
    mutate: mutateFollowRequestsData,
    error: followRequestsError,
  } = useSWR("/api/profile/follow/follwerFetch", fetchFollowRequests);

  /* friend request control yahan se  */
  const followerUser = followerData?.dats?.followers.map(
    (follow) => follow?.userid?._id
  );
  const followsArray = followerData?.dats?.followers;
  const filteredFollower = followerUser?.includes(followusername);

  /* group request control yahan se  */
  const groupUser = followerData?.dats?.groupsAdded.map(
    (follow) => follow.grpId?._id
  );
  const groupArray = followerData?.dats?.groupsAdded;
  const groupFollower = groupUser?.includes(followusername);

  /* Collab handle */
  const collabArray = projectData?.data.flatMap(
    (post) => post.collabRequests?.map((request) => request) || []
  );

  const collabUserArray = projectUserData?.data.map((request) => request) || [];

  useEffect(() => {
    if (followerUser) {
      const status = {};
      followerUser.forEach((userid) => {
        status[userid] = true;
      });
      setFollowStatus(status);
    }
  }, []);
  const isRequestAccepted = (userid) => {
    return followStatus[userid] || false;
  };

 

  const allRequests = [
    ...(followerData?.data?.followRequests || []),
    ...(followerData?.data?.groupInvites || []),
    ...CreateNotifyRef,
    ...RegisterNotifyRef,
    ...collabArray,
    ...collabUserArray,
  ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return (
    <>
      {followerData && (
        <div className={styles.notification_modal}>
          <ClosePart title={"Notification"} CloseTheModal={setNotification} />
          {allRequests?.length !== 0 ? (
            allRequests?.map((value, index) => {
              const isMember =value?.collabID && value?.userid?._id == session.user.id;
              const isAdmin =value?.collabID && value?.userid?._id !== session.user.id;
              let filteredLevel;

              if (value?.participants) {
                filteredLevel = value.participants.some(
                  (val) => val.user === session.user.id
                );
              }

              // Generating a unique key
              const uniqueKey = `${value?.userid?._id}-${index}`;

              return (
                <React.Fragment key={uniqueKey}>
                  <div className={styles.notificationContent}>
                    {
                    
                    value.admin ? (
                      <GroupNotification
                        key={uniqueKey}
                        value={value}
                        groupFollower={groupFollower}
                        groupArray={groupArray}
                        setNotification={setNotification}
                      />
                    ) : isAdmin ? (
                      <CollabNotification
                        value={value}
                        setNotification={setNotification}
                      />
                    ) : isMember ? (
                      <UserCollab
                        value={value}
                        setNotification={setNotification}
                      />
                    ) : (
                      <FollowNotification
                        key={uniqueKey}
                        value={value}
                        followsArray={followsArray}
                        isRequestAccepted={isRequestAccepted}
                        filteredFollower={filteredFollower}
                        setNotification={setNotification}
                      />
                    )}
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <NullNotification key="no-notifications" />
          )}
        </div>
      )}
    </>
  );
}

export default Notification;
