import React, { useEffect, useState } from "react";
import Navbar from "../../../layouts/Navbar";
import styles from "../../../styles/network.module.scss";
import loaderStyles from "../../../styles/ImageLoading.module.scss";
import Network_Grp from "../../../components/network/Network_Grp";
import ScoreTab from "../../../layouts/Network/NetworkTab";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import { getSession } from "next-auth/react";
import NoCardsMessage from "../../../components/network/NoCardsMessage";
import { MdTravelExplore } from "react-icons/md";

async function fetchGroups(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

function Moregroups({ session }) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateuserData,
  } = useSWRInfinite(
    (index) =>
      `/api/group/groupDataFetch/discoverGrps?page=${index + 1}&limit=10`,
    fetchGroups,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const posts = data ? data.flatMap((page) => page.data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1]?.data?.length === 0;

  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      !isLoadingMore &&
      !isReachingEnd
    ) {
      setSize(size + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [isLoadingMore, isReachingEnd]);

  const groupData = posts.filter((group) =>
    group?.members?.some((member) => member?.user?._id === session.user.id)
  );

  const groupAdmin = posts.filter(
    (group) => group?.admin?._id === session.user.id
  );

  useEffect(() => {
    posts.forEach((value) => {
      const isMember = groupData.some((val) => val._id === value._id);
      const isAdmin = groupAdmin.some((val) => val._id === value._id);
      return isMember || isAdmin;
    });
  }, [posts, groupData, groupAdmin]);

  const displayGroups = posts.filter(
    (value) =>
      !groupData.some((val) => val._id === value._id) &&
      !groupAdmin.some((val) => val._id === value._id)
  );

  return (
    <>
      <Navbar select={"Network"} session={session} />
      <ScoreTab
        selected={"Discover"}
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
          {displayGroups.length > 0 ? (
            <>
              <div className={styles.invitationsHeader}>
                <p>
                  Discover tailored groups! Here are some to match your
                  interests. Dive in and connect with like-minded folks.
                </p>
              </div>
              <div className={styles.net_card}>
                {displayGroups.map((value, index) => (
                  <Network_Grp
                    key={`${value._id}-${index}`}
                    memberGroup={false}
                    adminGroup={false}
                    value={value}
                    mutateuserData={mutateuserData}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {!isLoadingInitialData && (
                <NoCardsMessage
                  MessageRectIcon={MdTravelExplore}
                  MessageContent={`There are no more groups at the moment. We’ll update you soon!`}
                />
              )}
            </>
          )}
          {isLoadingMore && (
            <div
              className={loaderStyles.loaderCover}
              style={{ height: isLoadingInitialData ? "70vh" : "auto" }}
            >
              <div className={loaderStyles.loader} />
            </div>
          )}

          {isReachingEnd && displayGroups.length != 0 && (
            <div className={loaderStyles.ParaCover}>
              <p className={loaderStyles.loaderCoverP}>
                Looks like you&apos;ve seen all the group suggestions.
              </p>
            </div>
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

  if (session.user.isNewUser) {
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

export default Moregroups;
