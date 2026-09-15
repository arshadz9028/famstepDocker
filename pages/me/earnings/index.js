import React, { useContext } from "react";
import styles from "../../../styles/earning.module.scss";
import Navbar from "../../../layouts/Navbar";
import EarningSidebar from "../../../layouts/Earnings/EarningSidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSession, useSession } from "next-auth/react";
import { ContextProvider } from "../../../global/context";
import ClosePart from "../../../components/profileComp/ClosePart";

const data = [
  {
    name: "Jan",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Feb",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Mar",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Apr",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "May",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Jun",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Jul",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Aug",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Sep",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Oct",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Nov",
    GroupProjects: 0,
    Individual: 0,
  },
  {
    name: "Dec",
    GroupProjects: 0,
    Individual: 0,
  },
];
function Analytics({ session }) {
  const { earningToggle, setEarningToggle } = useContext(ContextProvider);
  return (
    <>
      <Navbar select={"earnings"} session={session} border={"bottom"} />
      <div className={styles.main}>
        <div className={styles.center}>
          <EarningSidebar selected={"Analytics"} />

          <div
            className={styles.WrapperDisplay}
            style={earningToggle ? { display: "block" } : {}}
          >
            <div className={styles.sideBarMobHeader}>
              <ClosePart title={"Analytics"} CloseTheModal={setEarningToggle} />
            </div>
            <div className={styles.display} >
              <div className={styles.projectsAnalytics}>
                <div className={styles.projects}>
                  <p className={styles.number}>0</p>
                  <p className={styles.content}>Total projects</p>
                </div>
                <div className={styles.projects}>
                  <p className={styles.number}>0</p>
                  <p className={styles.content}>Hourly compensation</p>
                </div>
                <div className={styles.projects}>
                  <p className={styles.number}>0</p>
                  <p className={styles.content}>Hourse worked</p>
                </div>
                <div className={styles.projects}>
                  <p className={styles.number}>0</p>
                  <p className={styles.content}>Total earned</p>
                </div>
              </div>

              <div className={styles.containerChart}>
                <h2 className={styles.title}>Yearly Recap</h2>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                      top: 10,
                      right: 15,
                      left: -20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ background: "#151c2c", border: "none" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="GroupProjects"
                      stroke="#8884d8"
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="Individual"
                      stroke="#82ca9d"
                      strokeDasharray="3 4 5 2"
                    />
                  </LineChart>
                </ResponsiveContainer>
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
export default Analytics;
