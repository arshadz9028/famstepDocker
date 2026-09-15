import React from 'react'
import styles from "../../styles/SignupMoreDetail.module.scss";
import { GrFormClose } from "react-icons/gr";
import { RiCloseFill } from "react-icons/ri";

function SelectedTaggedUser({ value ,deleteSelectedProgram }) {
    return (
        <>
            <pre className={styles.selected_card}>
                <p className={styles.selected_code}>
                    {value?.name}
                </p>
                <div className={styles.selected_delete} onClick={()=>deleteSelectedProgram(value?._id)}>
                    <RiCloseFill className={styles.svg_delete} />
                </div>
            </pre>
        </>
    )
}

export default SelectedTaggedUser