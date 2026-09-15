import React, { useState, useContext } from "react";
import styles from "../../styles/Message.module.scss";
import SearchFriend from "../../components/message/SearchFriend";
import { BiChevronLeft } from "react-icons/bi";
import axios from "axios";
import { useRouter } from "next/router";
import { ContextProvider } from "../../global/context";

function NewMessage(props) {
  const { setToggle, handleChatClick } = useContext(ContextProvider);

  const [searchinput, setSearchinput] = useState("");
  const [nameList, setNameList] = useState([]);
  const [showError, setShowError] = useState(false);
  const [search, setSearch] = useState(false);
  const [length, setLength] = useState();
  const [newSelected, setNewSelected] = useState("");
  const [inputDisable, setInputDisable] = useState("disabled");

  const Router = useRouter();

  const fetchSearch = async (e) => {
    e.preventDefault();
    setSearchinput(e.target.value);
    setInputDisable("");
    setNewSelected("");

    if (e.target.value) {
      let value = e.target.value;
      setSearch(true);
      try {
        const response = await axios.put("/api/auth/searchFetch", {
          value,
        });
        setShowError(true);
        setNameList(response.data.message);
        setLength(response.data.message.length);
      } catch (error) {
        if (error.response?.data.error) {
          setShowError(false);
        }
      }
    } else {
      setSearch(false);
    }
  };

  const chatWithSelected = async () => {
    try {
      const res = await axios.post(`/api/message/chat`, { newSelected });
      await Router.push(`/message/${res.data._id}`);
      handleChatClick(res.data._id);
      props.setNewmessage(false);
      setToggle(true);
    } catch (error) {
      return <> Failed to load profile page. </>;
    }
  };
  return (
    <>
      <div
        className={styles.new_message}
        style={props.newmessage ? { display: "block" } : {}}
      >
        <div className={styles.new_message_upper}>
          <div className={styles.new_message_upper_left}>
            <div
              className={styles.Mob_backarrow}
              onClick={() => {
                props.setNewmessage(false);
              }}
            >
              <BiChevronLeft className={styles.back_arrow} />
            </div>
            <p className={styles.text_new_message}>New Message</p>

            <div className={styles.chat_button_mobile}>
              <input
                type="button"
                value="Chat"
                disabled={inputDisable}
                style={newSelected ? { color: "#08529B" } : {}}
                onClick={chatWithSelected}
              />
            </div>
          </div>
          <div className={styles.search_wrap}>
            <label htmlFor="search">To: </label>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search..."
              value={searchinput}
              onChange={fetchSearch}
              autoFocus
            />
          </div>
        </div>
        <div
          className={styles.records}
          style={{ overflowY: length > 4 ? "scroll" : "hidden" }}
        >
          {showError ? (
            <>
              {search &&
                nameList.map((val) => (
                  <SearchFriend
                    key={val._id}
                    val={val}
                    setNewSelected={setNewSelected}
                    newSelected={newSelected}
                  />
                ))}
            </>
          ) : (
            <>
              <p className="userNotFound"> User not found </p>
            </>
          )}
        </div>
        <div className={styles.chat_button}>
          <input
            type="button"
            value="Chat"
            disabled={inputDisable}
            style={newSelected ? { backgroundColor: "#08529B" } : {}}
            onClick={chatWithSelected}
          />
        </div>
      </div>
    </>
  );
}

export default NewMessage;
