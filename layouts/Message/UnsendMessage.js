import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { useRouter } from "next/router";
import axios from "axios";
import { ContextProvider } from "../../global/context";

function UnsendMessage({ setunsend }) {
  const { messageId } = useContext(ContextProvider);
  const Router = useRouter();
  const { message } = Router.query;

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "unsendModel") {
      setunsend(false);
    }
  };
  
  const handleUnsend = async () => {
    await axios.delete(`/api/message/unsendText?messageId=${messageId}`);
    setunsend(false);
  };
  return (
    <>
        <div className={styles.wholeAction} id="unsendModel" onClick={closeModel}>
          <div className={styles.mypic}>
            <div className={styles.upper_sec}>
              <p>Are you sure want to delete? </p>
            </div>
            <div className={styles.icons_name} onClick={handleUnsend}>
              <div className={styles.name}>
                <p style={{color:'red'}}>Delete</p>
              </div>
            </div>
            <div
              className={styles.icons_name}
              onClick={() => {
                setunsend(false);
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

export default UnsendMessage;
