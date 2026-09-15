import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "../../styles/Scoreboard.module.scss";
import { useRouter } from "next/router";
import { BsArrowLeftShort } from "react-icons/bs";
import axios from "axios";
import useSWR from "swr";
async function fetchLevel(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

function ScoreTab(props) {
  const [scoreToggle, setScoreToggle] = useState(props.selected);
  const [open, setOpen] = useState(true);
  const mobileTabRef = useRef();
  const router = useRouter();
  // Added by Arshad
  const {
    data: codeData,
    mutate: mutatecodeData,
    error: UserDataError,
  } = useSWR(`/api/code/codeLevel`, fetchLevel);

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

  return (
    <>
      <section className={styles.score_tabs}>
        <div className={styles.tabs_controller}>
          {props.pages != "Winners" && props.pages != "Friends" ? (
            <div
              className={styles.tabs_button}
              style={{ padding: "0px 16px" }}
              onClick={() => {
                router.push(`/scoreboard?stage=${codeData?.subData?._id}`);
             
              }}
            >
              <BsArrowLeftShort
                className={styles.net_icons}
                style={{ width: "4rem", height: "4rem" }}
              />
            </div>
          ) : (
              <div
                className={
                  scoreToggle === props.pages
                    ? `${styles.tabs_button1} , ${styles.tabs_button_hover} `
                    : styles.tabs_button
                }
                onClick={() => {
                  setScoreToggle(props.pages);
                  router.push(`/scoreboard?stage=${codeData?.subData?._id}`);
                }}
              >
                <pre>{props.pages}</pre>
              </div>
          )}

          <Link href={props.scorecardLink}>
            <div
              className={
                scoreToggle === props.scorecard
                  ? `${styles.tabs_button1} , ${styles.tabs_button_hover} `
                  : styles.tabs_button
              }
              onClick={() => {
                setScoreToggle(props.scorecard);
              }}
            >
              <pre>{props.scorecard}</pre>
            </div>
          </Link>

          <Link href={props.groupsLink}>
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
          </Link>

          {props.earning ? (
            <Link href={props.earningLink}>
              <div
                className={
                  scoreToggle === props.earning
                    ? `${styles.tabs_button1} , ${styles.tabs_button_hover} `
                    : styles.tabs_button
                }
                onClick={() => {
                  setScoreToggle(props.earning);
                }}
              >
                <pre>{props.earning}</pre>
              </div>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  );
}

export default ScoreTab;
