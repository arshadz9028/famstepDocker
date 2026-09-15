import React, { useState } from "react";
import Image from "next/image";
import UnsendMessage from "../../layouts/Message/UnsendMessage";
import {
  isLastMessage,
  isSameSender,
  marginBottom,
} from "../../config/ChatLogics";
import styles from "../../styles/Message.module.scss";
import MessageContent from "./MessageContent";

function MessageBox({ messages, session }) {
  const [showDots, setShowDots] = useState(false);
  const [unsend, setUnsend] = useState(false);
  const user = session?.user;
  
  return (
    <>
      {unsend && <UnsendMessage messageId={messages} setunsend={setUnsend} />}
      {messages &&
        messages.map((message, i) => {
          const isSender =
            message.UserS?.currentUser == user.id && !message.UserS?.isCleared;
          const isReceiver =
            message.UserR?.recieverUser == user.id && !message.UserR?.isCleared;
          if (isSender || isReceiver) {
            return (
              <div
                key={message._id}
                className={styles.message_text}
                style={{
                  display: "flex",
                  marginBottom: marginBottom(messages, i) ? "1rem" : 0,
                  // border:"1px solid black"
                }}
                onMouseEnter={(e) => {
                  const dotsContainer =
                    e.currentTarget.querySelector(".dots-container");
                  if (dotsContainer) {
                    dotsContainer.style.display = "block";
                  }
                }}
                onMouseLeave={(e) => {
                  const dotsContainer =
                    e.currentTarget.querySelector(".dots-container");
                  if (dotsContainer) {
                    dotsContainer.style.display = "none";
                    setShowDots(false);
                  }
                }}
              >
                {(isSameSender(messages, message, i, user.id) ||
                  isLastMessage(messages, i, user.id)) && (
                  <div className={styles.dp}>
                    {message.sender && message.sender.image ? (
                      <Image
                        src={message.sender.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "fit" }}
                        alt="sender image"
                      />
                    ) : (
                      <div>Image Not Available</div>
                    )}
                  </div>
                )}

                <MessageContent
                  message={message}
                  user={user}
                  messages={messages}
                  i={i}
                  showDots={showDots}
                  setShowDots={setShowDots}
                  unsend={unsend}
                  setUnsend={setUnsend}
                />
              </div>
            );
          }
          return null;
        })}
    </>
  );
}

export default MessageBox;
