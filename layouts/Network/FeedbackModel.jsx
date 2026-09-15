import React, { useContext, useState } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { MdOutlineFeedback } from "react-icons/md";
import Link from "next/link";
import { ContextProvider } from "../../global/context";
import axios from "axios";

function FeedBackModel({
  setUpdateProfile,
  page,
  updateDetails,
  updateSkills,
  setEditDetail,
}) {
  const { setSkillModal } = useContext(ContextProvider);
  const [isClosing, setIsClosing] = useState(false);

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className == "wholeAction") {
      SkipFunction()
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
      await axios.put("/api/auth/updateFeedbackFlag");
      handleClose();
    } catch (error) { }
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
            font-size: 2rem;
            padding: 0rem 2rem;
            line-height: 3rem;
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
                  <MdOutlineFeedback
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>

                <p className="contestMessageContent">
                  We’d love to get your honest feedback
                </p>
              </div>
            </div>
          </div>
          {/* {page == "network" && updateDetails && ( */}
          <Link href="/feedback" target="_blank">
            <div
              className={styles.icons_name}
              style={{ background: "#08529B" }}
              onClick={() => {
                SkipFunction();
              }}
            >
              <div className={styles.name}>
                <p style={{ color: "white" }}>Visit Feedback Page</p>
              </div>
            </div>
          </Link>
          {/* )} */}
          {/* {page == "me" && updateDetails && (
            <div
              className={styles.icons_name}
              onClick={() => {
                setEditDetail(true);
                setUpdateProfile(false);
              }}
            >
              <div className={styles.name}>
                <p>Update</p>
              </div>
            </div>
          )}
          {page == "me" && updateSkills && (
            <div
              className={styles.icons_name}
              onClick={() => {
                setUpdateProfile(false);
                setSkillModal(true);
              }}
            >
              <div className={styles.name}>
                <p>Add skills</p>
              </div>
            </div>
          )} */}

          <div className={styles.icons_name} onClick={SkipFunction}>
            <div className={styles.name}>
              <p>Skip</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeedBackModel;
