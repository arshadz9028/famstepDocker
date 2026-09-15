import React, { useState, useContext } from "react";
import styles from "../../../styles/earning.module.scss";
import Navbar from "../../../layouts/Navbar";
import SettingsLayout from "../../../layouts/settings/SettingsLayout";
import useSWR from "swr";
import axios from "axios";
import { getSession } from "next-auth/react";
import DeleteAccount from "../../../layouts/models/DeleteAccount";
import { ContextProvider } from "../../../global/context";
import ClosePart from "../../../components/profileComp/ClosePart";
import NoCardsMessage from "../../../components/network/NoCardsMessage";
import { GrLaunch } from "react-icons/gr";

async function fetchUsers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

function DeleteAcc({ session }) {
  const { earningToggle, setEarningToggle } = useContext(ContextProvider);

  const {
    data: usersData,
    mutate: mutatefollowerData,
    error: followerError,
  } = useSWR("/api/profile/follow/userFetch", fetchUsers);
  const userData = usersData?.userDataS;
  const [dialogDelete, setdialogDelete] = useState(false);
  const handleDelete = () => {
    setdialogDelete(true);
  };
  return (
    <>
      {dialogDelete && <DeleteAccount setdialogDelete={setdialogDelete} />}
      <Navbar select={"Settings and Privacy"} session={session} />

      <div className={styles.main}>
        <div className={styles.center}>
          <SettingsLayout selected={"Delete"} />

          <div
            className={styles.WrapperDisplay}
            style={earningToggle ? { display: "block" } : {}}
          >
            <div className={styles.sideBarMobHeader}>
              <ClosePart
                title={"Delete Account"}
                CloseTheModal={setEarningToggle}
              />
            </div>
            <div className={styles.display}>
              {/* <div className={styles.user_del_info}>
                <h6>Delete Account</h6>
                <p>{session.user.name}, We regret to see you leave.</p>
                <p>
                  Before moving forward, please make sure you wont be able to
                  recover all your information, posts, achievements, level, and
                  points
                </p>
                <p>Are you sure want to continue?</p>
                <div className={styles.handle_btn} onClick={handleDelete}>
                  <button>Continue</button>
                </div>
              </div> */}
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
export default DeleteAcc;
