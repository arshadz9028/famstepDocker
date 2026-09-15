import React, { useState, useContext } from "react";
import styles from "../../styles/editSkills.module.scss";
import { ContextProvider } from "../../global/context";
import axios from "axios";
import ClosePart from "../../components/profileComp/ClosePart";
import SkillDeleteDialogue from "./SkillDeleteDialogue"

function EditSkills({
  editSkills,
  setEditSkills,
  userData,
  usersData,
  session,
  mutatefollowerData,
}) {
  const {
    setSkillModal
  } = useContext(ContextProvider);

  // Initialize state variables with user data
  const [dialogDelete, setdialogDelete] = useState(false);
  const [skillId, setSkillId] = useState('');

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "main") {
      setEditSkills(false);
    }
  };

  const openSkillModel = (e) => {
    setEditSkills(false)
    setSkillModal(true)
  };

const deleteSkills =(Id)=>{
  setSkillId(Id)
  setdialogDelete(true)
}

  return (
    <>
    {dialogDelete && <SkillDeleteDialogue setdialogDelete={setdialogDelete} skillId={skillId}   mutatefollowerData={mutatefollowerData} />}
      <div className={styles.main} id="main" onClick={closeModel}>
        <div className={styles.fullEdit}>
          <ClosePart title={"Edit Skills"} CloseTheModal={setEditSkills} />
          <div className={styles.upperPortion}>
            <div className={styles.skill_main}>
              <div style={{height:'1rem'}} />
              <table>
                <thead style={{ backgroundColor: "#E6EEF5", width:"100%"}}>
                  <tr>
                    <th style={{ textAlign: "left", paddingLeft: "5rem" }} >Skills </th>
                    <th>Ranks</th>
                    <th>Score</th>
                    <th />
                  </tr>
                </thead>
                {userData?.skills.map((val, index) => {
                  const sortedSkillData = usersData?.selectedData
                    .slice()
                    .sort((a, b) => {
                      const filteredValA = a?.skills.find(
                        (value) => value.skill === val.skill
                      );
                      const filteredValB = b?.skills.find(
                        (value) => value.skill === val.skill
                      );
                      return (
                        (filteredValB?.points || 0) -
                        (filteredValA?.points || 0)
                      );
                    });
                  const skillWiseRank = sortedSkillData.findIndex(
                    (element) => element._id === session.user.id
                  );

                  return (
                    <tbody key={val._id} >
                      <tr  >
                        <td style={{ color: "#08529B", textAlign: "left", paddingLeft: "5rem" }} >
                          {val.skill}
                        </td>
                        {val.points === 0 ? (
                          <td>0</td>
                        ) : (
                          <td>{skillWiseRank + 1}</td>
                        )}
                        <td>{val.points}</td>

                        <td style={{paddingRight: "2rem"}}>
                          <button
                            className={styles.deleteButton}
                            onClick={ () => deleteSkills(val._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>

            <div className={styles.AddMoreSkillsButton}>
              <button
                className={styles.AddButton}
                onClick={openSkillModel}
              >
                Add more skils
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditSkills;
