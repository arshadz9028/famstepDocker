import React, { useEffect } from "react";
import styles from "../../styles/Navbar.module.scss";
import { IoExitOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import { CgDetailsMore } from "react-icons/cg";
import { MdOutlineReport } from "react-icons/md";

function Meprof({
  setEdit,
  setThreeDotOption,
  setAboutModel,
  admin,
  joinMembers,
  setdialogDelete,
  setdialogeReport
}) {
  
  const handleDelete = () => {
    setdialogDelete(true);
    setThreeDotOption(false)
  };

  
  return (
    <>

      <div className={styles.mypic}>
        {joinMembers && (
          <div className={styles.icons_name} onClick={handleDelete}>
            <div className={styles.icons}>
              <IoExitOutline className={styles.icons} />
            </div>

            <div className={styles.name}>
              {admin ? <p>Delete this group</p> : <p>Leave this group</p>}
            </div>
          </div>
        )}

        {admin ? (
          <div
            className={styles.icons_name}
            onClick={() => {
              setEdit(true);
              setThreeDotOption(false);
            }}
          >
            <div className={styles.icons}>
              <AiOutlineEdit className={styles.icons} />
            </div>

            <div className={styles.name}>
              <p>Edit</p>
            </div>
          </div>
        ) : (
          <div className={styles.icons_name} onClick={() => {setdialogeReport(true); setThreeDotOption(false)}}>
            <div className={styles.icons}>
              <MdOutlineReport className={styles.icons} />
            </div>

            <div className={styles.name}>
              <p >Report</p>
            </div>
          </div>
        )}

        <div className={styles.icons_name} style={{ "borderTop" : `${joinMembers && "1px solid #F1F0ED" }`}} onClick={() => { setAboutModel(true); setThreeDotOption(false) }} >
          <div className={styles.icons}>
            <CgDetailsMore className={styles.icons} />
          </div>

          <div className={styles.name}>
            <p>Overview</p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Meprof;
