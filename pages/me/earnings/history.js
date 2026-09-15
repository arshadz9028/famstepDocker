import React, { useContext } from "react";
import styles from "../../../styles/earning.module.scss";
import Navbar from "../../../layouts/Navbar";
import EarningSidebar from "../../../layouts/Earnings/EarningSidebar";
import { getSession, useSession } from "next-auth/react";
import { GrTransaction } from "react-icons/gr";
import { ContextProvider } from "../../../global/context";
import ClosePart from "../../../components/profileComp/ClosePart";

function History({ session }) {
  const { earningToggle, setEarningToggle } = useContext(ContextProvider);

  return (
    <>
      <Navbar select={"earnings"} session={session} border={"bottom"} />
      <div className={styles.main}>
        <div className={styles.center}>
          <EarningSidebar selected={"history"} />
          <div
            className={styles.WrapperDisplay}
            style={earningToggle ? { display: "block" } : {}}
          >
            <div className={styles.sideBarMobHeader}>
              <ClosePart title={"Transactions History"} CloseTheModal={setEarningToggle} />
            </div>
            <div className={styles.display}>
              <div className={styles.history}>
                <GrTransaction />
                <p>No transaction records available at the moment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
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
  const { id, username, isNewUser } = session?.user;
  if (isNewUser) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
export default History;
