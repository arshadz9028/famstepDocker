import React, { useState, useContext } from "react";
import styles from "../../styles/Ide.module.scss";
import Image from "next/image";

function IdeLive({ liveUsers, setLiveUsers, codeData }) {
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "Ide_liveAction") {
      setLiveUsers(false);
    }
  };
  return (
    <>
      {liveUsers && (
        <div
          className={styles.liveAction}
          id="Ide_liveAction"
          onClick={closeModel}
        >
          <div className={styles.messAction}>
            {codeData?.subData?.participants.map((user, index) => {
              return (
                <div className={styles.dcxs} key={user.user.id}>
                  <div className={styles.search_dp}>
                    <Image
                      src={user.user.image}
                      alt="userImage"
                      priority
                       fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       style={{
                  objectFit: "cover"
                }}
                    />
                  </div>

                  <div className={styles.text_btn}>
                    <div className={styles.search_name}>
                      <p>{user.user.name}</p>
                    </div>
                    <div className={styles.search_id}>
                      <p>{user.user.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default IdeLive;
