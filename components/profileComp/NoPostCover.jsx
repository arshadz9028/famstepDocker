import React from "react";
import styles from "../../styles/aboutprofile.module.scss";
function NoPostCover({ NoPostMessage, NoPostIcons }) {
  return (
    <>
    <div className={styles.about_layout}>
      <div className={styles.aboutPost}>
        <div className={styles.NoPostCircle}>
          <div className={styles.NoPostIcons}>
            <NoPostIcons className={styles.ReactIcons} />
          </div>
        </div>
        <div className={styles.NoPostMessage}>
          <p>
            {/* {NoPostMessage === "About" || NoPostMessage === "Projects"
              ? "Not Updated Yet"
              : `No ${NoPostMessage} Available Yet`} */}
              {NoPostMessage}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default NoPostCover;
