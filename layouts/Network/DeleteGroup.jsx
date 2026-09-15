import React, { useState, useContext } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { useRouter } from "next/router";
import axios from "axios";

function DeleteGroup({ setdialogDelete, admin }) {
  const router = useRouter();
  const { groups } = router.query;
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "networkModel_deleteAction__Eo_me") {
      setdialogDelete(false);
    }
  };
  const leaveGrp = async () => {
    try {
      await axios.delete(`/api/group/leaveGroup/?groups=${groups}`);
    } catch (error) {}
    setdialogDelete(false);
    router.push("/network/groups");
  };

  const deleteGroup = async () => {
    try {
      await axios.delete(`/api/group/deleteGroup/?groups=${groups}`);
    } catch (error) {}
    setdialogDelete(false);
    router.push("/network/groups");
  };

  return (
    <div
      className={styles.wholeAction}
      id="networkModel_deleteAction__Eo_me"
      onClick={closeModel}
    >
      {admin ? (
        <div className={styles.mypic}>
          <div className={styles.upper_sec}>
            <p>Are you sure you want to delete this group? </p>
          </div>

          <div className={styles.icons_name} onClick={deleteGroup}>
            <div className={styles.name}>
              <p style={{color:'red'}}>Delete</p>
            </div>
          </div>

          <div
            className={styles.icons_name}
            onClick={() => setdialogDelete(false)}
          >
            <div className={styles.name}>
              <p>Cancel</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.mypic}>
          <div className={styles.upper_sec}>
            <p>Are you sure you want to leave this group? </p>
          </div>
          <div className={styles.icons_name} onClick={leaveGrp}>
            <div className={styles.name}>
              <p style={{color:'red'}}>Leave</p>
            </div>
          </div>
          <div
            className={styles.icons_name}
            onClick={() => setdialogDelete(false)}
          >
            <div className={styles.name}>
              <p>Cancel</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteGroup;
