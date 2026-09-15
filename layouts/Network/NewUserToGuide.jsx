import React from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { FaUserLock } from "react-icons/fa";
import Link from "next/link";

function ComingSoonModel({ setScoreToggle, selected, mutateuserData }) {
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className == "wholeAction") {
      setScoreToggle(selected);
    }
  };

  return (
    <>
      <div className={styles.wholeAction} onClick={closeModel} id="wholeAction">
        <style jsx global>{`
          #mypic {
            width: 46rem;
          }
          #upper_sec {
            padding: 0rem;
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
        <div className={styles.mypic} id="mypic">
          <div className={styles.upper_sec} id="upper_sec">
            <div className={styles.contestMessageCover}>
              <div className={styles.contestMessage}>
                <div className={styles.contestMessageIconCircle1}>
                  <div className={styles.contestMessageIconCircle2}>
                    <div className={styles.contestMessageIconCircle}>
                      <div className={styles.contestMessageIcon}>
                        <FaUserLock style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="contestMessageContent">
                  Your competition level must be 15 to create a learning group.
                  In the meantime, join an existing group and track your
                  progress as you unlock the path to level 15.
                </p>
              </div>
            </div>
          </div>
          <Link href="/me/contest">
            <div
              className={styles.icons_name}
              style={{ background: "#08529B" }}
            >
              <div className={styles.name}>
                <p style={{ color: "white" }}>Check Contest</p>
              </div>
            </div>
          </Link>
          <div
            className={styles.icons_name}
            onClick={() => {
              setScoreToggle(selected);
            }}
          >
            <div className={styles.name}>
              <p>Close</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComingSoonModel;
