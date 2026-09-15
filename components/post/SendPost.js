import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/inviteFriend.module.scss";
import { useFormik } from "formik";
import { registerskills } from "../../lib/validate";
import SelectedProgramingCard from "../../components/SelectedProgramingCard";
import axios from "axios";
import Image from "next/image";
import ClosePart from "../../components/profileComp/ClosePart";

function SendPost({ setsendModel, value }) {
  const [selectUsers, setSelectUsers] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [error, setError] = useState();
  const [finalUser, setfinalUser] = useState([]);
  const skillsRef = useRef(null);

  const deleteSelectedProgram = (value) => {
    setSelectedUsers((oldItems) => {
      return oldItems.filter((val) => {
        return val !== value;
      });
    });
  };
  const [nameList, setNameList] = useState([]);

  //close the modal
  const closeModel = (event) => {
    const className = event.target.getAttribute("id");
    if (className === "help_modalOuter") {
      setsendModel(false);
    }
  };

  //handle dropdown
  const handleClickOutside = (e) => {
    if (!skillsRef.current.contains(e.target)) {
      setDropdown(false);
      formik.setFieldValue("skillsOption", selectedUsers);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  //controlling input
  const FindeUsers = async (e) => {
    setSelectUsers(e.target.value);

    let value = e.target.value;

    if (e.target.value.length > 0) {
      try {
        const response = await axios.post("/api/auth/find/findSearch", {
          value,
        });
        setNameList(response.data.message);
        setError("");

        setDropdown(true);
        
      } catch (error) {
        if (error) {
          setError("User not found.");
          setDropdown(false);
        }
      }

    } else {
      setDropdown(false);
      formik.setFieldValue("taggedUser", "");
    }
  };

  //using formik for validation and form control
  const formik = useFormik({
    initialValues: {
      skillsOption: "",
    },
    validate: registerskills,
    // onSubmit
  });

  const handleLanguageSelection = (option) => {
    const selectedUsersExists = selectedUsers.includes(option.name);

    if (selectedUsersExists) {
      setError("User has already been selected");
    } else {
      setError("");
      setSelectUsers("");
      setSelectedUsers((value) => [...value, option.name]);
      setfinalUser((value) => [...value, option._id]);
      formik.setFieldValue("skillsOption", option.name);
      setDropdown(false);
    }
  };
  //on sumbit
  const imageSend = value?.images[0]?.image;
  const content = value?.desc;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length > 0) {
      await axios.put("/api/home/post/sendPost", {
        imageSend,
        content,
        finalUser,
        imageId:value._id
      });
    } else {
      setError("Please ensure you select at least one user.");
    }
    setsendModel(false);
  };

  return (
    <>
      <div
        id="help_modalOuter"
        className={styles.help_modalOuter}
        onClick={closeModel}
      >
        <div className={styles.skillModal_center}>
          <ClosePart CloseTheModal={setsendModel} title={"Select friends"} />

          <form
            onSubmit={handleSubmit}
            autoComplete=""
            className={styles.countryDropDown_form}
          >
            <div className={styles.addedSkills}>
              {selectedUsers.map((value, index) => {
                return (
                  <SelectedProgramingCard
                    key={index}
                    value={value}
                    deleteSelectedProgram={deleteSelectedProgram}
                  />
                );
              })}
            </div>

            <div className={styles.country_dropDown} ref={skillsRef}>
              <span className={styles.errorSet}>{error}</span>

              <div className={styles.input_bx}>
                <input
                  type="option"
                  id="skillsOption"
                  name="skillsOption"
                  value={selectUsers} // Use selectedOption here
                  onClick={FindeUsers}
                  onChange={FindeUsers}
                  autoFocus
                  onBlur={formik.handleBlur}
                  // {...formik.getFieldProps('designation')}
                  style={
                    formik.errors.skillsOption && formik.touched.skillsOption
                      ? { outline: "1px solid red" }
                      : null
                  }
                />
                <span className={styles.label}>Search and Select</span>

                {dropdown && (
                  <div
                    className={styles.options}
                    style={{
                      overflowY: `${nameList.length > 7 ? "scroll" : "hidden"}`,
                    }}
                  >
                    {nameList.map((option) => {
                      return (
                        <>
                          <div
                            className={styles.dp_name}
                            onClick={() => handleLanguageSelection(option)}
                            key={option._id}
                          >
                            <div className={styles.search_dp}>
                              <Image
                                src={option.image}
                                alt="search"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <div className={styles.name2}>
                              <p>{option.name}</p>
                              <div className={styles.active_status}>
                                <p>{option.username}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SendPost;
