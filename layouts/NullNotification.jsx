import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/Navbar.module.scss";
import { IoNotifications } from "react-icons/io5";

function NullNotification({ }) {

  return (
    <>
        <div className={styles.null_designCenter} >

            <div className={styles.null_circle} >
                <div className={styles.notification_design1}/>
                <div className={styles.notification_design2}/>
                <div className={styles.notification_design3}/>
                <IoNotifications className={styles.notification_design4} />
            </div>
            
            <div className={styles.null_text}>
                <p className={styles.head}>No notification yet</p>
                <p className={styles.subtitle}>Notifications will be displayed here once they are available.</p>
            </div>
        </div>
    </>
  );
}

export default NullNotification;
