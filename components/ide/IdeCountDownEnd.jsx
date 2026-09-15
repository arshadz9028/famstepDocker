import React, { useEffect, useState,useContext } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { FaRegCheckCircle } from "react-icons/fa";
import { ContextProvider } from "../../global/context";
import { useRouter } from "next/router";
function IdeCountDownEnd({ideCode}) {
  const [timeLeft, setTimeLeft] = useState(10);
  const router = useRouter()
 const {setpostModelLoad} = useContext(ContextProvider);
  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);
    // setpostModelLoad(false)
    // router.push(`/scoreboard/?stage=${ideCode}`);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <>
      <div className={styles.wholeAction} id="wholeAction">
        <style jsx global>
          {`
            #mypic {
              width: 50rem;
              padding: 1rem;
              overflow: auto;
            }
            .check_p {
              color: black;
              font-size: 2rem;
              font-weight: 500;
            }
            .check {
              width: 2.5rem;
              height: 2.5rem;
              color: #08529b;
              margin-bottom: -0.5rem;
            }

            @media (max-width: 591px) {
              #mypic {
                padding: 0rem;
                width: 90vw;
              }

              .check_p {
                font-size: 1.8rem;
              }
              .check {
                width: 1.8rem;
                height: 1.8rem;
                margin-bottom: -0.2rem;
              }
            }
          `}
        </style>
        <div className={styles.mypic} id="mypic">
          <div className={styles.upper_sec}>
            <div
              className={styles.timeBar}
              style={{ margin: "0rem auto 2rem" }}
            >
              <div className={styles.circle}>
                <div className={`${styles.dots} ${styles.sec_dot}  `} />
                <svg>
                  <circle cx="55" cy="55" r="55" />
                  <circle
                    cx="55"
                    cy="55"
                    r="55"
                    id="ss"
                    style={{
                      strokeDashoffset: `${339 - (339 * timeLeft) / 10}`,
                    }}
                  />
                </svg>
                <div className={styles.Seconds}>
                  {timeLeft} <br /> <span>Seconds</span>
                </div>
              </div>
            </div>

            <p className="check_p">
              <FaRegCheckCircle className="check" /> Excited to reveal the top
              10 ranked winners! Your talent and dedication have earned you
              these ranks. Congrats to all!
            </p>

            {/* <pre> submitted </pre> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default IdeCountDownEnd;
