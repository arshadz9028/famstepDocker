import React, { useState, useContext, useEffect } from "react";
import styles from "../../styles/Message.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { getSender, getImage, getId, whoIsSender } from "../../config/ChatLogics";
import { ContextProvider } from "../../global/context";
import axios from "axios";
import Link from "next/link";
import { MdInsertPhoto } from "react-icons/md";
function Messagefriend({
  message,
  val,
  session,
  setNewmessage,
  mutateMessageData,
  otherUserId,

}) {
  const Router = useRouter();
  const { setToggle, selected, handleChatClick, totalMessageNotify, setTotalMessageNotify, setmessgeFriends } = useContext(ContextProvider);
  // const [active, setactive] = useState()
  let getid = getId(session, val.users);


  useEffect(() => {
    if (!selected) {
      handleChatClick(message);
    }
  }, [])


  const handleMesgClick = async (message) => {

    try {
      const res = await axios.put(`/api/message/messageSeen/?message=${message}`);
      setTotalMessageNotify(prevMessages => prevMessages.filter(msg => msg._id !== message));
      setmessgeFriends(prevMessages => prevMessages.map(msg =>
        msg._id === message ? res.data.message : msg
      ));
      mutateMessageData();
    } catch (error) { }
  };
  const userIndex = val.chatLength.findIndex(entry => entry.senderUser == session);
  return (
    <>
      {!val.chatLength[userIndex]?.isClear &&
        <Link href={`/message/${val._id}`}>

          <div
            className={styles.dp_name}
            onClick={async (e) => {
              handleMesgClick(val._id);
              handleChatClick(val._id);
              setNewmessage(false);
              setToggle(true);
            }}
            style={selected === val._id ? { backgroundColor: "#E6EEF5" } : {}}
          >
            <div className={styles.search_dpCover}>
              <div className={styles.search_dp}>
                <Image src={getImage(session, val.users)} alt="pro_photo" fill
                  style={{
                    objectFit: "cover",
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
              <div className={styles.name2}>
                <p>
                  {!val.isGroupChat ? getSender(session, val.users) : val.chatName}
                </p>
                <div className={styles.active_status}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {val.latestMessage && (
                      <>
                        <p style={{ margin: '0rem .5rem 0rem 0rem' }}>{`${whoIsSender(session, val.latestMessage.sender)} :`} </p>
                        {!val.latestMessage.attachUrl ? val.latestMessage.content.length > 15
                          ? val.latestMessage.content.substring(0, 15) + "..."
                          : val.latestMessage.content :
                          <>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <MdInsertPhoto style={{ margin: '0rem .2rem 0rem 0rem', width: '1.5rem', height: '1.5rem' }} />
                              <p style={{ fontWeight: '500' }} >Photo</p>
                            </div>
                          </>}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {val.chatLength.map((len, index) => {

              if (
                session === len.recieverUser &&
                otherUserId !== len.senderUser &&
                len.isSeen === false
              ) {
                return (
                  <div key={index} className={styles.message_dot}>
                    {len.counterMessage}
                  </div>
                );
              }
              return null;
            })}
          </div>

        </Link>

      }
    </>
  );
}

export default Messagefriend;
