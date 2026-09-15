import React from "react";
import styles from "../../styles/contestMoreDetails.module.scss";

function ContestAbout({ toggleState, setToggleState, codeData }) {
  return (
    <>
      {toggleState === "About" && (
        <div className={styles.contestDetails}>
          <p className={styles.contestDetailsHeading}>
          About the Contest:
          </p>
          <pre className={styles.contestAbout}>{codeData?.subData?.about}</pre>
        </div>
      )}

      {toggleState === "Rule" && (
        <div className={styles.contestDetails}>
          <p className={styles.contestDetailsHeading}>
          Rules:
          </p>
          <pre className={styles.contestAbout}>{codeData?.subData?.rule}</pre>
        </div>
      )}

      {toggleState === "Prize" && (
        <div className={styles.contestDetails}>
          <p className={styles.contestDetailsHeading}>
          Prize:
          </p>
          <pre className={styles.contestAbout}>{codeData?.subData?.prize}</pre>
        </div>
      )}
    </>
  );
}

export default ContestAbout;
