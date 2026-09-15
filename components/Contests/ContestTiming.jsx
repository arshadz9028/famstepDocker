import React, { useState, useContext, useEffect } from "react";
import styles from "../../styles/contestMoreDetails.module.scss"
import { format, parse, differenceInMinutes, isValid } from "date-fns";

function ContestTiming({MdOutlineComputer,codeData}) {
 

  const Sdate = new Date(codeData?.subData?.combinedStart);
  const contestStartDate = isValid(Sdate)
    ? format(Sdate, "yyyy-MM-dd HH:mm")
    : "Invalid Date";
  const Edate = new Date(codeData?.subData?.combinedEnd);
  const contestEndDate = isValid(Edate)
    ? format(Edate, "yyyy-MM-dd HH:mm")
    : "Invalid Date";



  const startDate = parse(
    contestStartDate,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const endDate = parse(
    contestEndDate,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const differenceInMinutesValue = differenceInMinutes(
    endDate,
    startDate
  );




  return (
    <>
      <div className={styles.contestTiming}>
              <div className={styles.startOn}>
                <p className={styles.heading}>START ON: </p>
                <p className={styles.contestData}> 
                {contestStartDate} IST</p>

              </div>
              <div className={styles.level}>
                <p className={styles.heading1}>LEVEL {codeData?.subData?.stage} </p>
                <p className={styles.contestData}> <span> <MdOutlineComputer className={styles.contestCom} /> </span>  Online</p>

              </div>
              <div className={styles.endsOn}>
                <p className={styles.heading}>ENDS ON</p>
                <p className={styles.contestData}>
                {contestEndDate} IST</p>
              </div>

            </div>
    </>
  )
}

export default ContestTiming
