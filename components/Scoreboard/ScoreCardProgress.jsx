import React from "react";
import styles from "../../styles/Scoreboard.module.scss";

function ScoreCardProgressLevel(props) {
  return (
    <>
      <div className={styles.progress_title}>
        <p
          className={
            props.title == "Points"
              ? styles.progress_titlePBig
              : styles.progress_titleP
          }
        >
          Achivements
        </p>
        <div className={styles.progress_circle}>
          <div className={styles.outer}>
            <div className={styles.inner}>
              <p>{props.rank}</p>
            </div>
          </div>
          {/* <div className={ styles.dots} /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="100px"
            height="100px"
          >
            <circle className="circleSmall" strokeLinecap="round" />
          </svg>

          <style jsx>
            {`
              .circleSmall {
                cx: 45;
                cy: 45;
                r: 40;
                fill: none;
                stroke: #08529b;
                stroke-width: 0.9rem;
                stroke-dasharray: 255;
                stroke-dashoffset: ${props.progress};
                transition: all 0.5s;
                 {
                  /* animation: achievements 2s linear forwards; */
                }
              }
               {
                /* @keyframes achievements {
                100% {
                  stroke-dashoffset: ${props.progress};
                }
              } */
              }

              @media only screen and (min-width: 971px) and (max-width: 1192px) {
                .circleSmall {
                  cx: 37;
                  cy: 36;
                  r: 32;
                }
              }
            `}
          </style>
        </div>
      </div>
    </>
  );
}

export default ScoreCardProgressLevel;
