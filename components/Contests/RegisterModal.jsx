import React, { useState, useEffect, useContext } from "react";
import { ContextProvider } from "../../global/context";
import styles from "../../styles/ModalTemplate.module.scss";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

function RegisterModal({ level, upcomingData, session }) {
  const router = useRouter();
  const { registerModal, setRegisterModal, contestId } =
    useContext(ContextProvider);
  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (registerModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [registerModal]);

  const CloseModal = (e) => {
    if (e.target.id == "enrollMain") {
      setRegisterModal(false);
    }
  };
  const requestRegister = async () => {
    await axios.put(`/api/code/userEnroll/?contestId=${contestId}`);
    router.push(`/me/contest/contest_details/?contestId=${contestId}`)
    setRegisterModal(false);
  };

  return (
    <>
      {registerModal && (
        <div
          className={styles.wholeAction}
          id="enrollMain"
          onClick={CloseModal}
        >
          <div className={styles.mypic}>
            <div className={styles.upper_sec}>
              <p className={styles.paragraph}>
                Excited to begin? Click &apos;Yes&apos; to Register in the Level{" "}
                {level} contest. Are you ready to accept the challenge?
              </p>
            </div>

              <div className={styles.icons_name} onClick={requestRegister} >
                <div className={styles.name}>
                  <p>Yes</p>
                </div>
              </div>

            <div
              className={styles.icons_name}
              onClick={() => setRegisterModal(false)}
            >
              <div className={styles.name}>
                <p>No</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RegisterModal;
