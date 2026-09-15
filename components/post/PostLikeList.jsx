import React, { useState, useEffect } from "react";
import styles from "../../styles/EditProfile.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import UnfollowModal from "../../components/profileComp/UnfollowModal";
import ClosePart from "../profileComp/ClosePart";
import {
  useFollowerData,
  getPendingStatus,
  handleFollowRequest,
} from "../../utils/followerUtils";

function PostLikeList({
  
  session,
  setListlike,
  likeData,
}) {
  const [unfollowUser, setUnfollowUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = unfollowUser ? "hidden" : "unset";
    document.body.style.overflowX = "hidden";
  }, [unfollowUser]);

  const closeModel = (e) => {
    if (e.target.id === "main") {
      setListlike(false);
    }
  };

  return (
    <div className={styles.main} id="main" onClick={closeModel}>
      <div className={styles.fullEdit}>
        <ClosePart title={"Likes"} CloseTheModal={setListlike} />

        

        {likeData.map((value) => {

          const isCurrentUser = value.user._id === session.user.id;

          return (
            <div
              onClick={() => {
                if (!isCurrentUser) {
                  router.push(`/profile/${value.user._id}`);
                }
              }}
              key={value?.user?._id}
              className={styles.friendsListCard}
              style={{
                justifyContent: "flex-start",
                padding: "1rem 2rem 1rem ",
              }}
            >
              <div className={styles.friendsListImage}>
                <Image
                  src={value?.user?.image}
                  alt="userImage"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                className={styles.friendsListDetails}
                style={{ marginLeft: "1.2rem", width: "65%" }}
              >
                <p className={styles.fullName} style={{ fontSize: "1.6rem" }}>
                  {value?.user?.name}
                </p>
                <p
                  className={styles.designation}
                  style={{ fontSize: "1.4rem" }}
                >
                  {value?.username}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PostLikeList;
