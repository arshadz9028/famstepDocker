import React, { useEffect, useState } from "react";
import Navbar from "../../../layouts/Navbar";
import styles from "../../../styles/Scoreboard.module.scss";
import loaderStyles from "../../../styles/ImageLoading.module.scss";
import ScoreTab from "../../../layouts/ScoreBoard/ScoreTab";
import ScoreCard from "../../../components/Scoreboard/ScoreCardAllrounder";
import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";
import UserFollow from "../../../model/followModel";
import frequest from "../../../model/frequestModel";
import axios from "axios";
import useSWRInfinite from "swr/infinite";

async function fetchUsers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
function AllRounder({ session }) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateImageData,
  } = useSWRInfinite(
    (index) => `/api/scoreboard/scorecardAllrounder?page=${index + 1}&limit=12`,
    fetchUsers,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
    }
  );
  const posts = data ? data.flatMap((page) => page?.data) : [];

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1]?.data?.length === 0;

  const userData = { data: posts };

  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      !isLoadingMore &&
      !isReachingEnd
    ) {
      setSize(size + 1); // Load more posts
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [isLoadingMore, isReachingEnd]);

  return (
    <>
      <Navbar select={"Scoreboard"} session={session} />
      <ScoreTab
        selected={"All-Rounder"}
        pages={"Rank"}
        pageLink={"/scoreboard"}
        scorecard={"Rankings"}
        scorecardLink={"/scoreboard/scorecard"}
        groups={"All-Rounder"}
        groupsLink={"/scoreboard/scorecard/allrounder"}
      />
      <section className={styles.scorecard_page} id="myDIV1">
        <style jsx global>
          {`
            #myDIV1 {
              margin-top: 0rem;
            }
          `}
        </style>
        <div className={styles.scorecard_page_center}>
          {/* dropdown for programing language */}
          <div className={styles.Scorecard_center}>
            {userData?.data
              .map((value, index) => {
                return (
                  <ScoreCard
                    key={value._id}
                    num={index}
                    userData={value}
                    overallData={userData.data}
                    rankUser={value.rank}
                  />
                );
              })}

            {isLoadingMore && (
              <div
                className={loaderStyles.loaderCover}
                style={{ height: isLoadingInitialData ? "70vh" : "auto" }}
              >
                <div className={loaderStyles.loader} />
              </div>
            )}

            {isReachingEnd && (
              <div className={loaderStyles.ParaCover}>
                <p className={loaderStyles.loaderCoverP}>
                  You might have seen all the updates.
                </p>
              </div>
            )}
          </div>
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

export default AllRounder;
