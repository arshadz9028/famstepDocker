import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import styles from "../../styles/contest.module.scss";
import {
  format,
  parse,
  differenceInMinutes,
  differenceInSeconds,
  isValid,
} from "date-fns";
import { ContextProvider } from "../../global/context";
import { useRouter } from "next/router";
import CollabPost from "../../components/Collab/CollabPost";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import axios from "axios";

function OngoingCard({ session, codeData }) {
  const [countdown, setCountdown] = useState(0);
  const dateNow = new Date();
  const Sdate = new Date(codeData?.combinedStart);
  const contestStartDate = isValid(Sdate)
    ? format(Sdate, "yyyy-MM-dd HH:mm")
    : "Invalid Date";

  const Edate = new Date(codeData?.combinedEnd);
  const contestEndDate = isValid(Edate)
    ? format(Edate, "yyyy-MM-dd HH:mm")
    : "Invalid Date";
  const startDate = parse(contestStartDate, "yyyy-MM-dd HH:mm", new Date());
  const endDate = parse(contestEndDate, "yyyy-MM-dd HH:mm", new Date());
  const differenceInSecondsValue = differenceInSeconds(endDate, dateNow);
  const { setcollabID, openDetails, setOpenDetails, setEnrollModal, setContestId, enrollModal, isEditCollab, setIsEditCollab } =
    useContext(ContextProvider);

  const router = useRouter();

  const handleOngoing = () => {
    router.push(`/projectTask/${codeData?.id}`);
  };
  const applicant = codeData?.collabRequests.filter(
    (value) => value?.IsAccepted == true
  );
  const handleEdit = (e) => {
    e.stopPropagation()
    setcollabID(codeData?.id)
    setOpenDetails(true)
    setIsEditCollab(true)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this collaboration?")) {
      try {
        const res = await axios.delete(`/api/collab/${codeData?.id}`);
        if (res.data.success) {
          router.reload();
        }
      } catch (error) {
        console.error("Error deleting collaboration:", error);
      }
    }
  };
  
  // Get accepted applicants only
  const acceptedApplicants = codeData?.collabRequests?.filter(request => request.IsAccepted === true) || [];
  // Get the first 3 accepted applicants for display
  const displayApplicants = acceptedApplicants.slice(0, 3);
  const totalApplicants = acceptedApplicants.length;
  const remainingCount = Math.max(0, totalApplicants - 3);

  return (
    <>
      {true && (
        <div
          className={`${styles.collabCard} ${styles.createdCard}`}
        >
          <div className={styles.statusRibbon}>Recruiting</div>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{codeData?.title?.length > 27 ? codeData?.title.slice(0, 27) + '...' : codeData?.title}</h3>
            {/* <span className={styles.cardStatus}>Recruiting</span> */}
          </div>
          <div className={styles.cardDetails}>
            <div className={styles.detailItem}>
              <span>📌 Roles Needed:</span>
              {codeData?.roles?.map((value, index) => (
                <React.Fragment key={index}>
                  <strong>
                    {value?.count}
                  </strong>
                </React.Fragment>
              ))}
            </div>
            <div className={styles.detailItem}>
              <span>📅 Duration:</span>
              <strong>{codeData?.duration}</strong>
            </div>
            {/* <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div> */}
            {/* {codeData?.roles?.map((value) => (
              <>
                <div className={styles.detailItem}>
                  <span>👥 Applicants:</span>
                  <strong>
                    {applicant.length}/{value?.count} Slots Filled
                  </strong>
                </div>
              </>
            ))} */}
            <div className={styles.detailItem}>
              <div className={styles.userInfo}>
                <div className={styles.userImage}>
                  <Image
                    src={session?.user?.image || "/default.png"}
                    alt={session?.user?.name || "Owner"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
                <span>Owner: {session?.user?.name || "Unknown"}</span>
              </div>
            </div>
            
            {/* New Applicants Section with User Images */}
            <div className={styles.detailItem}>
              <div className={styles.applicantsContainer}>
                <div className={styles.applicantsHeader}>
                  <FaUsers className={styles.applicantsIcon} />
                  <span>Applicants ({totalApplicants})</span>
                </div>
                <div className={styles.applicantsList}>
                  {displayApplicants.length > 0 ? (
                    <>
                      {displayApplicants.map((applicant, index) => (
                        <div key={index} className={styles.applicantAvatar}>
                          <Image
                            src={applicant.userid?.image || "/Default.png"}
                            alt={applicant.userid?.name || "Applicant"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ))}
                      {remainingCount > 0 && (
                        <div className={styles.remainingCount}>
                          +{remainingCount}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.noApplicants}>
                      No applicants yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <button className={`${styles.btn} ${styles.primaryBtn}`}
              onClick={handleOngoing}
            >
              Manage Collabs
            </button>
            <button className={`${styles.btn} ${styles.secondaryBtn}`}
              onClick={handleEdit}
            >
              <FaEdit /> Edit
            </button>
            <button className={`${styles.btn} ${styles.secondaryBtn}`}
              onClick={handleDelete}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OngoingCard;
