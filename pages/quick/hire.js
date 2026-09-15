import React from "react";
import NoCardsMessage from "../../components/network/NoCardsMessage";
import { GrLaunch } from "react-icons/gr";
import Navbar from "../../layouts/NoSessionNavbar";
import MegaFooter from "../../components/LandingPage/MegaFooter";
import styles from "../../styles/quickLinks.module.scss";

function Hire() {
  return (
    <>
      <Navbar select={"About"} />
      <div className={styles.main}>
        <div className={styles.center}>
          <NoCardsMessage
            MessageRectIcon={GrLaunch}
            MessageContentSecond={`LAUNCHING SOON`}
            MessageContent={`This page is currently under construction. Stay tuned for something exciting!`}
          />
        </div>
          <MegaFooter />
      </div>
    </>
  );
}

export default Hire;
