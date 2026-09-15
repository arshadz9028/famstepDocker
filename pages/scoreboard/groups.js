import React from "react";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/Scoreboard.module.scss";
import ScoreTab from "../../layouts/ScoreBoard/ScoreTab";
import GroupCard from "../../components/GroupCard";
import { getSession } from "next-auth/react";
import NoCardsMessage from "../../components/network/NoCardsMessage";
import { GrLaunch } from "react-icons/gr";

function group({session}) {
  return (
    <>
      <Navbar select={"Scoreboard"} session={session}/>
      {/* upper tabs for score page */}
      <ScoreTab
        selected={"Freelance Hub"}
        pages={"Winners"}
        pageLink={"/scoreboard"}
        scorecard={"Scorecard"}
        scorecardLink={"/scoreboard/scorecard"}
        groups={"Freelance Hub"}
        groupsLink={"/scoreboard/groups"}
        earning={"Auction & Reviews"}
        earningLink={"/scoreboard/earnings"}
      />
      <section className={styles.groupCard}>
        <div className={styles.group_center}>
          {/* <div className={styles.group_grid}>
            <GroupCard />
          </div> */}
          <NoCardsMessage
          MessageRectIcon={GrLaunch}
          MessageContentSecond={`LAUNCHING SOON`}
          MessageContent={`This page is currently under construction. Stay tuned for something exciting!`}
        />

        </div>
      </section>
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
  const {  isNewUser } = session?.user;
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
        session
  } 
}
}
export default group;
