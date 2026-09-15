import React from "react";
import styles from "../../styles/Message.module.scss";
import Image from "next/image";

function Messagefriend({ val, newSelected, setNewSelected }) {
  return (
    <>
      <div className={styles.dp_name} onClick={(e) => { setNewSelected(val._id) }} style={newSelected === val._id ? { backgroundColor: '#E6EEF5' } : {}} >
        <div className={styles.search_dp}>
          <Image src={val.image} alt='image'
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
            }}
          />

        </div>
        <div className={styles.name2}>
          <p>{val.name}</p>
          <div className={styles.active_status}>
            <p>{val.username}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Messagefriend;
