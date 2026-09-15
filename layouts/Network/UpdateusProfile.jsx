import React, { useContext, useState } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { BsExclamationCircle } from "react-icons/bs";
import Link from "next/link";
import { ContextProvider } from "../../global/context";
import axios from "axios";

function ComingSoonModel({
  setUpdateProfile,
  page,
  updateDetails,
  updateSkills,
  setEditDetail,
}) {
  const { setSkillModal } = useContext(ContextProvider);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "wholeAction") {
      SkipFunction();
    }
  };

  const handleClose = async () => {
    setIsClosing(true);
    setTimeout(() => {
      setUpdateProfile(false);
    }, 300);
  };

  const SkipFunction = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        axios.put("/api/auth/signup/updateProfile"),
        axios.put("/api/auth/updateFeedbackFlag")
      ]);
      handleClose();
    } catch (error) {
      console.error("Error updating profile and feedback flag:", error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClick = () => {
    SkipFunction();
    if (page === "network") {
      setSkillModal(true);
    }
  };

  return (
    <>
      <div
        className={`${styles.wholeAction} ${isClosing ? styles.closing : ''}`}
        onClick={closeModel}
        id="wholeAction"
      >
        <style jsx global>{`
          #mypic {
            width: 46rem;
          }
          #upper_sec {
            padding: 0rem;
          }
          .contestMessageIconCircle1 {
            width: 8rem;
            height: 8rem;
          }
          .contestMessageContent {
            margin-top: 2rem;
            font-weight: 500;
            font-size: 1.8rem;
            padding: 0rem 2rem;
            line-height: 2.5rem;
            text-align: center;
          }
          @media (max-width: 680px) {
            #mypic {
              width: 95vw;
            }
          }
        `}</style>
        <div className={`${styles.mypic} ${isClosing ? styles.closing : ''}`} id="mypic">
          <div className={styles.upper_sec} id="upper_sec">
            <div className={styles.contestMessageCover}>
              <div className={styles.contestMessage}>
                <div className="contestMessageIconCircle1">
                  <BsExclamationCircle
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>

                <p className="contestMessageContent">
                  Complete your profile and add your skills to get noticed by
                  employers!
                </p>
              </div>
            </div>
          </div>
          
          {page === "network" && updateDetails && (
            <Link href="/me/settings">
              <div
                className={styles.icons_name}
                style={{ 
                  background: "#08529B",
                  opacity: isLoading ? 0.7 : 1 
                }}
                onClick={SkipFunction}
              >
                <div className={styles.name}>
                  <p style={{ color: "white" }}>Update</p>
                </div>
              </div>
            </Link>
          )}
          
          {page === "network" && updateDetails && (
            <Link href="/feedback">
              <div
                className={styles.icons_name}
                onClick={handleUpdateClick}
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                <div className={styles.name}>
                  <p style={{ color: "#044280" }}>Give Feedback</p>
                </div>
              </div>
            </Link>
          )}
          
          {page === "me" && updateDetails && (
            <div
              className={styles.icons_name}
              onClick={() => {
                setEditDetail(true);
                handleClose();
              }}
            >
              <div className={styles.name}>
                <p>Update</p>
              </div>
            </div>
          )}
          
          {page === "me" && updateSkills && (
            <div
              className={styles.icons_name}
              onClick={() => {
                handleClose();
                setSkillModal(true);
              }}
            >
              <div className={styles.name}>
                <p>Add skills</p>
              </div>
            </div>
          )}

          <div 
            className={styles.icons_name} 
            onClick={SkipFunction}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            <div className={styles.name}>
              <p>Skip</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComingSoonModel;
