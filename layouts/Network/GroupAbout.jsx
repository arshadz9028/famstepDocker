import React from "react";
import styles from "../../styles/inviteFriend.module.scss";
import ClosePart from "../../components/profileComp/ClosePart";

function InviteFriends({ setAboutModel,groupData }) {
  //close the modal
  const closeModel = (event) => {
    const className = event.target.getAttribute("id");
    if (className === "help_modalOuter") {
      setAboutModel(false);
    }
  };

  return (
    <>
      <div
        id="help_modalOuter"
        className={styles.help_modalOuter}
        onClick={closeModel}
      >
        <div className={styles.skillModal_centerGroup}>
          <ClosePart CloseTheModal={setAboutModel} title={"About"} />

          <div autoComplete="" className={styles.aboutDetails}>
            <pre>
             {groupData.description}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

export default InviteFriends;
