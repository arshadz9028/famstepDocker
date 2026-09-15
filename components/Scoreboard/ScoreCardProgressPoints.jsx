import React from "react";
import styles from "../../styles/Scoreboard.module.scss";

function ScoreCardProgressPoints(props) {
  return (
    <>
      <div className={styles.progress_title}>
        <p
          className={ styles.progress_titlePBig }
        >
          Points
        </p>
        <div className={styles.progress_circle}>
          <div className={styles.outerBig}>
            <div className={styles.innerBig}>
              <p>{props.rank}</p>
            </div>
          </div>
          {/* <div className={ styles.dotsBig }/> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="100px"
            height="100px"
          >
            <circle className="circle1" strokeLinecap="round" />
          </svg>

          <style jsx >
            {`
              .circle1 {
                cx: 50.5;
                cy: 50.5;
                r: 44.5;
                fill: none;
                stroke: #08529b;
                stroke-width: 0.9rem;
                stroke-dasharray: 280;
                stroke-dashoffset: ${props.progress};
                transition: all 0.5s;
                {/* animation: Points 2s linear forwards; */}
              }

              {/* @keyframes Points {
                100% {
                  stroke-dashoffset:  ${props.progress};
                }
              } */}

              @media only screen and (min-width: 971px) and (max-width: 1192px) {
                .circle1 {
                  cx: 41;
                  cy: 41;
                  r: 36;
                }
              }
            `}
          </style>
        </div>
      </div>
    </>
  );
}

export default ScoreCardProgressPoints;
