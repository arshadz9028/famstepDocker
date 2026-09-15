import React, { useEffect, useState, useContext } from "react";
import styles from "../../styles/Navbar.module.scss";
import Image from "next/image";
import { DateSection } from "../../config/dateSec";
import { useRouter } from "next/router";
function CollabNotification({
  value,
  filteredFollower,
  followsArray,
//   isRequestAccepted,
  setNotification,
}) {
//   const isAccepted = isRequestAccepted(value?.userid?._id);
  const router = useRouter();
  const date = new Date(value?.createdAt);
  
  const handleRoute = () => {
    router.push(`/profile/${value?.userid?._id}`);
  };
  const { profile } = router.query;
  return (
    <>
      <div
        key={value._id}
        className={styles.notification_section}
        onClick={() => {
          if (profile === value?.userid?._id) {
            setNotification(false);
          } else {
            router.push(`/profile/${value?.userid?._id}`);
            setNotification(false);
          }
        }}
      >
        <div className={styles.notification_icon}>
          <Image
            src={value?.userid?.image}
            alt="notification_section"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
            }}
          />
        </div>

        <div className={styles.notification_content}>
          <div className={styles.notification_text}>
            <p>
              <span className={styles.blue}>{value?.userid?.username} </span>
              {!value?.IsAccepted ? (
                <>has requested to collab with you.</>
              ) : (
                <>started collaberating you.</>
              )}
              <span className={styles.time}>
                {/* {!filteredFollower || filteredFollower === false
                  ? DateSection(date)
                  : DateSection(dateUpdate)} */}
             { DateSection(date)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CollabNotification;
