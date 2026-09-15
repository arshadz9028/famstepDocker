import React, { useContext } from "react";
import styles from "../../../styles/earning.module.scss";
import Navbar from "../../../layouts/Navbar";
import SettingsLayout from "../../../layouts/settings/SettingsLayout";
import { getSession } from "next-auth/react";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";
import { TbBarrierBlock } from "react-icons/tb";
import { ContextProvider } from "../../../global/context";
import ClosePart from "../../../components/profileComp/ClosePart";

async function fetchUsers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
function BlockPage({ session }) {
  const { earningToggle, setEarningToggle } = useContext(ContextProvider);

  const {
    data: userBlockData,
    mutate: mutateuserBlockData,
    error: followerError,
  } = useSWR(`/api/profile/settings/blockListFetch`, fetchUsers);

  const handleunBlock = async (id) => {
    await axios.delete(`/api/profile/follow/blockUser?message=${id}`);
    mutateuserBlockData();
  };

  return (
    <>
      <Navbar select={"Settings and Privacy"} session={session} border={"bottom"} />

      <div className={styles.main}>
        <div className={styles.center}>
          <SettingsLayout selected={"blocked"} />

          <div
            className={styles.WrapperDisplay}
            style={earningToggle ? { display: "block" } : {}}
          >
            <div className={styles.sideBarMobHeader}>
              <ClosePart
                title={"Blocked Users"}
                CloseTheModal={setEarningToggle}
              />
            </div>

            <div className={styles.display}>
              <div className={styles.blockedUsers}>
                <div className={styles.blockedUsersContent}>
                  <p className={styles.blockedUsersHeader}>Blocked accounts</p>
                  <p className={styles.blockedUsersHeader2}>
                    You can block users from their profiles with ease, anytime.
                  </p>
                </div>

                {(userBlockData?.res !== null &&
                  userBlockData?.res?.blockedIds?.length !== 0)  ? (
                  <>
                    {userBlockData?.res?.blockedIds.map((value) => (
                      <div className={styles.users} key={value._id}>
                        <div className={styles.user_image_cont}>
                          <div className={styles.image_container}>
                            <Image
                              src={value.userId.image}
                              alt="userPic"
                               fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                               style={{
                  objectFit: "cover"
                }} // Ensures the image covers the entire container
                              className={styles.user_image}
                            />
                          </div>

                          <div>
                            <p>{value.userId.name}</p>
                            <p
                              style={{
                                fontSize: "1.4rem",
                                marginTop: ".1rem",
                                color: "#8A8A8A",
                                fontWeight: "400",
                              }}
                            >
                              {value.userId.username}
                            </p>
                          </div>
                        </div>

                        <div
                          className={styles.handle_btn}
                          onClick={() => handleunBlock(value.userId._id)}
                        >
                          <button>Unblock</button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className={styles.history} style={{marginTop:"5rem"}}>
                    <TbBarrierBlock    />
                    <p>You haven’t blocked any users yet.</p>
                  </div>
                )}
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

export default BlockPage;
