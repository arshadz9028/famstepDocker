import React, { useEffect, useState, useContext } from "react";
import styles from "../../styles/Navbar.module.scss";
import Image from "next/image";
import { DateSection } from "../../config/dateSec";
import { useRouter } from "next/router";

function GroupNotification({
  value,
  groupFollower,
  groupArray,
  setNotification,
}) {
  const router = useRouter();
  const date = new Date(value?.createdAt);
  const date1 = groupArray?.find(
    (follow) => follow.userid == value?.userid?._id
  )?.createdAt;
  const dateUpdate = new Date(value?.updatedAt);
  return (
    <>
      <div
        key={value._id}
        className={styles.notification_section}
        onClick={() => {router.push(`/network/groups/${value.groupId._id}`);setNotification(false)}}
      >
        <div className={styles.notification_icon}>
          <Image
            src={value?.groupId.image}
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
              {!value.IsAcctdInvite ? (
                <>
                  <span className={styles.blue}>{value?.admin.username}</span>
                  <>
                    {" "}
                    has invited to join{" "}
                    <span className={styles.blue}>
                      {value?.groupId.groupName}
                    </span>
                    .
                  </>
                </>
              ) : (
                <>
                  You have successfully joined{" "}
                  <span className={styles.blue}>
                    {value?.groupId.groupName}
                  </span>
                </>
              )}
              <span className={styles.time}>
                {!groupFollower ? DateSection(date) : DateSection(dateUpdate)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupNotification;
