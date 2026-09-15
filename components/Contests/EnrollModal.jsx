import React, { useEffect, useContext } from "react";
import { ContextProvider } from "../../global/context";
import styles from "../../styles/ModalTemplate.module.scss";
import axios from "axios";
import { useRouter } from "next/router";

function EnrollModal({ level }) {
  const router = useRouter();
  const { enrollModal, setEnrollModal, contestId } =
    useContext(ContextProvider);
  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (enrollModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [enrollModal]);

  const CloseModal = (e) => {
    if (e.target.id == "enrollMain") {
      setEnrollModal(false);
    }
  };
  const requestEnroll = async () => {
    await axios.put(`/api/code/userEnroll/?contestId=${contestId}`);
    router.push(`/me/contest/contest_details/?contestId=${contestId}?enroll`);
    // mutatecodeData();
    setEnrollModal(false);
  };
  return (
    <>
      {enrollModal && (
        <div
          className={styles.wholeAction}
          id="enrollMain"
          onClick={CloseModal}
        >
          <div className={styles.mypic}>
            <div className={styles.upper_sec}>
              <p className={styles.paragraph}>
                Fantastic! Ready to dive into the Level {level} contest? Click
                &apos;Yes&apos; to enroll and declare your readiness. Are you
                prepared to conquer?
              </p>
            </div>

            <div className={styles.icons_name} onClick={requestEnroll}>
              <div className={styles.name}>
                <p>Yes</p>
              </div>
            </div>
            <div
              className={styles.icons_name}
              onClick={() => setEnrollModal(false)}
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

export default EnrollModal;
