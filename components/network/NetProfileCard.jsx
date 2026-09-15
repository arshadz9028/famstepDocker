import React from "react";
import Image from "next/image";
import styles from "../../styles/network.module.scss";
import { useRouter } from "next/router";
import { RiVerifiedBadgeFill } from "react-icons/ri";

function NetProfileCard({ lenOfFollower, setFriendList, userExist }) {
  const router = useRouter();

  const GoToProfile = () => {
    router.push(`/me`);
  };

  return (
    <>
      <div className={styles.leftside_prof} onClick={GoToProfile}>
        <div className={styles.dp}>
          <Image
            src={userExist.image}
            priority
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
            }}
            className={styles.profile_image}
            alt="user_dp"
          />
        </div>

        <div className={styles.profile_name}>
          <h3>
            {userExist.name}
            {userExist?.verifiedTick.color !== "" && (
              <span className={styles.blue_tick}>
                <RiVerifiedBadgeFill
                  className={styles.blue_tick1}
                  style={{ color: `${userExist?.verifiedTick.color}` }}
                />
              </span>
            )}
          </h3>

          <p className={styles.title}>{userExist.designation}</p>
        </div>

        <div className={styles.follow}>
          <p
            onClick={(e) => {
              e.stopPropagation();
              setFriendList("Followers");
            }}
          >
            <span style={{ color: "black" }}>
              {lenOfFollower ? lenOfFollower?.followers.length : 0}{" "}
            </span>
            followers
          </p>
          <p
            onClick={(e) => {
              e.stopPropagation();
              setFriendList("Following");
            }}
          >
            <span style={{ color: "black" }}>
              {" "}
              {lenOfFollower ? lenOfFollower?.following.length : 0}
            </span>{" "}
            following
          </p>
        </div>
      </div>
    </>
  );
}

export default NetProfileCard;
