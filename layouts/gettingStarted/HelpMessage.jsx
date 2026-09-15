import React from 'react'
import styles from "../../styles/SignupMoreDetail.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";

function HelpModal({ setHelp }) {

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "help_modalOuter"  ) {
      setHelp(false)

    }
  }

  return (
    <>
      <div id='help_modalOuter' className={styles.help_modalOuter}  onClick={closeModel}>
        <div className={styles.help_center}>

          <div className={styles.help_cross} onClick={()=>setHelp(false)}>
            <AiOutlineCloseCircle  className={styles.svg_cross} />
          </div>
          <div className={styles.top_line} />
          <p>
            <span style={{ color: '#08529B', fontWeight: '500' }}>Current Status</span>: Please enter your college name if you are a student or fresher, or your company name if you are employed.
          </p>
        </div>
      </div>
    </>
  )
}

export default HelpModal