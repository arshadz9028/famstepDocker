import React, { useEffect, useState, useRef, useContext } from "react";
import Navbar from "../../../../layouts/Admin/Navbar"
import Sidebar from "../../../../layouts/Admin/sidebar/Sidebar"
import styles from "../../../../styles/admin.module.scss";
import Footer from "../../../../layouts/Admin/Footer"
import Dashboard from "../../../../layouts/Admin/users/view";
import { ContextProvider } from "../../../../global/context";
import { getSession, useSession } from "next-auth/react";
import User from "../../../../model/userModel";

const Layout = (userD) => {
  const { hamburger } = useContext(ContextProvider);

  return (
    <div className={styles.container}>
      <div className={!hamburger? styles.menu : styles.menu1 }>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar name={'id'} />
        <Dashboard userD={userD}/>
        <Footer />
      </div>
    </div>
  )
}
export async function getServerSideProps({ req, query }) {
  const session = await getSession({ req });
  const { id } = query;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userData = await User.findOne({ username: session.user.username });
  const userD = await User.findById(id);

  if (userData.role !== 'admin') {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
      userD:JSON.parse(JSON.stringify(userD)),
      userData: JSON.parse(JSON.stringify(userData)),
    },
  };

}

export default Layout