import React, {useEffect } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import axios from "axios";

function AboutDialoge({
  expAction,
  setexpAction,
  setEditExp,
  expId,
  mutateuserFetchData,
  EduAction,
  setEduAction,
  setEditEdu,
  eduId,
  proAction,
  setAddProj,addProj,
  setproAction,projId
}) {
  


  /* control experience */
  const closeModel = (e) => {
    const id = e.target.getAttribute("id");
    if (id === "wholeActionEdu") {
      setexpAction(false);
      setEduAction(false);
    }
  };

  const deleteExp = async () => {
    try {
      await axios.delete(`/api/user/editExperience/?exp=${expId}`);
      mutateuserFetchData();
    } catch (error) {}
    setexpAction(false);
  };

  const deleteEdu = async () => {
    try {
      await axios.delete(`/api/user/editEducation/?eduId=${eduId}`);
      mutateuserFetchData();
    } catch (error) {}
    setEduAction(false);
  };
  
  const deleteProject = async () => {
    try {
      await axios.delete(`/api/user/addProjectrience/?projId=${projId}`);
      mutateuserFetchData();
    } catch (error) {}
    setproAction(false);
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (expAction || EduAction || proAction) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [expAction, EduAction ,proAction ]);

  return (
    <>
      {expAction && (
        <div className={styles.wholeAction} id="wholeActionEdu" onClick={closeModel}>
          <div className={styles.mypic} >
            <div className={styles.icons_name} onClick={deleteExp}>
              <div className={styles.name}>
                <p>Delete</p>
              </div>
            </div>

            <div className={styles.icons_name}
              onClick={() => {
                setEditExp(true);
                setexpAction(false);
              }}
            >
              <div className={styles.name}>
                <p>Edit</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {EduAction && (
        <div className={styles.wholeAction} id="wholeActionEdu" onClick={closeModel}>
          <div className={styles.mypic} >
            <div className={styles.icons_name} onClick={deleteEdu}>
              <div className={styles.name}>
                <p>Delete</p>
              </div>
            </div>

            <div
              className={styles.icons_name}
              onClick={() => {
                setEditEdu(true);
                setEduAction(false);
              }}
            >
              <div className={styles.name}>
                <p>Edit</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {proAction && (
        <div className={styles.wholeAction} id="wholeActionEdu" onClick={()=> setproAction(false)}>
          <div className={styles.mypic}>
            <div className={styles.icons_name} onClick={deleteProject}>
              <div className={styles.name}>
                <p>Delete</p>
              </div>
            </div>

            <div className={styles.icons_name}
              onClick={() => {
                setAddProj(!addProj);
                setproAction(false);
              }}
            >
              <div className={styles.name}>
                <p>Edit</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AboutDialoge;
