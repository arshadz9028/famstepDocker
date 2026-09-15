import React, { useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/Scoreboard.module.scss'
import prof from '../assets/newIcons/2.jpg'
import admin from "../assets/icons/admin.png";
import tick from "../assets/icons/tick.png";
function GroupSmall() {
    return (
        <>
            <div className={styles.small_card}>
                <div className={styles.circle_img}>
                    <Image src={prof} layout='fill' objectFit='cover' alt='prof' ></Image>
                </div>
                <div className={styles.name}>
                    <p>Rachae Ebert </p>
                    <div className={styles.cap}>
                        <Image src={admin} layout='fill' objectFit='cover' alt='cap'></Image>
                    </div>
                </div>
                <div className={styles.name}>
                    <p>Rachae Ebert </p>
                    <div className={styles.cap}>
                        <Image src={tick} layout='fill' objectFit='cover' alt='cap'></Image>
                    </div>
                </div>

            </div>

        </>
    )
}

export default GroupSmall