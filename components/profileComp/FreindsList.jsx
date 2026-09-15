import React, { useState, useEffect } from "react";
import styles from "../../styles/EditProfile.module.scss";
import Image from "next/image";
import UnfollowModal from "./UnfollowModal";
import { useRouter } from "next/router";
import cap from "../../assets/newIcons/admin.png";

import {
  useFollowerData,
  getPendingStatus,
  handleFollowRequest,
  handleCloseButton,
} from "../../utils/followerUtils";
function FreindsList({
  toggleState,
  followers,
  filteredfollowings,
  follow,
  session,
  userId,
  followerDataFrnd,
  setFriendList,
  admin,FollowerDataSession
}) {
  const id = followers?.userid?._id;
  const follwId = FollowerDataSession?.following.includes(id)
  const Router = useRouter();
  const pathName = Router.pathname.split("/")[1];
  const [unfollowUser, setUnfollowUser] = useState(false);
  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (unfollowUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [unfollowUser]);
  const friendsFollowers = followers?.userid?._id === session?.user?.id;
  const filterAction = session?.user.id === userId;
  const { followerData, mutateFollowerData } = useFollowerData(id);

  const { pendingStatus, pendingValue } = getPendingStatus(
    followerData,
    session
  );

  const [followStatus, setFollowStatus] = useState(
    follow?.includes(id) ? "following" : "follow"
  );

  const follow_request = async () => {
    await handleFollowRequest(followStatus, id, mutateFollowerData);
    setFollowStatus(followStatus === "following" ? "follow" : "following");
  };
  return (
    <>
      {unfollowUser && (
        <UnfollowModal
          setUnfollowUser={setUnfollowUser}
          toggleState={toggleState}
          followers={followers?.userid}
          mutatefollowerData1={mutateFollowerData}
        />
      )}
      <div className={styles.friendsListCard}>
        <div
          className={styles.friendsListFirstPart}
          onClick={() => {
            if (!friendsFollowers) {
              setFriendList(false);
              Router.push(`/profile/${followers?.userid._id}`);
            }
          }}
        >
          <div className={styles.friendsListImage}>
            <Image
              src={followers?.userid?.image}
              alt="userImage"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          <div className={styles.friendsListDetails}>
            <div style={{display:"flex"}} >
              <p className={styles.fullName}>
                {followers?.userid ? followers?.userid?.name : "User Unvailable"}
              </p>
              {toggleState === "Members" && admin === followers?.userid._id && (
                <div className={styles.adminCap}>
                <Image
                  src={cap}
                  alt="cap"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
              )}
            </div>
            <p className={styles.designation}>
              {followers?.userid?.designation}
            </p>
          </div>
        </div>
        {toggleState === "Following" && (
          <>
            {filterAction && (
              <div
                className={styles.contestButton}
                onClick={() => setUnfollowUser(true)}
              >
                <input type="submit" value="Remove" />
              </div>
            )}

            {!friendsFollowers && pathName === "profile" && (
              <div className={styles.contestButton} onClick={follow_request}>
                {pendingStatus ? (
                  <input
                    type="submit"
                    // onClick={() => setUnfollowUser(true)}
                    value="Following"
                  />
                ) : pendingValue ? (
                  <input
                    type="submit"
                    value="Pending"
                    // style={{ color: "#08529B" }}
                  />
                ) : (
                  <>
                    <input type="submit" value="follow" />
                  </>
                )}
              </div>
            )}
          </>
        )}
        {toggleState === "Followers" && (
          <>
            {filterAction && (
              <div
                className={styles.contestButton}
                onClick={() => setUnfollowUser(true)}
              >
                <input type="submit" value="Remove" />
              </div>
            )}
            {pathName === "profile" && !friendsFollowers && (
              <div className={styles.contestButton} onClick={follow_request}>
                {pendingStatus ? (
                  <input
                    type="submit"
                    value="Following"
                    // onClick={() => setUnfollowUser(true)}
                  />
                ) : pendingValue ? (
                  <input
                    type="submit"
                    value="Pending"
                    // style={{ color: "#08529B" }}
                  />
                ) : (
                  <>
                    <input type="submit" value="follow" />
                  </>
                )}
              </div>
            )}
          </>
        )}
        {toggleState === "Praise" && <></>}

        {toggleState === "Members" && (
          <>
            {!filterAction && (
              <>
                {filteredfollowings ? (
                  <div
                    className={styles.contestButton}
                    onClick={() => setUnfollowUser(true)}
                    style={{ background: "#08529B" }}
                  >
                    <input
                      type="submit"
                      value="Following"
                      style={{ color: "white" }}
                    />
                  </div>
                ) : (
                  <div
                    className={styles.contestButton}
                    onClick={follow_request}
                    style={
                      pendingStatus || pendingValue
                        ? { background: "#08529B" }
                        : {}
                    }
                  >
                    {pendingStatus ? (
                      <input
                        type="submit"
                        value="Following"
                        onClick={() => setUnfollowUser(true)}
                        style={{ color: "white" }}
                      />
                    ) : pendingValue ? (
                      <input
                        type="submit"
                        value="Pending"
                        style={{ color: "white" }}
                      />
                    ) : (
                      <>
                        <input type="submit" value="follow" />
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default FreindsList;
