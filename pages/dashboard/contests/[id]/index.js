import Navbar from "../../../../layouts/Admin/Navbar"
import Sidebar from "../../../../layouts/Admin/sidebar/Sidebar"
import styles from "../../../../styles/admin.module.scss";
import Footer from "../../../../layouts/Admin/Footer"
import Dashboard from "../../../../layouts/Admin/contests/view";

import React, { useEffect, useState, useRef, useContext } from "react";
import { ContextProvider } from "../../../../global/context";


const Layout = () => {
  const { hamburger } = useContext(ContextProvider);

  return (
    <div className={styles.container}>
      <div className={!hamburger? styles.menu : styles.menu1 }>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar name={'id'} />
        <Dashboard  />
        <Footer />
      </div>
    </div>
  )
}

export default Layout