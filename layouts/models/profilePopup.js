import React, { useEffect, useState, useContext } from "react";
import styles from "../../styles/PopUp.module.scss";
import Image from "next/image";

function ProfilePopup() {
  return (
    <section className={styles.main}>

    <div className={styles.main_popup}>
      <div className={styles.profile_update}>

      </div>
      <div className={styles.background_update}>

      </div>
    </div>
    </section>
  );
}

export default ProfilePopup;
