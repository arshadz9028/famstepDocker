import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/inviteFriend.module.scss";
import { useFormik } from "formik";
import { registerskills } from "../../lib/validate";
import { ContextProvider } from "../../global/context";
import axios from "axios";
import Image from "next/image";
import stylesClose from "../../styles/EditProfile.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoChevronBack } from "react-icons/io5";
import SelectedTaggedUser from "../../components/post/SelectedTaggedUser"

function AddTag({ mutateImageData, setAddTagOpen, selectedUsers, setSelectedUsers, setToggle }) {
  const { setTaggedUser, editPost, createId } = useContext(ContextProvider);
  const [selectUsers, setSelectUsers] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [error, setError] = useState();
  const [nameList, setNameList] = useState([]);
  const skillsRef = useRef(null);

  //delete the selected users
  const deleteSelectedProgram = async (value) => {
    setTaggedUser((oldItems) => {
      return oldItems.filter((val) => {
        return val !== value;
      });
    });
    if (editPost) {
      setSelectedUsers((oldItems) => {
        return oldItems.filter((val) => {
          return val.userid._id !== value;
        });
      });
    } else {
      setSelectedUsers((oldItems) => {
        return oldItems.filter((val) => {
          return val._id !== value;
        });
      });
    }
  };

  //close the modal
  const closeModel = (event) => {
    const className = event.target.getAttribute("id");
    if (className === "help_modalOuter") {
      setAddTagOpen(false);
      setToggle('')
      // setTaggedUser([]);
    }
  };

  //handle dropdown
  const handleClickOutside = (e) => {
    if (!skillsRef.current.contains(e.target)) {
      setDropdown(false);
      formik.setFieldValue("taggedUser", selectedUsers);
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
      taggedUser: "",
    },
    validate: registerskills,
    // onSubmit
  });

  const handleUsersSelection = (option) => {
    if (editPost) {
      const selectedUsersExists = selectedUsers?.some(
        (selectedUser) => selectedUser?.userid._id === option._id
      );
      if (selectedUsersExists) {
        setError("User has already been selected");
      } else {
        setError("");
        setSelectUsers("");
        setSelectedUsers((value) => [...value, { userid: option }]);
        setTaggedUser((value) => [...value, option?._id]);
        formik.setFieldValue("taggedUser", option.name);
        setDropdown(false);
      }

    } else {
      const selectedUsersExists = selectedUsers?.some(
        (selectedUser) => selectedUser._id === option._id
      );

      if (selectedUsersExists) {
        setError("User has already been selected");
      } else {
        setError("");
        setSelectUsers("");
        setSelectedUsers((value) => [...value, option]);
        setTaggedUser((value) => [...value, option?._id]);
        formik.setFieldValue("taggedUser", option.name);
        setDropdown(false);
      }
    }
  };
  const handleSubmit = () => {
    setAddTagOpen(false);
    setToggle('')
  };

  return (
    <>
      <div
        id="help_modalOuter"
        className={styles.help_modalOuter}
        onClick={closeModel}
        style={{ background: "rgba(5, 5, 5, 0.478)" }}
      >
        <div className={styles.skillModal_center}>
          <div className={stylesClose.closeButton}>

            <div
              className={stylesClose.leftArrowButton}
              onClick={() => (setAddTagOpen(false), setToggle(''))}
            >
              <IoChevronBack className={stylesClose.back_arrow} />
            </div>

            <p className={stylesClose.upper_sec}>Tag friends</p>
            <AiOutlineCloseCircle
              className={stylesClose.CloseCircleButton}
              onClick={() => (setAddTagOpen(false), setToggle(''))}
            />
          </div>
          <form
            onSubmit={handleSubmit}
            autoComplete=""
            className={styles.countryDropDown_form}
          >
            <div className={styles.addedSkills}>
              {selectedUsers?.map((value) => {
                return (
                  <SelectedTaggedUser
                    key={editPost ? value?.userid?._id : value?._id}
                    value={editPost ? value?.userid : value}
                    deleteSelectedProgram={deleteSelectedProgram}
                    editPost={editPost}
                  />
                );
              })}
            </div>

            <div className={styles.country_dropDown} ref={skillsRef}>
              <span className={styles.errorSet}>{error}</span>

              <div className={styles.input_bx}>
                <input
                  type="option"
                  id="taggedUser"
                  name="taggedUser"
                  value={selectUsers} // Use selectedOption here
                  onClick={FindeUsers}
                  onChange={FindeUsers}
                  autoFocus
                  onBlur={formik.handleBlur}
                  // {...formik.getFieldProps('designation')}
                  style={
                    formik.errors.taggedUser && formik.touched.taggedUser
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
                            key={option._id}
                            className={styles.dp_name}
                            onClick={() => handleUsersSelection(option)}
                          >
                            <div className={styles.search_dp}>
                              <Image
                                alt="userProf"
                                src={option.image}
                                fill
                                style={{
                                  objectFit: "cover",
                                }}
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
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddTag;
