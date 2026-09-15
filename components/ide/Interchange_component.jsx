import React from 'react'
import styles from "../../styles/Interchange_result.module.scss";

function Interchange_component(props) {
  return (
    <>
      <div className={styles.support}>
        <div className={styles.number_support}>
            <strong>{props.number}</strong>
        </div>
        <div className={styles.supports}>
            <p>{props.name}</p>
        </div>
        </div>
    </>
  )
}

export default Interchange_component
