import React from 'react'
import styles from "../../styles/contestMoreDetails.module.scss"

function ContestDetailsTab({toggleState, setToggleState, codeData }) {
  return (
    <>
      
      <div className={styles.content_center}>
              <div
                className={
                  toggleState === "About"
                    ? `  ${styles.active_tabs}`
                    : styles.tabs
                }
                onClick={(e) => {
                  setToggleState("About");
                  e.preventDefault();
                }}
              >
                About
                {toggleState === "About" ? (
                  <div className={styles.indicator} />
                ) : (
                  <div className={styles.indicator1} />
                )}
              </div>
              <div
                className={
                  toggleState === "Rule"
                    ? `   ${styles.active_tabs}`
                    : styles.tabs
                }
                onClick={(e) => {
                  setToggleState("Rule");
                  e.preventDefault();
                }}
              >
                Rule
                {toggleState === "Rule" ? (
                  <div className={styles.indicator} />
                ) : (
                  <div className={styles.indicator1} />
                )}
              </div>
             {codeData?.subData?.prize !== "" && <div
                className={
                  toggleState === "Prize"
                    ? `    ${styles.active_tabs} `
                    : styles.tabs
                }
                onClick={(e) => {
                  setToggleState("Prize");
                  e.preventDefault();
                }}
              >
                Prize
                {toggleState === "Prize" ? (
                  <div className={styles.indicator} />
                ) : (
                  <div className={styles.indicator1} />
                )}
              </div>}

            </div>

    </>
  )
}

export default ContestDetailsTab
