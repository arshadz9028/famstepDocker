import React from "react";
import styles from "../../styles/editSkills.module.scss";
import axios from "axios";
import ClosePart from "../../components/profileComp/ClosePart";

function Announcement({
  setEditSkills, announc, mutatefollowerData
}) {
  const [userBio, setUserBio] = React.useState("");

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "main") {
      setEditSkills(false);
    }
  };
  const openSkillModel = async (e) => {
    //endpoints
    try {
      await axios.post(`/api/famstep/announcement`, { announcement: userBio })
      mutatefollowerData()
    } catch (error) {
      console.log('error', error)
    }
    setEditSkills(false)
  };

  const userBioFunc = (e) => {
    setUserBio(e.target.value);
  };
  return (
    <>
      <div className={styles.main} id="main" onClick={closeModel}>
        <div className={styles.fullEdit}>
          <ClosePart title={"Add Announcement"} CloseTheModal={setEditSkills} />
          <div className={styles.upperPortion} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

            <div className={styles.inputDesc}>
              <textarea
                className={styles.textArea}
                type="text"
                id="userBio"
                name="userBio"
                rows={1}
                required="required"
                value={userBio}
                onChange={userBioFunc}
              />
              <span className={styles.labelInputDesc}>Announcement</span>

            </div>
            <div className={styles.AddMoreSkillsButton}>
              <button className={styles.AddButton} onClick={openSkillModel}>
                Add Announcement
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Announcement;
