import React from "react";
import styles from "../../styles/EditProfile.module.scss";
import { FiSearch } from "react-icons/fi";
import Router, { useRouter } from "next/router";

function FollowerTab({
  toggleState,
  setToggleState,
  followerData,
  followSearch,
  setFollowSearch,
  setSearchinput,
}) {
  const Router = useRouter();
  const pathName = Router.pathname.split("/")[1];
  return (
    <>
      <div className={styles.content_center}>
        <div
          className={followSearch ? `  ${styles.search_tabs}` : styles.tabs}
          onClick={(e) => {
            setFollowSearch(!followSearch);
            e.preventDefault();
          }}
        >
          <FiSearch className={styles.SearchIcon} />
          {followSearch ? (
            <div className={styles.SearchIndicator} />
          ) : (
            <div className={styles.SearchIndicator1} />
          )}
        </div>
        <div
          className={
            toggleState === "Followers"
              ? `  ${styles.active_tabs}`
              : styles.tabs
          }
          onClick={(e) => {
            if (followerData?.followers.length) {
              setToggleState("Followers");
              setSearchinput("");
              e.preventDefault();
            } else if (pathName === "me" || pathName === "network") {
              setToggleState("Followers");
            }
          }}
        >
          {toggleState === "Followers" ? (
            <div className={styles.indicator} />
          ) : (
            <div className={styles.indicator1} />
          )}
          <p>
            {" "}
            <span style={{ marginRight: ".3rem" }}>Followers</span>{" "}
            {followerData?.followers.length}
          </p>
        </div>
        <div
          className={
            toggleState === "Following"
              ? `   ${styles.active_tabs}`
              : styles.tabs
          }
          onClick={(e) => {
            if (followerData?.following.length) {
              setToggleState("Following");
              setSearchinput("");
              setToggleState("Following");

              e.preventDefault();
            } else if (pathName === "me"|| pathName === "network") {
              setToggleState("Following");
            }
          }}
        >
          {toggleState === "Following" ? (
            <div className={styles.indicator} />
          ) : (
            <div className={styles.indicator1} />
          )}
          <p>
            {" "}
            <span style={{ marginRight: ".3rem" }}>Following</span>{" "}
            {followerData?.following.length}
          </p>
        </div>
        <div
          className={
            toggleState === "Praise"
              ? `    ${styles.active_tabs} `
              : styles.tabs
          }
          onClick={(e) => {
            if (followerData?.praise.length) {
              setToggleState("Praise");
              setSearchinput("");

              e.preventDefault();
            } else if (pathName === "me" || pathName === "network") {
              setToggleState("Praise");
            }
          }}
        >
          {toggleState === "Praise" ? (
            <div className={styles.indicator} />
          ) : (
            <div className={styles.indicator1} />
          )}
          <p>
            {" "}
            <span style={{ marginRight: ".3rem" }}>Praise</span>{" "}
            {followerData?.praise.length}
          </p>
        </div>
      </div>
    </>
  );
}

export default FollowerTab;
