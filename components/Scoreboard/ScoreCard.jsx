import React from "react";
import Image from "next/image";
import styles from "../../styles/Scoreboard.module.scss";
import ScoreCardProgress from "./ScoreCardProgress";
import ScoreCardProgressPoints from "./ScoreCardProgressPoints";
import ScoreCardProgressLevel from "./ScoreCardProgressLevel";
import { useRouter } from "next/router";

function ScoreCard({ userData, num, overallData,rankUser }) {
  const Router = useRouter();
  const SkillsPoints = userData.skills[0].points;
  const pointsArray = overallData?.map((values) => values.skills[0].points);
  const points = pointsArray?.flat(); // Flatten the array if needed

  const sum = points?.reduce((acc, value) => acc + value, 0);

  const levelProgress = ((100 - userData?.level) / 100) * 255;
  const pointsProgress = ((sum - SkillsPoints) / sum) * 280;
  const achievementsProgress = ((100 - userData?.achievements) / 100) * 255;

  const handleProf = async (id) => {
    Router.push(`/profile/${id}`);
  };
  return (
    <>
      <section
        className={styles.scorecard_card}
        onClick={() => handleProf(userData._id)}
      >
        <div className={styles.scorecard_card_maintain}>
          <div>
            <div className={styles.upper_img}>
              <Image
                alt="uppr"
                src={userData?.background}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
                priority
                className={styles.myimage}
              />
            </div>
            <div className={styles.circleImg}>
              <Image
                alt="circle"
                src={userData?.image}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
                priority
                className={styles.myimage}
              />
            </div>
            <div className={styles.patti_rank}>
              <div className={styles.rank}>
                <h1>{rankUser}</h1>
              </div>
              <div className={styles.patti}>
                <h2>{userData?.name}</h2>
              </div>
            </div>
          </div>
          <div className={styles.circle_progressBar}>
            <ScoreCardProgressLevel
              rank={userData?.level}
              progress={levelProgress}
            />
            <ScoreCardProgressPoints
              rank={SkillsPoints}
              progress={pointsProgress}
            />
            <ScoreCardProgress
              rank={userData?.achievements}
              progress={achievementsProgress}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default ScoreCard;
