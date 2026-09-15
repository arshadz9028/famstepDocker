import React from "react";
import styles from "../styles/Scoreboard.module.scss";
import Image from "next/image";
function WinnersCard({ value, ranks, overAllRank, AllFollowers }) {
  return (
    <>
      <div className={styles.flex_left}>
        <div className={styles.card_with_name}>
          <div className={styles.leftImage_details}>
            <div className={styles.left_img} />
            <div className={styles.backgroundStrip_maintain}>
              <div className={styles.backgroundStrip} />
              <div className={styles.backgroundStrip} />
              <div className={styles.backgroundStrip} />
            </div>
            <div className={styles.circle_img} >
              <Image
                src={value?.userId.image}
                alt="winner"
                 fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 style={{
                  objectFit: "cover"
                }}
              />
            </div>
          </div>
          <div className={styles.left_details}>
            <div className={styles.nameAndTitle} >
              <p className={styles.name}>{value?.userId.name}</p>
              <p className={styles.title}>{value?.userId.designation}</p>
            </div>
            <div className={styles.score}>
              <p className={styles.score_level_p}>SCORE</p>
              <p className={styles.score_level_number}>{value?.score}</p>
            </div>
            <div className={styles.followers}>
              <div className={styles.detail_column}>
                {AllFollowers[0] ? (
                  <p className={styles.followers_count}>
                    {AllFollowers[0]?.followers.length}
                  </p>
                ) : (
                  <p className={styles.followers_count}>0</p>
                )}
                <p className={styles.followers_name}>followers</p>
              </div>
              {/* <div className={styles.detail_column}>
                <p className={styles.followers_count}>{overAllRank + 1}</p>
                <p className={styles.followers_name}>Rank</p>
              </div> */}
              <div className={styles.detail_column}  >
                <p className={styles.followers_count}>30</p>
                <p className={styles.followers_name}>praise</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.ltr_box}>
          <div className={styles.rank}>
            <h1>{ranks + 1}</h1>
          </div>
          <div className={styles.patti}></div>
        </div>
      </div>
    </>
  );
}

export default WinnersCard;
