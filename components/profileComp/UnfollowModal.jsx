import React, { useState, useEffect } from "react";
import styles from "../../styles/EditProfile.module.scss";
import axios from "axios";
import { mutate } from "swr";
function UnfollowModal({
  setUnfollowUser,
  toggleState,
  followers,
  mutatefollowerData1,
}) {
  const closeModel = (e) => {
    if (e.target.id === "unFollowMain") {
      setUnfollowUser(false);
    }
  };
  const handleUnfollow = async (followUsername) => {
    try {
      const unfollowUserUrl = `/api/profile/follow/unfollowUser/?followusername=${followUsername}&toggleState=${toggleState}`;
      const followRequestUrl = `/api/profile/follow/followRequest?userid=${followUsername}`;

      await axios.delete(unfollowUserUrl);

      await axios.delete(followRequestUrl);

      setUnfollowUser(false);
    } catch (error) {
      console.error("Error during unfollow:", error);
    }
    mutatefollowerData1();
    mutate("/api/profile/follow/userFetch");
  };
  return (
    <>
      <div className={styles.main} id="unFollowMain" onClick={closeModel}>
        <div className={styles.UnFollowCard}>
          <p className={styles.unFollowContent}>
            {toggleState === "Following" || toggleState === "Members" ? (
              <>
                You&apos;re about to stop following
                <span className={styles.unFollowName}>{followers?.name}.</span>
              </>
            ) : (
              <>
                Remove your followers&apos; list! No worries {followers?.name}{" "}
                won&apos;t know you&apos;ve unfollowed.
              </>
            )}
          </p>

          <div className={styles.unFollowButtonCover}>
            <div
              className={styles.unFollowButton}
              onClick={() => handleUnfollow(followers?._id)}
            >
              <input
                type="button"
                value={
                  toggleState === "Following" || toggleState === "Members"
                    ? "Unfollow"
                    : "Remove"
                }
                style={{ color: "red" }}
              />
            </div>
            <div
              className={styles.unFollowButton}
              onClick={() => setUnfollowUser(false)}
            >
              <input type="button" value="Cancel" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnfollowModal;
