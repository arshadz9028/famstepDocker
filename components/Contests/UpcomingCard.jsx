import React, { useContext } from "react";
import Image from "next/image";
import styles from "../../styles/contest.module.scss";
import { format, parse, isValid } from "date-fns";
import { ContextProvider } from "../../global/context";
import { useRouter } from "next/router";
import axios from "axios";

function UpcomingCard({ codeData, session, projectUserData }) {
  const { setRegisterModal, setContestId, setCollabID, setOpenDetails } = useContext(ContextProvider);
  const Sdate = new Date(codeData?.combinedStart);
  const contestStartDate = isValid(Sdate)
    ? format(Sdate, "yyyy-MM-dd HH:mm")
    : "Invalid Date";
  // const formattedContestStartDate = format(contestStartDate,
  //   "MMM dd yyyy HH:mm",
  //   new Date()
  // const userIncludedInParticipants = codeData.participants.some((value) => value.user == session.user.id)

  const router = useRouter()
  // );
  const handleOngoing = () => {
    router.push(`/projectTask/${codeData?.collabID}`)
  }
  const newSelected = codeData?.owner?._id
  const chatWithSelected = async () => {
    try {
      const res = await axios.post(`/api/message/chat`, { newSelected });
      await router.push(`/message/${res.data._id}`);

    } catch (error) {
      return <> Failed to load profile page. </>;
    }
  };
  return (
    <>
      <div className={`${styles.collabCard} ${styles.joinedCard}`} >
        <div className={styles.statusRibbon1}>Active</div>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{codeData?.title?.length > 27 ? codeData?.title.slice(0, 27) + '...' : codeData?.title}</h3>

          {/* <span className={styles.cardStatus}>Recruiting</span> */}
        </div>
        <div className={styles.cardDetails}>
          <div className={styles.detailItem}>
            <span>✅ My Role:</span>
            <strong>{codeData?.userid.designation}</strong>
          </div>
          <div className={styles.detailItem}>
            <span>📅 Duration:</span>
            <strong>{codeData?.durationReq}</strong>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.userInfo}>
              <div className={styles.userImage}>
                <Image
                  src={codeData?.owner?.image || "/default.png"}
                  alt={codeData?.owner?.name || "Owner"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
              <span>Owner: {codeData.owner.name || "Unknown"}</span>
            </div>
          </div>
          {/* <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div> */}
          {/* <div className={styles.detailItem}>
            <span>⭐ Progress:</span>
            <strong>12/25 Tasks Done</strong>
          </div> */}
        </div>
        <div className={styles.cardActions}>
          <button className={`${styles.btn} ${styles.primaryBtn}`}
            onClick={handleOngoing}
          >View Tasks</button>
          <button onClick={chatWithSelected}
            className={`${styles.btn} ${styles.secondaryBtn}`}>
            Message Owner
          </button>
        </div>
      </div>
    </>
  );
}

export default UpcomingCard;
