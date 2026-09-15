import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Interchange_result.module.scss";
import I_changeProfile from "../components/ide/I_changeProfile";
import { ContextProvider } from "../global/context";
import { useRouter } from "next/router";

function Interchange_result({
  session,
  showInterchange,
  codeData,
  mutatecodeData,
  elapsedTime,
  follow,
  setshowInterchange,subData,rankData
}) {
  const isUserIncluded = codeData?.subData?.submission?.some(
    (val) => val.userSub._id === session.user.id
  );
  const router = useRouter();
  const { ideCode } = router.query;

  const { previous, setPrevious } = useContext(ContextProvider);
 
  const fitrrr = previous.filter((value) => value?._id == ideCode);

  
  
  return (
    <>
      {/* <Navbar session={session}/> */}
      {showInterchange && (
        <div className={styles.main}>
          <div
            id={styles.mainCover}
            className={
              fitrrr[0]?.contestState === "previous"
               ? styles.width1 : styles.width2
            }
          >
            <div style={{width:"100%"}}>
              <div className={styles.top_bar}>
                {fitrrr[0]?.contestState === "previous" ? (
                  <p className={styles.text_head}>
                    Top 10 in Level {"add level here"} contest—your skills have
                    truly shone!
                  </p>
                ) : (
                  <p className={styles.text_head}>
                    Review solutions to boost your logic. Top 10 will be shown
                    after time.
                  </p>
                )}
              </div>
              {fitrrr[0]?.contestState === "previous" && 
             <></>
              }
            </div>
            <div className={styles.interchangeCardCover}>
              <I_changeProfile
                codeData={codeData}
                session={session}
                mutatecodeData={mutatecodeData}
                elapsedTime={elapsedTime}
                setshowInterchange={setshowInterchange}
                follow={follow}
                isUserIncluded={isUserIncluded}
                subData={subData}
                rankData={rankData}
                showInterchange={showInterchange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Interchange_result;
