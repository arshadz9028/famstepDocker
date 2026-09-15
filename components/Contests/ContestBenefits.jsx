import React from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import ClosePart from "../profileComp/ClosePart";
import { FaRegCheckCircle } from "react-icons/fa";

function ContestBenefits({ setContestBenefit, contestBenefit }) {
  const CloseModal = (e) => {
    if (e.target.id == "wholeAction") {
      setContestBenefit(false);
    }
  };

  return (
    <>
      <div className={styles.wholeAction} id="wholeAction" onClick={CloseModal}>
        <style jsx global>{`
          #mypic {
            width: 75rem;
            height: 90vh;
            overflow-y: auto;
          }

          #content {
            color: black;
            text-align: left;
          }
          #paragraph {
            margin-bottom: 1rem;
            font-weight: 400;
            font-size: 2rem;
          }
          #content > p {
            line-height: 3rem;
            margin-bottom: 1rem;
            font-weight: 400;
          }

          #pointsHeading {
            font-weight: 600;
            color: #08529b;
          }

          #checkIcon {
            width: 1.8rem;
            height: 1.8rem;
            color: #08529b;
            margin-bottom: -0.4rem;
          }

          @media (max-width: 767px) {
            #mypic {
              width: 100vw;
              height: 100vh;
              border-radius: 0rem;
              &::-webkit-scrollbar-track {
                border-radius: 0rem 0rem 1.5rem 0rem;
              }
              &::-webkit-scrollbar-thumb {
                border-radius: 0rem 0rem 1.5rem 0rem;
              }
            }
          }
        `}</style>
        <div className={styles.mypic} id="mypic">
          <ClosePart
            title={"Famstep Contests"}
            CloseTheModal={setContestBenefit}
          />
          <div className={styles.upper_sec} id="upper_sec">
            <p id="paragraph">
              Level Up with Famstep Contests: Unlock Your Path to Success!
            </p>
            <div id="content">
              <p>
                At Famstep, our contests are designed to be more than just
                challenges—they&apos;re opportunities for you to grow, showcase
                your talents, and advance in your career journey. Although no
                contests are available at the moment, here&apos;s what you can
                look forward to:
              </p>
              <p>
                <FaRegCheckCircle id="checkIcon" />{" "}
                <span id="pointsHeading">Level-Wise Competitions:</span> Our
                contests are structured by levels, allowing you to progressively
                challenge yourself, unlock new stages, and achieve higher
                mastery in your field.
              </p>
              <p>
                <FaRegCheckCircle id="checkIcon" />{" "}
                <span id="pointsHeading">Skill Enhancement:</span> Each contest
                is tailored to help you hone specific skills, making you more
                competitive in the job market or building a freelancing career.
              </p>
              <p>
                <FaRegCheckCircle id="checkIcon" />{" "}
                <span id="pointsHeading">Recognition and Rewards:</span> By
                Participating in contests opens doors to earning recognition,
                certificates, and rewards that significantly enhance your
                professional portfolio.
              </p>
              <p>
                <FaRegCheckCircle id="checkIcon" />{" "}
                <span id="pointsHeading">Networking Opportunities:</span>{" "}
                Contests bring together like-minded individuals, giving you a
                chance to connect, collaborate, and expand your professional
                network.
              </p>
              <p>
                <FaRegCheckCircle id="checkIcon" />{" "}
                <span id="pointsHeading">Career Advancement:</span> Stand out by
                winning or participating in contests—boost your confidence and
                increase your chances of landing better opportunities.
              </p>
              <p>
                <FaRegCheckCircle id="checkIcon" />{" "}
                <span id="pointsHeading">Continuous Learning:</span> Every
                contest, win or lose, offers invaluable feedback and learning
                experiences that contribute to your growth. Additionally,
                winners&apos; solutions are interchanged for instant logic
                building, helping you sharpen your problem-solving skills.
              </p>
              <p style={{ fontWeight: "500", color: "#545454" }}>
                Stay tuned to unlock the next level of opportunity when our
                contests return! In the meantime, keep leveling up your skills
                with Famstep.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContestBenefits;
