import React, { useState } from "react";
import styles from "../../styles/EditProfile.module.scss";
import ClosePart from "../../components/profileComp/ClosePart";
import FriendsListComp from "../../components/profileComp/FreindsList";


function ConnectionsList({
  setFriendList,
  friendList,
  userId,
  followerData,
  session,
  groupData, follow, followers,admin
}) {
  const [toggleState, setToggleState] = useState("Members");
  const [searchinput, setSearchinput] = useState("");
  const [nameList, setNameList] = useState([]);
  const closeModel = (e) => {
    if (e.target.id === "main") {
      setFriendList(false);
    }
  };
  const fetchSearch = async (e) => {
    // setSearch(true)
    e.preventDefault();
    setSearchinput(e.target.value);
    const searchRegex = new RegExp(`${e.target.value}`, "i");
    const filteredFollowers = groupData?.data?.members.filter((follower) =>
      searchRegex.test(follower.user.name)
    );
    setNameList(filteredFollowers);
  }
  return (
    <>
      <div className={styles.main} id="main" onClick={closeModel}>
        <div className={styles.fullEdit}>
          <ClosePart title={`${groupData?.data.members?.length} Members`} CloseTheModal={setFriendList} />

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

          <div className={styles.friendsList}>
            {searchinput && (
              <>
                {nameList != '' ? (
                  nameList?.map((follower) => 
                  
                  (
                    <FriendsListComp
                      key={follower.id}
                      followers={{
                        'userid':
                        {
                          'image': follower.user.image,
                          'name': follower.user.name,
                          'designation': follower.user.designation,
                          '_id':follower.user._id
                        }
                      }}
                      toggleState={toggleState}
                      nameList={nameList}
                      session={session}
                      followerData={followerData}
                      userId={userId}
                    />
                  ))
                ) : (
                  <div className={styles.noResult}>
                    <p>No results found.</p>

                  </div>
                )}
              </>
            )}
            {!searchinput  && (
            <>
            {groupData?.data.members?.map((value, index) => {
              const filteredfollowings = followers?.following.some((user) =>
                value.user._id === user.userid._id)

              return (<FriendsListComp
                key={value._id}
                followers={{
                  'userid':
                  {
                    'image': value.user.image,
                    'name': value.user.name,
                    'designation': value.user.designation,
                    '_id':value.user._id,
                    
                  }
                }}
                admin={admin}
                follow={follow}
                toggleState={toggleState}
                session={session}
                userId={ value.user._id}
                filteredfollowings={filteredfollowings}
                setFriendList={setFriendList}
              />)
            })} 
            </>)}
          </div>
        </div>
      </div>
    </>
  );
}

export default ConnectionsList;
