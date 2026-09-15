import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/AdminSidebar.module.scss";
import {
  MdNotifications,
  MdOutlineChat,
  MdPublic,
  MdSearch,
} from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { ContextProvider } from "../../global/context";


const Navbar = ({name}) => {
  const { setHamburger } = useContext(ContextProvider);

  return (
    <div className={styles.containerNavbar}>
    <div style={{display:'flex', alignItems: 'center'}} >
      <GiHamburgerMenu  className={styles.HamburgerMenu} style={{marginRight:'1rem'}} onClick={()=>{setHamburger(true)}} />
        <div className={styles.title}>{name}</div>
    </div>
      <div className={styles.menu}>
        <div className={styles.search}>
          <MdSearch className={styles.MenuIcon} />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div>
        <div className={styles.icons}>
          <MdOutlineChat className={styles.iconsNavbar} />
          <MdNotifications className={styles.iconsNavbar} />
          <MdPublic className={styles.iconsNavbar} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
