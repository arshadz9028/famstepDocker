import React from 'react'
import styles from "../styles/SignupMoreDetail.module.scss";
import { GrFormClose } from "react-icons/gr";
import { RiCloseFill } from "react-icons/ri";

function SelectedProgramingCard({ value, deleteSelectedProgram, editPost }) {
    return (
        <>
            <pre className={styles.selected_card}>
                <p className={styles.selected_code}>
                    {value}
                </p>
                <div className={styles.selected_delete} onClick={() => deleteSelectedProgram(value)}>
                    <RiCloseFill className={styles.svg_delete} />
                </div>
            </pre>
        </>
    )
}

export default SelectedProgramingCard