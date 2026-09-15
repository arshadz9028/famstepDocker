import React from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { useRouter } from "next/router";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";

function PostReport({ setdialogeReport, tDotId, userId }) {
  const router = useRouter();

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "blockAction") {
      setdialogeReport(false);
    }
  };

  const handleReport = async (reportReason) => {
    
    try {
       await axios.post(`/api/report/postReport`, {
        message: tDotId,
        reason: reportReason,
        userId: userId,
      });

    } catch (error) {
      // Handle errors here
      console.error("Error occurred while posting report:", error);
    }

    setdialogeReport(false);
  };

  return (
    <>
      <div className={styles.wholeAction} id="blockAction" onClick={closeModel}>
        <div className={styles.mypic}>
        <div className={styles.closeButton}>
            <p className={styles.upper_sec}>Choose a reason for your report</p>
            <AiOutlineCloseCircle
              className={styles.CloseCircleButton}
              onClick={() => setdialogeReport(false)}
            />
          </div>

          <div
            className={styles.icons_name}
            onClick={() => handleReport("Sexual content/harassment")}
          >
            <div className={styles.name}>
              <p>Sexual content/harassment</p>
            </div>
          </div>
          <div
            className={styles.icons_name}
            onClick={() => handleReport("Threatening or violent behavior")}
          >
            <div className={styles.name}>
              <p>Threatening or violent behavior</p>
            </div>
          </div>
          <div
            className={styles.icons_name}
            onClick={() => handleReport("Bullying or personal attacks")}
          >
            <div className={styles.name}>
              <p>Bullying or personal attacks</p>
            </div>
          </div>
          <div
            className={styles.icons_name}
            onClick={() => handleReport("Spam or misleading information")}
          >
            <div className={styles.name}>
              <p>Spam or misleading information</p>
            </div>
          </div>
          <div
            className={styles.icons_name}
            onClick={() => handleReport("Hate speech or offensive content")}
          >
            <div className={styles.name}>
              <p>Hate speech or offensive content</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostReport;
