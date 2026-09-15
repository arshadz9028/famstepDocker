import React, { useState, useEffect } from "react";
import Navbar from "../../../layouts/Navbar";
import styles from "../../../styles/Scoreboard.module.scss";
import loaderStyles from "../../../styles/ImageLoading.module.scss";
import ScoreTab from "../../../layouts/ScoreBoard/ScoreTab";
import Dropdown from "../../../components/ide/Dropdown";
import ScoreCard from "../../../components/Scoreboard/ScoreCard";
import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import axios from "axios";
import NoCardsMessage from "../../../components/network/NoCardsMessage";
import { FaRankingStar } from "react-icons/fa6";
import useSWRInfinite from "swr/infinite";

async function fetchUsers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
function ScoreBoard({ session }) {
  const defaultLang = { id: 1, language: "python", extension: ".py" };
  const [selectSkills, setSelectSkills] = useState("");
  const [selectedLang, setselectedLang] = useState(defaultLang);
  const selecLanguage = selectedLang.language;

  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateImageData,
  } = useSWRInfinite(
    (index) =>
      `/api/scoreboard/scorecardLang?selectedLang=${selecLanguage}&page=${
        index + 1
      }&limit=12`,
    fetchUsers,
    {
      revalidateOnFocus: false,
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
        selected={"Rankings"}
        pages={"Rank"}
        pageLink={"/scoreboard"}
        scorecard={"Rankings"}
        scorecardLink={"/scoreboard/scorecard"}
        groups={"All-Rounder"}
        groupsLink={"/scoreboard/scorecard/allrounder"}
      />

      <section className={styles.scorecard_page} id="myDIV1">
        <div className={styles.scorecard_page_center}>
          {/* dropdown for programing language */}
          <Dropdown
            selectedLang={selectedLang}
            setselectedLang={setselectedLang}
            selectSkills={selectSkills}
            setSelectSkills={setSelectSkills}
          />
          {userData.data.length ? (
            <>
              <div className={styles.Scorecard_center}>
                {userData?.data
                .map((value, index) => {
                  return (
                    <ScoreCard
                      key={value._id}
                      num={index}
                      overallData={userData.data}
                      userData={value}
                      rankUser={value.skills[0].rank}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {!isLoadingInitialData && (
                <NoCardsMessage
                  MessageRectIcon={FaRankingStar}
                  MessageContentSecond={selectedLang?.language}
                  MessageContent={`Ranking for the selected language is currently unavailable.`}
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

          {isReachingEnd && userData.data.length != 0 && (
            <div className={loaderStyles.ParaCover}>
              <p className={loaderStyles.loaderCoverP}>
              You might have seen all the updates.
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

  await connectDb();
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

export default ScoreBoard;
