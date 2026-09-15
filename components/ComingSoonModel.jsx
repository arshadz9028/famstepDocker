import React, { useContext } from "react";
import styles from "../styles/ModalTemplate.module.scss";
import { ContextProvider } from "../global/context";
import { GrLaunch } from "react-icons/gr";

function ComingSoonModel() {
  const { setSwitchAccount } = useContext(ContextProvider);

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className == "wholeAction") {
      setSwitchAccount(false);
    }
  };

  return (
    <>
      <div className={styles.wholeAction} onClick={closeModel} id="wholeAction">
        <style jsx global>{`
          #mypic {
            width: 55rem;
          }
          #upper_sec {
            padding: 0rem;
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
                        <GrLaunch style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                  </div>
                </div>
                <p className={styles.contestMessageContentHeading}>
                  LAUNCHING SOON
                </p>
                <p className={styles.contestMessageContent}>
                  The page is under construction
                </p>
              </div>
            </div>
          </div>
          <div
            className={styles.icons_name}
            onClick={() => {
              setSwitchAccount(false);
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
