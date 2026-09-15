import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "../../../styles/admin.module.scss";
import React,{useContext, useEffect} from "react";
import { ContextProvider } from "../../../global/context";
const Card = ({  }) => {
  const {totalUserLen,setTotaleUserLen} = useContext(ContextProvider)
  
  return (
    <div className={styles.containerCard}>
      <MdSupervisedUserCircle className={styles.containerCard_icon} />
      <div className={styles.texts}>
        <span className={styles.containerCard_title}>Total Users</span>
        <span className={styles.number}>{totalUserLen}</span>
        <span className={styles.detail}>
          
        </span>
      </div>
    </div>
  );
};

export default Card;
