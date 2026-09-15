import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "../../styles/Scoreboard.module.scss";
import { useRouter } from "next/router";
import { BsArrowLeftShort } from "react-icons/bs";
import CreateGroup from "./CreateGroup";
import NewUserToGuide from "./NewUserToGuide";

function NetworkTab(props) {
  const [scoreToggle, setScoreToggle] = useState(props.selected);
  const [open, setOpen] = useState(true);
  const mobileTabRef = useRef();
  const router = useRouter();

  // Added by Arshad

  useEffect(() => {
    const closeMobileTab = (event) => {
      if (event.target.id !== "side_barId") {
        if (
          mobileTabRef.current &&
          !mobileTabRef.current.contains(event.target)
        ) {
          setOpen(true);
        }
      }
    };
    document.addEventListener("click", closeMobileTab);
    return () => {
      document.removeEventListener("click", closeMobileTab);
    };
  }, [open]);

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (scoreToggle === "NewGroup" || scoreToggle === "NewUser") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [scoreToggle === "NewGroup" || scoreToggle === "NewUser"]);

  return (
    <>
      {scoreToggle === "NewGroup" && (
        <CreateGroup
          setScoreToggle={setScoreToggle}
          selected={props.selected}
          mutateuserData={props.mutateuserData}
        />
      )}
      {scoreToggle === "NewUser" && (
        <NewUserToGuide
          setScoreToggle={setScoreToggle}
          selected={props.selected}
          mutateuserData={props.mutateuserData}
        />
      )}

      <section className={styles.score_tabs}>
        <div className={styles.tabs_controller}>
          {props.pages != "Community" ? (
            <Link href={props.pageLink}>
              <div
                className={styles.tabs_button}
                style={{ padding: "0px 16px" }}
              >
                <BsArrowLeftShort
                  className={styles.net_icons}
                  style={{ width: "4rem", height: "4rem" }}
                />
              </div>
            </Link>
          ) : (
            <Link href={props.pageLink}>
              <div
                className={
                  scoreToggle === "Community"
                    ? `${styles.tabs_button1} , ${styles.tabs_button_hover} `
                    : styles.tabs_button
                }
                onClick={() => {
                  setScoreToggle("Community");
                }}
              >
                <p>Community</p>
              </div>
            </Link>
          )}

          <Link href={props.SuggestedLink}>
            <div
              className={
                scoreToggle === props.Suggested
                  ? `${styles.tabs_button1} , ${styles.tabs_button_hover} `
                  : styles.tabs_button
              }
              onClick={() => {
                setScoreToggle(props.Suggested);
              }}
            >
              <pre className={styles.net_iconsP}>{props.Suggested}</pre>
            </div>
          </Link>

          {/* <Link href={props.groupsLink}>
            <div
              className={
                scoreToggle === props.groups
                  ? `${styles.tabs_button1} , ${styles.tabs_button_hover} `
                  : styles.tabs_button
              }
              onClick={() => {
                setScoreToggle(props.groups);
              }}
            >
              <pre>{props.groups}</pre>
            </div>
          </Link> */}

          {props.likeMinded === "Like-minded people" ? (
            <Link href={props.likeMindedLink}>
              <div
                className={
                  scoreToggle === props.likeMinded
                    ? `${styles.tabs_button1} , ${styles.tabs_button_hover} `
                    : styles.tabs_button
                }
                onClick={() => {
                  setScoreToggle(props.likeMinded);
                }}
              >
                <pre>{props.likeMinded}</pre>
              </div>
            </Link>
          ) : (
            <div
              className={
                scoreToggle === "NewGroup"
                  ? `${styles.tabs_button1} , ${styles.tabs_button_hover} `
                  : styles.tabs_button
              }
              onClick={() => {
                if (props?.session?.user?.level >= 15) {
                  setScoreToggle("NewGroup");
                } else {
                  setScoreToggle("NewUser");
                }
              }}
            >
              <pre>{props.likeMinded}</pre>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default NetworkTab;
