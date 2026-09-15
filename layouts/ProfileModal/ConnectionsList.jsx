import React, { useState } from "react";
import styles from "../../styles/EditProfile.module.scss";
import ClosePart from "../../components/profileComp/ClosePart";
import FollowerTab from "../../components/profileComp/FollowerTab";
import FriendsListComp from "../../components/profileComp/FreindsList";
import NoFollowerCover from "../../components/profileComp/NoFollowerCover"
import { FaUsers } from "react-icons/fa6";
import { IoPersonAddSharp } from "react-icons/io5";
import { PiHandsClappingFill } from "react-icons/pi";

function ConnectionsList({
  setFriendList,
  friendList,
  userId,
  followerData,
  mutatefollowerData,
  session,
  FollowerDataSession,
}) {
  const [toggleState, setToggleState] = useState(friendList);
  const [followSearch, setFollowSearch] = useState(false);
  const [searchinput, setSearchinput] = useState("");
  const [nameList, setNameList] = useState([]);

  const closeModel = (e) => {
    if (e.target.id === "main") {
      setFriendList(false);
    }
  };
  const fetchSearch = async (e) => {
    e.preventDefault();
    setSearchinput(e.target.value);

    if (e.target.value.trim()) {
      const searchRegex = new RegExp(`${e.target.value}`, "i");

      if (toggleState === "Followers") {
        const filteredFollowers = followerData?.followers.filter(
          (follower) =>
            searchRegex.test(follower.userid.name) ||
            searchRegex.test(follower.userid.username)
        );

        setNameList(filteredFollowers);
      } else if (toggleState === "Following") {
        const filteredFollowers = followerData.following.filter(
          (follower) =>
            searchRegex.test(follower.userid.name) ||
            searchRegex.test(follower.userid.username)
        );

        setNameList(filteredFollowers);
      }
    } else {
      setNameList("");
    }
  };

  return (
    <>
      <div className={styles.main} id="main" onClick={closeModel}>
        <div className={styles.fullEdit}>
          <ClosePart title={toggleState} CloseTheModal={setFriendList} />
          <div className={styles.followerTab}>
            <FollowerTab
              toggleState={toggleState}
              setToggleState={setToggleState}
              followSearch={followSearch}
              setFollowSearch={setFollowSearch}
              followerData={followerData}
              setSearchinput={setSearchinput}
            />
          </div>
          {followSearch && (
            <div className={styles.connectionSearch}>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                onChange={fetchSearch}
                value={searchinput}
              />
            </div>
          )}
          <div className={styles.friendsList}>
            {searchinput && (
              <>
                {nameList != "" ? (
                  nameList?.map((follower) => (
                    <FriendsListComp
                       key={follower.userid._id}
                      followers={follower}
                      toggleState={toggleState}
                      nameList={nameList}
                      session={session}
                      followerDataFrnd={followerData}
                      userId={userId}
                      setFriendList={setFriendList}
                      mutatefollowerData={mutatefollowerData}
                    />
                  ))
                ) : (
                  <div className={styles.noResult}>
                    <p>No results found.</p>
                  </div>
                )}
              </>
            )}

            {!searchinput && toggleState === "Followers" && (
              <>
                {followerData?.followers.length > 0 ? (
                  followerData?.followers.map((follower) =>{ 
                  return(
                    <FriendsListComp
                      key={follower._id}
                      setFriendList={setFriendList}
                      followers={follower}
                      toggleState={toggleState}
                      nameList={nameList}
                      session={session}
                      followerDataFrnd={followerData}
                      FollowerDataSession={FollowerDataSession}
                      userId={userId}
                      mutatefollowerData={mutatefollowerData}
                    />
                  )})
                ) : (
                  <>
                   <NoFollowerCover
                    NoPostIcons={FaUsers}
                    NoPostTagLine={"Your Followers"}
                    NoPostMessage={"All the people who follow you will be displayed here."}
                   />
                  </>
                )}
              </>
            )}

            {!searchinput && toggleState === "Following" && (
              <>
                {followerData?.following.length > 0 ? (
                  followerData?.following.map((follower) => {
                  
                  return(
                    <FriendsListComp
                      key={follower.userid._id}
                      followers={follower}
                      toggleState={toggleState}
                      nameList={nameList}
                      session={session}
                      followerDataFrnd={followerData}
                      userId={userId}
                      setFriendList={setFriendList}
                      mutatefollowerData={mutatefollowerData}
                    />
                  )})
                ) : (
                  <>
                   <NoFollowerCover
                    NoPostIcons={IoPersonAddSharp}
                    NoPostTagLine={"Connections"}
                    NoPostMessage={"As you follow people, their profiles will appear here."}
                   />
                  </>
                )}
              </>
            )}
            {!searchinput && toggleState === "Praise" && (
              <>
                {followerData?.praise.length > 0 ? (
                  followerData?.praise.map((follower) => (
                    <FriendsListComp
                      key={follower.userid._id}
                      toggleState={toggleState}
                      followers={follower}
                      nameList={nameList}
                      setFriendList={setFriendList}
                      mutatefollowerData={mutatefollowerData}
                    />
                  ))
                ) : (
                  <>
                   <NoFollowerCover
                    NoPostIcons={PiHandsClappingFill}
                    NoPostTagLine={"Praise"}
                    NoPostMessage={"When top users appreciate your work, their profiles will appear here."}
                   />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ConnectionsList;
