import React, { useState, useContext } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { useRouter } from "next/router";
import axios from "axios";
function BlockDialoge({ setdialogBlock, mutateuserFetchMsg, otherUserId }) {
  const router = useRouter();
  const { message } = router.query;

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "closeBlockModel") {
      setdialogBlock(false);
    }
  };
  const queryPath = router.pathname.split("/")[1];
  const handleBlock = async () => {
    try {
    //   if (queryPath === "message") {
        await axios.post(
          `/api/profile/follow/blockUser?message=${otherUserId}`
        );
    //   } else {
        await axios.delete(
          `/api/profile/follow/followDelete/?followusername=${otherUserId}`
        ); // Sending a DELETE request to remove the followusername
    //   }
      mutateuserFetchMsg();
    } catch (error) {}
    setdialogBlock(false);
  };
  return (
    <>
      <div
        className={styles.wholeAction}
        id="closeBlockModel"
        onClick={closeModel}
      >
        <div className={styles.mypic}>
          <div className={styles.upper_sec}>
            <p>Are you sure you want to block? </p>
          </div>

          <div className={styles.icons_name} onClick={handleBlock}>
            <div className={styles.name}>
              <p style={{ color: "red" }}>Block</p>
            </div>
          </div>

          <div
            className={styles.icons_name}
            onClick={() => {
              setdialogBlock(false);
            }}
          >
            <div className={styles.name}>
              <p>Cancel</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlockDialoge;
