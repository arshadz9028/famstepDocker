import React, { useContext, useEffect } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { useRouter } from "next/router";
import axios from "axios";
import { ContextProvider } from "../../global/context";

function SkillDeleteDialogue({
  setdialogDelete,
  dialogDelete,
  skillId,
  mutatefollowerData,
}) {
  const { setMessagesend } = useContext(ContextProvider);

  const router = useRouter();
  const { message } = router.query;
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "deleteModel") {
      setdialogDelete(false);
    }
  };

  const handleDelete = async () => {
    try {
      const skillDeleted = await axios.delete(`/api/auth/signup/${skillId}` );
      mutatefollowerData()
    } catch (error) {
      console.error(error);
    }
    setdialogDelete(false);
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (dialogDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [dialogDelete]);

  return (
    <>
      <div className={styles.wholeAction} id="deleteModel" onClick={closeModel}>
        <div className={styles.mypic}>
          <div className={styles.upper_sec}>
            <p>Are you sure you want to delete this skill?</p>
            <p>Once deleted, your score and rank</p>
            <p> will be lost.</p>
          </div>

          <div className={styles.icons_name} onClick={handleDelete}>
            <div className={styles.name}>
              <p style={{ color: "red" }}>Delete</p>
            </div>
          </div>

          <div
            className={styles.icons_name}
            onClick={() => {
              setdialogDelete(false);
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

export default SkillDeleteDialogue;
