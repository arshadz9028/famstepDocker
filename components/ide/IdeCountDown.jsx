import React, { useEffect, useState } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { FaRegCheckCircle } from "react-icons/fa";

function IdeCountDown() {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <>
      <div className={styles.wholeAction} id="wholeAction">
        <style jsx global>
          {`
            #mypic {
              width: 55rem;
              padding: 2rem;
              overflow: auto;
            }
            .check_p {
              margin-bottom: 1rem;
            }
            .check {
              width: 1.8rem;
              height: 1.8rem;
              color: #08529b;
              margin-bottom: -0.2rem;
            }

            @media (max-width: 591px) {
              #mypic {
                width: 100vw;
                height: 100dvh;
                border-radius: 0;
                padding: 1rem 0rem;
              }
              .check_p {
                margin-bottom: 0.5rem;
              }
            }
          `}
        </style>
        <div className={styles.mypic} id="mypic">
          <div className={styles.upper_sec}>
            <div className={styles.timeBar}>
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
                      strokeDashoffset: `${339 - (339 * timeLeft) / 30}`,
                    }}
                  />
                </svg>
                <div className={styles.Seconds}>
                  {" "}
                  {timeLeft} <br /> <span>Seconds</span>{" "}
                </div>
              </div>
            </div>

            <div style={{ color: "black", textAlign: "left" }}>
              <p className="check_p">
                <FaRegCheckCircle className="check" /> Famstep will announce the
                top 10 winners without disclosing <strong>scores</strong>  and <strong>Rank</strong>.
              </p>
              <p className="check_p">
                <FaRegCheckCircle className="check" /> If you are not selected
                this time, please try again next time.
              </p>
              <p className="check_p">
                <FaRegCheckCircle className="check" /> All participants, whether
                winners or not, should review the top 10 solutions and like only
                3 of them.
              </p>
              <p className="check_p">
                <FaRegCheckCircle className="check" /> If any of your liked
                solutions make it to the top 3, you will earn <strong style={{color:"#08529b"}}>Sense of judgment </strong>
                 points.
              </p>
            </div>
            {/* <pre> submitted </pre> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default IdeCountDown;
