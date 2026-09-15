import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "../../../styles/admin.module.scss";
import React,{useContext, useEffect} from "react";
import { ContextProvider } from "../../../global/context";
const Card = ({ userAll }) => {
  const {activeUserLen} = useContext(ContextProvider)
  return (
    <div className={styles.containerCard}>
      <MdSupervisedUserCircle className={styles.containerCard_icon} />
      <div className={styles.texts}>
        <span className={styles.containerCard_title} style={{color:"green", fontWeight:"800"}} >Active Users</span>
        <span className={styles.number}>{activeUserLen}</span>
        <span className={styles.detail}>
          
        </span>
      </div>
    </div>
  );
};

export default Card;
