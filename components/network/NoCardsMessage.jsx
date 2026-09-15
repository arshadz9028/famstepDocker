import React from "react";
import styles from "../../styles/network.module.scss";

function NoCardsMessage({ MessageRectIcon, MessageContent ,addition,ContentAddition, MessageContentSecond }) {
  return (
    <>
      <div className={styles.contestMessageCover} >
        <div className={styles.contestMessage} id={addition==="addition" ? styles.addition : styles.additionSame} >
          <div className={styles.contestMessageIconCircle1} >
            <div className={styles.contestMessageIconCircle2} >
              <div className={styles.contestMessageIconCircle}>
                <div className={styles.contestMessageIcon}>
                  <MessageRectIcon style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
            </div>
          </div>
         {MessageContentSecond && <p className={styles.contestMessageContentHeading} >{MessageContentSecond}</p>}
          <p className={styles.contestMessageContent} style={{fontSize:MessageContentSecond? "2.1rem" : undefined}}  >{MessageContent}</p>
        </div>
      </div>
    </>
  );
}

export default NoCardsMessage;
