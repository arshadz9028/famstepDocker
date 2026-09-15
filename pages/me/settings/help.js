import React, { useContext } from "react";
import styles from "../../../styles/earning.module.scss";
import Navbar from "../../../layouts/Navbar";
import SettingsLayout from "../../../layouts/settings/SettingsLayout";
import { getSession, useSession } from "next-auth/react";
import { GrTransaction } from "react-icons/gr";
import { ContextProvider } from "../../../global/context";
import ClosePart from "../../../components/profileComp/ClosePart";
import NoCardsMessage from "../../../components/network/NoCardsMessage";
import { GrLaunch } from "react-icons/gr";

function HelpSopport({ session }) {
  const { earningToggle, setEarningToggle } = useContext(ContextProvider);

  return (
    <>
      <Navbar select={"Settings and Privacy"} session={session} />
      <div className={styles.main}>
        <div className={styles.center}>
          <SettingsLayout selected={"help"} />
          <div
            className={styles.WrapperDisplay}
            style={earningToggle ? { display: "block" } : {}}
          >
            <div className={styles.sideBarMobHeader}>
              <ClosePart
                title={"Help"}
                CloseTheModal={setEarningToggle}
              />
            </div>
            <div className={styles.display}>
              <NoCardsMessage
                MessageRectIcon={GrLaunch}
                MessageContentSecond={`LAUNCHING SOON`}
                MessageContent={`The page is under construction`}
              />
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
export default HelpSopport;
