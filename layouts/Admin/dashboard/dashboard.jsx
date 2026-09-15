import Card from "./card";
import ActiveCard from "./ActiveCard";
import Chart from "./chart";
import styles from "../../../styles/admin.module.scss";
import Rightbar from "./rightbar";
import Transactions from "./transactions";

const Dashboard = (userAll) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card />
          <ActiveCard userAll={userAll} />
        </div>
        <Transactions />
        <Chart />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
