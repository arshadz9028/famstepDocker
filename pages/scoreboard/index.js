import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/Scoreboard.module.scss";
import ScoreTab from "../../layouts/ScoreBoard/ScoreTab";
import WinnersCard from "../../components/WinnersCard";
import connectDb from "../../database/conn";
import User from "../../model/userModel";
import { getSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "../../node_modules/react-syntax-highlighter/dist/cjs/styles/hljs";
import UserFollow from "../../model/followModel";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import NoCardsMessage from "../../components/network/NoCardsMessage";
import { PiRankingDuotone } from "react-icons/pi";

// Added by Arshad
async function fetchCode(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
async function fetchUsers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
function WinnerCard({ session, allFollowers }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [code, setCode] = useState("");
  const router = useRouter();
  const { stage } = router.query;
  const {
    data: codeData,
    mutate: mutatecodeData,
    error: UserDataError,
  } = useSWR(`/api/code/codeFetch/?stage=${stage}`, fetchCode);

  const isMobile = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      isMobile.current = window.innerWidth <= 767; // Update the ref value
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCard = (id) => {
    if (isMobile.current) {
      router.push({
        pathname: "/profile/[id]",
        query: { id }, // Pass the query parameter to the new route
      });
    } else {
      setSelectedUser(id);
    }
  };
  const filtered = codeData?.rankData.filter(
    (val) => val.userId?._id == selectedUser
  )[0];
  // this request is for fetching winners data
  const codepath = filtered?.solution;

  useEffect(() => {
    const fetchCode = async () => {
      try {
        if (codepath) {
          const response = await fetch(codepath);

          const codeContent = await response.text();
          const match = codeContent.match(/`([^`]*)`/);
          const extractedCode = match && match[1] ? match[1] : "";

          setCode(extractedCode);
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      }
    };

    fetchCode();
  }, [codepath]);
  const {
    data: usersData,
    mutate: mutatefollowerData,
    error: followerError,
  } = useSWR("/api/profile/follow/userFetch", fetchUsers);

  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "1.6rem", // Set your custom font size
  };

  return (
    <>
      <Navbar select={"Scoreboard"} session={session} />
      {/* upper tabs for score page */}
      <ScoreTab
        selected={"Winners"}
        pages={"Winners"}
        pageLink={"/scoreboard"}
        scorecard={"Scorecard"}
        scorecardLink={"/scoreboard/scorecard"}
        groups={"Freelance Hub"}
        groupsLink={"/scoreboard/groups"}
        earning={"Auction & Reviews"}
        earningLink={"/scoreboard/earnings"}
      />

      <section className={styles.scoreboard}>
        <div className={styles.scoreboard_center}>
          {codeData ? (
            <>
              {/* caption after score tab */}
              <div className={styles.scoreboard_caption}>
                <p>
                  The following is the list of winners for today&apos;s contest
                </p>
                <div className={styles.level}>
                  <p className={styles.level_p}>LEVEL</p>
                  <p className={styles.level_number}>
                    {codeData?.subData.stage}
                  </p>
                </div>
              </div>

              {/* card and question after caption */}
              <div className={styles.score_card_grid}>
                <div className={styles.left_card}>
                  {/* Added map for showing winners */}
                  {codeData &&
                    codeData.rankData
                      .sort((a, b) => b.score - a.score) // Sort rankData based on rank
                      .map((value, index) => {
                        const overAllRank = usersData?.overallData.findIndex(
                          (element) => element._id === value.userId?._id
                        );
                        const filteredFollower = allFollowers.filter(
                          (vals) => vals.user === value.userId?._id
                        );

                        return (
                          <div
                            key={value._id}
                            onClick={() => {
                              handleCard(value.userId._id);
                            }}
                            className={styles.left_cardCover}
                          >
                            <WinnersCard
                              value={value}
                              ranks={index}
                              AllFollowers={filteredFollower}
                              overAllRank={overAllRank}
                            />
                          </div>
                        );
                      })}
                </div>

                <div className={styles.right_card}>
                  <>
                    {!selectedUser ? (
                      <div className={styles.problem}>
                        <p className={styles.problem_written}>Challenge</p>
                      </div>
                    ) : (
                      <div className={styles.answere}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <IoIosArrowBack
                            className={styles.problemIcon}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedUser(null)}
                          />

                          <div
                            className={styles.AnswereImage}
                            onClick={() => {
                              if (filtered?.userId._id !== session.user.id) {
                                router.push(`/profile/${filtered?.userId._id}`);
                              }
                            }}
                          >
                            <Image
                              alt="userImage"
                              src={filtered?.userId?.image}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                          <p
                            className={styles.answere_written}
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (filtered?.userId._id !== session.user.id) {
                                router.push(`/profile/${filtered?.userId._id}`);
                              }
                            }}
                          >
                            {filtered?.userId?.name}
                          </p>
                        </div>
                        <p
                          className={styles.answere_written}
                          style={{ color: "#08529B", marginRight: ".5rem" }}
                        >
                          {codeData?.subData?.language}
                        </p>
                      </div>
                    )}
                  </>

                  {/* handling question here */}
                  <div className={styles.questions}>
                    {selectedUser ? (
                      <div className={styles.code_section}>
                        <SyntaxHighlighter
                          wrapLongLines={true}
                          style={a11yDark}
                          codeTagProps={{ style: customCodeStyle }}
                          className={styles.code_section}
                          customStyle={{
                            whiteSpace: "pre-wrap", // Wrap the text
                            wordBreak: "break-all", // Break long words
                            wordWrap: "break-word",
                            overflowX: "hidden", // Hide horizontal overflow
                            padding: "1rem 1rem 2rem",
                            borderRadius: "1rem",
                          }}
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <p className={styles.question_written}>
                        {codeData?.subData?.question}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <NoCardsMessage
              MessageRectIcon={PiRankingDuotone}
              MessageContent={`While there’s no winner list yet, remember: every great journey begins with a single step. Keep coding and stay inspired!`}
            />
          )}
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
  const { isNewUser } = session?.user;
  if (isNewUser) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }
  try {
    await connectDb();
    const userData = await User.find({});
    const allFollowers = await UserFollow.find({});

    return {
      props: {
        session,
        userData: JSON.parse(JSON.stringify(userData)),
        allFollowers: JSON.parse(JSON.stringify(allFollowers)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
}

export default WinnerCard;
