import React from 'react'
import Image from 'next/image'
import first from '../assets/images/first.png';
import second from "../assets/images/second.png";
import post7 from "../assets/images/post7.jpg";
import third from "../assets/images/third.png";
import styles from '../styles/Home.module.scss'
// import style from '../styles/Profile.module.scss'


function Winnerhome() {
    return (
        <>
        {/* showing winners list in home page */}
            <div className={styles.winnerscard}>
                <p className={styles.caption}>  the Famstep <span style={{color: '#DE3B62'}} > level 5 </span> contest winners have been annouced </p>
                <div className={styles.congratulation}><p>#Congratulations to all the winners</p></div>
                <div className={styles.photo_name}>

                {/* this is third */}
                    <div className={styles.display}>
                        <div className={styles.winner_img}>
                            <Image src={third} width="100%" height="100%"  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" objectFit='cover' />
                        </div>
                        <div className={styles.name_plate3} style={{display: 'flex' ,justifyContent: 'space-between', alignItems: 'center'}}>
                            <div className={styles.roundnumber} style={{background:'#6A3805'}} >3</div>
                            <div className={styles.winnername}>Winifred weber</div>
                        </div>
                    </div>

                    {/* this is first */}
                    <div className={styles.display} style={{alignSelf:'flex-start'}}>
                        <div className={styles.name_plate1} style={{display: 'flex' ,justifyContent: 'space-between', alignItems: 'center'}}>
                            <div className={styles.roundnumber } style={{background:'#ECCE3D'}}>1</div>
                            <div className={styles.winnername}>Winifred weber</div>
                        </div>
                        <div className={styles.winner_img1}>
                            <Image  src={first} width="100%" height="100%"  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" objectFit='cover'/>
                        </div>
                    </div>

                    {/* this is second */}
                    <div className={styles.display}>
                        <div className={styles.winner_img}>
                            <Image src={post7}  width="100%" height="100%"  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" objectFit='cover'  />
                        </div>
                        <div className={styles.name_plate2} style={{display: 'flex' ,justifyContent: 'space-between', alignItems: 'center'}} >
                            <div className={styles.roundnumber2} style={{background:'#B4B4B4'}}>2</div>
                            <div className={styles.winnername} >Winifred weber</div>
                        </div> 
                    </div>


                </div>
            </div>
        </>
    )
}

export default Winnerhome
