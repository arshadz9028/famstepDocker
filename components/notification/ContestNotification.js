import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Navbar.module.scss";
import { DateSection } from "../../config/dateSec";
import Image from "next/image";
import { format, parse, differenceInMinutes, isValid } from "date-fns";

function ContestNotification({ value, userData, session,setNotification }) {
  const Sdate = new Date(value?.combinedStart);
  const contestStartDate = isValid(Sdate)
    ? format(Sdate, "yyyy-MM-dd HH:mm")
    : "Invalid Date";
  const Edate = new Date(value?.combinedEnd);
  const contestEndDate = isValid(Edate)
    ? format(Edate, "yyyy-MM-dd HH:mm")
    : "Invalid Date";

  const stateComp = value.participants.some(
    (value) => value.user == session.user.id
  );
  const router = useRouter();
  const date = new Date(value.updatedAt);
  return (
    <>
      {stateComp && value.contestState === "ongoing" ? (
        <div className={styles.notification_section} key={value._id}>
          <div className={styles.notification_icon}>
            <Image
              src={value.image}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="notification_section"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          <div className={styles.notification_content}>
            <div
              className={styles.notification_text}
              onClick={() => {router.push(`/ideCode/${value._id}`);setNotification(false)}}
            >
              <p>
                Your contest is started for registered level {value.stage} of
                <span className={styles.blue}>{value.language}</span>
                contest scheduled at{" "}
                <span className={styles.blue}>{contestStartDate}</span>on (IST).
                <span> {DateSection(date)}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.notification_section} key={value._id}>
          <div className={styles.notification_icon}>
            <Image
              src={value.image}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="notification_section"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          <div className={styles.notification_content}>
            <div
              className={styles.notification_text}
              onClick={() => {router.push(`/me/contest`);setNotification(false)}}
            >
              <p>
                You are invited to participate in level {value.stage} of{" "}
                <span className={styles.blue}>{value.language}</span>
                contest scheduled at on{" "}
                <span className={styles.blue}>{contestStartDate}</span> (IST).
                <span> {DateSection(date)}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ContestNotification;
