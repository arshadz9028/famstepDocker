import React from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import Interchange_result from "../Interchange_result";
import { BiError } from "react-icons/bi";
import Image from "next/image";
import codeSumbission from "../../assets/newIcons/codeSumbission.png";
import { FaRegCheckCircle } from "react-icons/fa";

function CodeSubmission({
  codeData,
  session,
  setIcResult,
  mutatecodeData,
  codeTest,
  elapsedTime,
  showInterchange,
  setshowInterchange,
  follow,
  subData, rankData, IcResult
}) {
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "wholeAction") {
      setIcResult(false);
    }
  };
  const filteredScore = codeData?.subData?.submission.filter(
    (value) => value.userSub === session.user.id
  )[0];
  return (
    <>
      <Interchange_result
        session={session}
        codeData={codeData}
        setshowInterchange={setshowInterchange}
        showInterchange={showInterchange}
        mutatecodeData={mutatecodeData}
        elapsedTime={elapsedTime}
        setIcResult={setIcResult}
        follow={follow}
        subData={subData}
        rankData={rankData}
      />

      {IcResult && (
        <div className={styles.wholeAction}>
          {codeTest.success === true ? (
            <div id="wholeAction">
              <div className={styles.mypic}>
                <div className={styles.upper_sec}>
                  <div
                    style={{
                      width: "10rem",
                      height: "10rem",
                      color: "#D9D9D9",
                      margin: "auto",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      alt="icon"
                      src={codeSumbission}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <p style={{ color: "black" }}>
                    Awesome, you nailed it with a
                  </p>
                  <p>
                    <strong style={{ fontSize: "2.2rem", fontWeight: "500" }}>
                      score of {filteredScore?.score}!
                    </strong>
                  </p>
                  <p style={{ color: "black" }}>
                    <FaRegCheckCircle
                      style={{
                        width: "1.8rem",
                        height: "1.8rem",
                        color: "#08529B",
                        marginBottom: "-.4rem",
                      }}
                    />{" "}
                    Review the submitted entries and stay tuned for the
                    announcement of the top 10 rankers. The best is yet to come!
                  </p>

                  {/* <pre> submitted </pre> */}
                </div>
                <div
                  className={styles.icons_name}
                  onClick={() => {
                    setIcResult(false);
                    setshowInterchange(true);
                  }}
                >
                  <div className={styles.name}>
                    <p>Next</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              // className={styles.wholeAction}
              id="wholeAction"
              onClick={closeModel}
            >
              <div className={styles.mypic}>
                <div className={styles.upper_sec}>
                  <BiError
                    style={{
                      width: "8rem",
                      height: "8rem",
                      color: "#D9D9D9",
                      margin: "auto",
                    }}
                  />
                  <p style={{ lineHeight: "3rem" }}>{codeTest.message}</p>
                </div>
                <div
                  className={styles.icons_name}
                  onClick={() => {
                    setIcResult(false);
                  }}
                >
                  <div className={styles.name}>
                    <p>Close</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CodeSubmission;
