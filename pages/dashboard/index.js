import Navbar from "../../layouts/Admin/Navbar"
import Sidebar from "../../layouts/Admin/sidebar/Sidebar"
import styles from "../../styles/admin.module.scss";
import Footer from "../../layouts/Admin/Footer"
import Dashboard from "../../layouts/Admin/dashboard/dashboard";
import React, { useEffect, useState, useRef, useContext } from "react";
import { ContextProvider } from "../../global/context";
import { getSession, useSession } from "next-auth/react";
import User from "../../model/userModel";


const Layout = ({userAll}) => {
  const { hamburger,setTotaleUserLen ,setActiveUserLen} = useContext(ContextProvider);
  const activeUserRefresh = userAll?.filter((value)=> value.userActive === true).length
  useEffect(() => {
    setTotaleUserLen(userAll?.length)
    setActiveUserLen(activeUserRefresh)
  }, [userAll])

  return (
    <div className={styles.container}>
      <div className={!hamburger ? styles.menu : styles.menu1}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar name={'Dashboard'} />
        <Dashboard userAll={userAll}/>
        <Footer />
      </div>
    </div>
  )
}
export async function getServerSideProps({ req, query }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { userPostId } = query;
  const userAll = await User.find({})
  const user = userAll.find((user) => user.username === session.user.username);
  
  if (user.role !== 'admin') {
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
      user: JSON.parse(JSON.stringify(user)),
      userAll: JSON.parse(JSON.stringify(userAll)),
    },
  };

}

export default Layout