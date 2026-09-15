import { React, useState } from "react";
import styles from "../../styles/Home.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  useFollowerData,
  getPendingStatus,
  handleFollowRequest,
  handleCloseButton,
} from "../../utils/followerUtils";
function HomeSide({
  userData,
  followusername,
  follow,
  // id,
  session,

  myFollower,
}) {
  const follw = myFollower?.includes(followusername);
  const router = useRouter();
  const { followerData, mutateFollowerData } = useFollowerData(followusername);

  const { pendingStatus, pendingValue } = getPendingStatus(
    followerData,
    session
  );

  const [followStatus, setFollowStatus] = useState(
    follow?.includes(followusername) ? "following" : "follow"
  );

  const follow_request = async (e) => {
    e.stopPropagation(); // Prevent card click event
    await handleFollowRequest(followStatus, followusername, mutateFollowerData);
    setFollowStatus(followStatus === "following" ? "follow" : "following");
  };
  const GoToProfile = (id) => {
    router.push(`/profile/${id}`);
  };

  // if (pendingValue) return null;  // use for pending status filter
  return (
    <div className={styles.userDetails} onClick={() => GoToProfile(userData._id)} >
      <div className={styles.userImageSuggestion}>
        <Image
          src={userData.image}
          priority
          alt="userImage"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: "cover",
          }}
        />
      </div>
      <div className={styles.userName_suggestion}>
        <div
          className={styles.userName_suggestionWrap}
          style={{ cursor: "pointer" }}
        >
          <p className={styles.username}>{userData?.name?.length >= 18 ? `${userData?.name.slice(0, 18)}...` : userData.name}</p>
          <p className={styles.designation}>{userData?.designation?.length >= 24 ? `${userData?.designation?.slice(0, 19)}...` : userData?.designation}</p>
        </div>

        <button
          onClick={follow_request}>
          {pendingStatus ? (
            <p>Following</p>
          ) : pendingValue ? (
            <p>Pending</p>
          ) : (
            <>{follw ? <p>Follow back</p> : <p>Follow</p>}</>
          )}
        </button>
      </div>
    </div>
  );
}

export default HomeSide;
