import React, { useState, useContext, useEffect } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { ContextProvider } from "../../global/context";
import { useRouter } from "next/router";
import Interchange_result from "../Interchange_result";
import { PiTimerLight } from "react-icons/pi";
import { RiEmotionSadLine } from "react-icons/ri";
import axios from "axios";
function TimeUp({
  codeData,
  Edate,
  session,
  elapsedTime,
  showInterchange,
  setshowInterchange,
  follow,
  mutatecodeData,
  noTime,
  setNoTime,
  setpreModelLoad,
  filteredContest,
}) {
  const { previousRef, lastMinutes, setlastMinutes } =
    useContext(ContextProvider);
  const Router = useRouter();
  //contest id
  const { ideCode } = Router.query;

  const [timeUps, setTimeUps] = useState(false);

  const dateNow = new Date();
  const difference = Edate - dateNow;
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24) === 0;
  const min = Math.floor((difference / 1000 / 60) % 60) === 0;
  const sec = Math.floor((difference / 1000) % 60) === 30;

  const plHandle = filteredContest?.submission?.some(
    (val) => val.userSub === session.user.id
  );
  //check if user has submitted or not
  const playHandle = codeData?.subData?.submission?.some(
    (val) => val.userSub === session.user.id
  );
  useEffect(() => {
    //time warning
    // if user will not sumbit
    if (
      filteredContest?.contestState === "previous" &&
      (!plHandle || !filteredContest?.submission)
    ) {
      setNoTime(true);
    }
    if (hours && min && sec) {
      setlastMinutes(true);
    }

    if (hours && min && sec && !playHandle) {
      setTimeUps(true); // this will be true if not submitted and 30 sec left
    }
  }, [hours, min, sec, playHandle, filteredContest, plHandle]);
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "wholeAction") {
      setTimeUps(false);
    }
  };
  const  handleTimeup = async   () => {
      setNoTime(false);
      setpreModelLoad(true);
      try {
        await axios.post(`/api/code/codePostModel/?stage=${ideCode}`);
      } catch (error) {
        console.error("Error posting model data:", error);
      }
      mutatecodeData()
    }
  return (
    <>
      <Interchange_result
        session={session}
        codeData={codeData}
        setshowInterchange={setshowInterchange}
        showInterchange={showInterchange}
        mutatecodeData={mutatecodeData}
        elapsedTime={elapsedTime}
        follow={follow}
      />
      {timeUps && (
        <div
          className={styles.wholeAction}
          id="wholeAction"
          onClick={closeModel}
        >
          <div className={styles.mypic}>
            <div className={styles.upper_sec}>
              <PiTimerLight
                style={{
                  width: "8rem",
                  height: "8rem",
                  color: "#D9D9D9",
                  margin: "auto",
                }}
              />
              <p style={{ color: "red" }}>You have only 30 seconds left, </p>
              <p> please submit the code </p>
            </div>
            <div
              className={styles.icons_name}
              onClick={() => {
                setTimeUps(false);
              }}
            >
              <div className={styles.name}>
                <p>Close</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {noTime && (
        <div className={styles.wholeAction} id="wholeAction">
          <div className={styles.mypic}>
            <div className={styles.upper_sec}>
              <RiEmotionSadLine
                style={{
                  width: "8rem",
                  height: "8rem",
                  color: "#D9D9D9",
                  margin: "auto",
                }}
              />
              <p>Your time is Up!!</p>
              <p>Your code is not submitted</p>
            </div>
            <div
              className={styles.icons_name}
              onClick={
                handleTimeup           
              }
            >
              <div className={styles.name}>
                <p>Check winners</p>
              </div>
            </div>
            <div
              className={styles.icons_name}
              onClick={() => {
                setNoTime(false);
                Router.push(`/home`);
              }}
            >
              <div className={styles.name}>
                <p>Go to Home</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TimeUp;
