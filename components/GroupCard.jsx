import React, { useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/Scoreboard.module.scss'
import GroupSmall from './GroupSmall';
import f1f from '../assets/newIcons/1.jpg'


function GroupCard() {


    return (
        <>
            <section className={styles.groupcard_card}>
                <div className={styles.groupcard_card_maintain}>
                   <div>
                     <div className={styles.groupcard_upper_img}>
                         <Image alt='uppr' src={f1f} priority layout='responsive' objectFit='cover'  className={styles.myimage} />
                     </div>
                         <p className={styles.grp_name}>Technical Freelancing</p>
                   </div>

                    <div className={styles.groupcard_patti_rank}>
                        <div className={styles.groupcard_rank}><h1>1</h1></div>
                        <div className={styles.groupcard_patti}><h2>{'Occupied'}</h2></div>
                    </div>
                    <div className={styles.lower_card}>

                        <div className={styles.small_grid}>
                            <GroupSmall/>
                            <GroupSmall/>
                            <GroupSmall/>
                            <GroupSmall/>
                            <GroupSmall/>
                            <GroupSmall/>
                        </div>


                    </div>
                </div>
            </section>
        </>
    )
}

export default GroupCard