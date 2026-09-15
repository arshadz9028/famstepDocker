import React, { useEffect, useState, useRef, useContext } from "react";
import Image from "next/image";
import MenuLink from "./menuLink";
import styles from "../../../styles/AdminSidebar.module.scss";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
  MdOutlineClose
} from "react-icons/md";
import { ContextProvider } from "../../../global/context";

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: MdDashboard,
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: MdSupervisedUserCircle,
      },
      {
        title: "Contests",
        path: "/dashboard/contests",
        icon: MdShoppingBag,
      },
      {
        title: "Transactions",
        path: "/dashboard/transactions",
        icon: MdAttachMoney,
      },
    ],
  },
  {
    title: "Analytics",
    list: [
      {
        title: "Revenue",
        path: "/dashboard/revenue",
        icon: MdWork,
      },
      {
        title: "Reports",
        path: "/dashboard/reports",
        icon: MdAnalytics,
      },
      {
        title: "Teams",
        path: "/dashboard/teams",
        icon: MdPeople,
      },
    ],
  },
  {
    title: "User",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: MdOutlineSettings,
      },
      {
        title: "Help",
        path: "/dashboard/help",
        icon: MdHelpCenter,
      },
    ],
  },
];

const Sidebar = () => {
  const { setHamburger } = useContext(ContextProvider);
  return (
    <div className={styles.containerSidebar}>
      <div className={styles.user}>
        <div className={styles.userImage}>
          <Image
            src={"/noavatar.png"}
            alt=""
             fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
             style={{
                  objectFit: "cover"
                }}
          />
        </div>
        <div className={styles.userDetail}>
          <span className={styles.username}>{'Farhan khan'}</span>
          <span className={styles.userTitle}>Administrator</span>
        </div>
        <MdOutlineClose className={styles.sidebarClose} onClick={()=> setHamburger(false)} />
      </div>
      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <form>
        <button className={styles.logout}>
          <MdLogout className={styles.MenuIcon} />
          Logout
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
