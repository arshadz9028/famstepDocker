import React, { useState, useRef } from "react";
import Image from "next/image";
import styles from "../../styles/network.module.scss";
import { useRouter } from "next/router";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  useFollowerData,
  getPendingStatus,
  handleFollowRequest,
  handleCloseButton,
} from "../../utils/followerUtils";

function Friend_Request({
  followusername,
  follow,
  id,
  session,
  userData,
  myFollower,
  mutateUserData
}) {
  const follw = myFollower?.includes(id);
  const router = useRouter();
  const { followerData, mutateFollowerData } = useFollowerData(id);

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

  const handleClosebtn = async (e) => {
    e.stopPropagation(); // Prevent card click event
    await handleCloseButton(id);
    mutateUserData()

  };

  const handleCards = () => {
    router.push({
      pathname: "/profile/[id]",
      query: { id }, // Pass the query parameter to the new route
    });
  };

  return (
    <>
      <section
        className={styles.network_frnd}
        id="network_frnd"
        onClick={handleCards}
      >
        <button
          type="close"
          className={styles.clsBtn}
          onClick={handleClosebtn}
          id="clsBtn"
        >
          <IoCloseCircleOutline className={styles.close} />
        </button>
        <div className={styles.above_part}>
          <div className={styles.backgroundCard}>
            <Image
              src={userData?.background}
              priority
              unoptimized
              alt="backgroundPic"
              onError={() => console.log("Error loading image")}
              style={{
                objectFit: "cover",
              }}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className={styles.inner}>
            <Image
              src={userData?.image}
              priority
              alt="profile pic"
              onError={() => console.log("Error loading image")}
              style={{
                objectFit: "cover",
              }}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={4}
            />
          </div>

          {/* <div className={styles.level_designation_cover}>
            <div className={styles.backgroundStrip} />
            <div className={styles.level_designation}>
              <p className={styles.name}>{userData?.name}</p>
            </div>
            <div className={styles.backgroundStrip} />
          </div> */}
        </div>

        <div className={styles.middle_content}>
          <div className={styles.nameSecondCover}>
            <p className={styles.nameSecond}>{userData?.name}</p>
          </div>
          <div className={styles.current_act}>
            <p>{userData?.designation}</p>
          </div>
         
        </div>

        <div
          className={styles.follow_buttons}
          onClick={follow_request}
          style={{
            background: pendingStatus || pendingValue ? "#08529B" : undefined,
          }}
        >
          <button
            style={{ color: pendingStatus || pendingValue ? "white" : "" }}
          >
            {pendingStatus ? (
              <p>Following</p>
            ) : pendingValue ? (
              <p>Pending</p>
            ) : (
              <>{follw ? <p>Follow back</p> : <p>Follow</p>}</>
            )}
          </button>
        </div>
      </section>
    </>
  );
}

export default Friend_Request;
