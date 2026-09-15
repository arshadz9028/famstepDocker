import React, { useState } from "react";
import Image from "next/image";
import styles from "../../styles/Scoreboard.module.scss";
import Leader from "../../assets/icons/Leader.png";
import ScoreCardProgress from "./ScoreCardProgress";
import ScoreCardProgressPoints from "./ScoreCardProgressPoints";
import ScoreCardProgressLevel from "./ScoreCardProgressLevel";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import axios from "axios";
import {
  useFollowerData,
  getPendingStatus,
  handleFollowRequest,
  handleCloseButton,
} from "../../utils/followerUtils";
async function fetchFollowers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

function ScoreCard({
  userData,
  num,
  overallData,
}) {
  const Router = useRouter()
  const pointsArray = overallData?.map((values) => values.points);
  const points = pointsArray?.flat(); // Flatten the array if needed

  const sum = points?.reduce((acc, value) => acc + value, 0);

  const levelProgress = ((100 - userData?.level) / 100) * 255;
  const pointsProgress = ((sum - userData?.points) / sum) * 280;
  const achievementsProgress = ((100 - userData?.achievements) / 100) * 255;
  
  
  const handleProf =async (id) =>{
    

      Router.push(`/profile/${id}`)
    
  }
  return (
    <>
        <section className={styles.scorecard_card} onClick={()=> handleProf(userData._id)}>
          <div className={styles.scorecard_card_maintain}>
            <div  >
              <div className={styles.upper_img}>
                <Image
                  alt="uppr"
                  src={userData?.background}
                   fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   style={{
                  objectFit: "cover"
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
                  objectFit: "cover"
                }}
                  priority
                  className={styles.myimage}
                />
              </div>
              <div className={styles.patti_rank}>
                <div className={styles.rank}>
                  <h1>{num + 1}</h1>
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
                rank={userData?.points}
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
2