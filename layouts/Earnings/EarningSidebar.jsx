import React,{useContext} from "react";
import styles from "../../styles/earning.module.scss";
import {
  MdOutlineAnalytics,
  MdHistory,
  MdOutlineAccountBalance,
  MdOutlinePayment,
} from "react-icons/md";
import Link from "next/link";
import ClosePart from "../../components/profileComp/ClosePart";
import { ContextProvider } from "../../global/context";

function EarningSidebar({ selected }) {
  const {
    earningToggle, setEarningToggle
  } = useContext(ContextProvider);
  return (
    <>
      <div className={styles.Wrapper} style={!earningToggle ? { display: "block" } : {}} >
        <div className={styles.sideBarMobHeader}>
          <ClosePart
            title={"Earnings"}
            linkBar={'home'}
          />
        </div>
        <div className={styles.sideBar}>
          <Link href="/me/earnings">
            <div
              className={
                selected === "Analytics"
                  ? styles.activeAnalytics
                  : styles.analytics
              }
              onClick={()=>setEarningToggle(!earningToggle)}
            >
              <MdOutlineAnalytics className={styles.analyticsICons} />
              <p>Analytics</p>
            </div>
          </Link>

          <Link href="/me/earnings/history">
            <div
              className={
                selected === "history"
                  ? styles.activeAnalytics
                  : styles.analytics
              }
              onClick={()=>setEarningToggle(!earningToggle)}

            >
              <MdHistory className={styles.analyticsICons} />
              <p>Transactions History</p>
            </div>
          </Link>

          <Link href="/me/earnings/balance">
            <div
              className={
                selected === "balance"
                  ? styles.activeAnalytics
                  : styles.analytics
              }
              onClick={()=>setEarningToggle(!earningToggle)}

            >
              <MdOutlineAccountBalance className={styles.analyticsICons} />
              <p>Balance</p>
            </div>
          </Link>

          <Link href="/me/earnings/method">
            <div
              className={
                selected === "method"
                  ? styles.activeAnalytics
                  : styles.analytics
              }
              onClick={()=>setEarningToggle(!earningToggle)}

            >
              <MdOutlinePayment className={styles.analyticsICons} />
              <p>Payment Method</p>
            </div>
          </Link>

          
        </div>
      </div>
    </>
  );
}

export default EarningSidebar;
