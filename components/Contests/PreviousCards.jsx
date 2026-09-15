import React from "react";
import Image from "next/image";
import styles from "../../styles/contest.module.scss";
import { format ,parse} from "date-fns";
import { ContextProvider } from "../../global/context";
import { useContext } from "react";
import { useRouter } from "next/router";
function UpcomingCard({ codeData,fetchData }) {
  const { setRegisterModal,setContestId } = useContext(ContextProvider);
  const contestStartDate = `${codeData?.startDate} ${codeData?.startTime}`;
  const router = useRouter()
  // const formattedContestStartDate = format(contestStartDate,
  //   "MMM dd yyyy HH:mm",
  //   new Date()
  // );
  const handleOngoing = () =>{
    router.push(`/projectTask/${codeData.id}`)
  }
  return (
    <>
       <div className={styles.contestCard} style={{height:"30rem"}} onClick={handleOngoing}>
        <div className={styles.imageUpperCover}>
          <div className={styles.imageUpper} />
          <div className={styles.contestImageCover}>
            <Image
              className={styles.contestImage}
              src={'/as.jpg'}
              alt="contestImage"
               fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               style={{
                  objectFit: "cover"
                }}
            />
          </div>
        </div>
        <p className={styles.contestName}> {codeData?.title}</p>
        {/* <div className={styles.belowPartCover} style={{height:"auto"}} >
          <pre className={styles.endsIn}>Ended</pre>
          <p className={styles.time} style={{padding:"1rem", textAlign:"center"}} >This contest has been ended</p>
          
        </div> */}
      </div>
    </>
  );
}

export default UpcomingCard;
