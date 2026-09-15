import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../../layouts/Navbar";
import styles from "../../../styles/network.module.scss";
import Network_Grp from "../../../components/network/Network_Grp";
import ScoreTab from "../../../layouts/Network/NetworkTab";
import useSWR from "swr";
import axios from "axios";
import { getSession } from "next-auth/react";
import NoCardsMessage from "../../../components/network/NoCardsMessage";
import { MdOutlineGroups2 } from "react-icons/md";

async function fetchGroups(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

function Groups({ session }) {
  const {
    data: grpData,
    mutate: mutateuserData,
    error: userError,
  } = useSWR("/api/group/groupDataFetch/myGroups", fetchGroups);

  const groupData = grpData?.data.filter((group) =>
    group?.members?.some((member) => member?.user?._id == session.user.id)
  );
  const groupAdmin = grpData?.data.filter(
    (group) => group?.admin?._id == session.user.id
  );

  return (
    <>
      <Navbar select={"Network"} session={session} />
      <ScoreTab
        selected={"Your Groups"}
        pages={"Groups"}
        pageLink={"/network"}
        Suggested={"Your Groups"}
        SuggestedLink={"/network/groups"}
        groups={"Discover"}
        groupsLink={"/network/groups/moregroups"}
        likeMinded={"New Group"}
        likeMindedLink={"New Group"}
        session={session}
        mutateuserData={mutateuserData}
      />
      <section className={styles.network_page}>
        <div className={styles.network_center_contact}>
          {grpData?.data.length > 0 ? (
            <div className={styles.net_card}>
              {grpData?.data.map((value, index) => {
                const isGrop = groupData?.some((val) => val._id == value._id);
                const isGropAd = groupAdmin?.some(
                  (val) => val._id == value._id
                );

                return (
                  <div key={value._id}>
                    {
                      <>
                        <Network_Grp
                          memberGroup={isGrop}
                          adminGroup={isGropAd}
                          value={value}
                          mutateuserData={mutateuserData}
                        />
                      </>
                    }
                  </div>
                );
              })}
            </div>
          ) : (
            <NoCardsMessage
              MessageRectIcon={MdOutlineGroups2}
              MessageContent={`You haven’t joined or created any groups yet. Get started and connect with others!`}
            />
          )}
        </div>
      </section>
    </>
  );
}
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { isNewUser } = session?.user;
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

export default Groups;
