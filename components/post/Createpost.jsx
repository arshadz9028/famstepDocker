import React from 'react'
import Image from 'next/image';
import styles from '../../styles/Home.module.scss'


function Createpost(props) {
    return (
        <>
            <div className={styles.Createpost} style={props.postimage? { opacity:'1' } : {opacity:'0'}}  onClick={props.onClick} >
                <div className={styles.CreateIconsCover}> <Image alt="pro_photo" src={props.icons} className={styles.CreateIcons} /> </div>
                <p className={styles.option_name}>{props.title}</p>
            </div>

        </>
    )
}

export default Createpost