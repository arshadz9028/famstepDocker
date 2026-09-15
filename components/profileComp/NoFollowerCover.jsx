import React from "react";
import styles from "../../styles/EditProfile.module.scss";

function NoFollowerCover({ NoPostIcons, NoPostTagLine, NoPostMessage }) {
  return (
    <>
      <div className={styles.about_layout}>
        <div className={styles.NoPostCircle}>
          <div className={styles.NoPostIcons}>
            <NoPostIcons className={styles.ReactIcons} />
          </div>
        </div>
        <div className={styles.NoPostMessage}>
          <p className={styles.NoPostTagLine1}>{NoPostTagLine}</p>
          <p className={styles.NoPostTagLine2}> {NoPostMessage}</p>
        </div>
      </div>
    </>
  );
}

export default NoFollowerCover;
