import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/inviteFriend.module.scss";
import { useFormik } from "formik";
import { registerskills } from "../../lib/validate";
import SelectedProgramingCard from "../../components/SelectedProgramingCard";
import { ContextProvider } from "../../global/context";
import ClosePart from "../../components/profileComp/ClosePart";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
function InviteFriends({ setInviteModel, userData,groupData ,session}) {
  // const { selectedSkills ,selectedLanguage, setsSelectedLanguage} = useContext(ContextProvider);
  const [selectSkills, setSelectSkills] = useState("");
  const [selectedLanguage, setsSelectedLanguage] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [error, setError] = useState();
  const [finalUser, setfinalUser] = useState([]);
  const skillsRef = useRef(null);
  const router = useRouter();
  const { groups } = router.query;
  //delete the selected skills
  const deleteSelectedProgram = (value) => {
    setsSelectedLanguage((oldItems) => {
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
      setInviteModel(false);
    }
  };

  //handle dropdown
  const handleClickOutside = (e) => {
    if (!skillsRef.current.contains(e.target)) {
      setDropdown(false);
      formik.setFieldValue("skillsOption", selectedLanguage);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

 
  //controlling input
  const FindSkills = (e) => {
    setSelectSkills(e.target.value);
    const searchRegex = new RegExp(`${e.target.value}`, "i");
    const filteredData = userData.filter(user => user._id !== session.user.id);
    const filteredLanguages1 = filteredData.filter((option) =>
    
    (option.username !== groupData.admin.username) &&
    searchRegex.test(option.name) ||
    searchRegex.test(option.username)
    );
    setNameList(filteredLanguages1)
    if (e.target.value.length > 0) {
      if (filteredLanguages1.length > 0 ) {
        setDropdown(true);
      } else {
        setDropdown(false);
      }

      //   formik.setFieldValue('country', selectOption);
    } else {
      setDropdown(false);
      formik.setFieldValue("skillsOption", "");
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
    
    const selectedLanguageExists = selectedLanguage.includes(option.name);
    const grpMembers = groupData.members.some((value)=> value.user._id === option._id )
   
    if (selectedLanguageExists || grpMembers) {
      setError("User is already a member of this group");
    } else {
      setError("");
      setSelectSkills("");
      setsSelectedLanguage((value) => [...value, option.name]);
      setfinalUser((value) => [...value, option._id]);
      formik.setFieldValue("skillsOption", option.name);
      setDropdown(false);
    }
  };
  //on sumbit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedLanguage.length > 0) {
      await axios.post("/api/group/inviteRequest", {
        groups,
        finalUser,
        inviteStatus: "pending",
      });
    } else {
      setError("Please ensure you select at least one skill.");
    }
    setInviteModel(false);
  };
  
  return (
    <>
      <div
        id="help_modalOuter"
        className={styles.help_modalOuter}
        onClick={closeModel}
      >
        <div className={styles.skillModal_center}>
          <ClosePart CloseTheModal={setInviteModel} title={"Invite friends"} />

          <form
            onSubmit={handleSubmit}
            autoComplete=""
            className={styles.countryDropDown_form}
          >
            <div className={styles.addedSkills}>
              {selectedLanguage.map((value, index) => {
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
                  value={selectSkills} // Use selectedOption here
                  onClick={FindSkills}
                  onChange={FindSkills}
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
                      overflowY: `${
                        nameList.length > 7 ? "scroll" : "hidden"
                      }`,
                    }}
                  >
                    {nameList.map((option) => {
                      return (
                        <>
                          <div className={styles.dp_name} onClick={() => handleLanguageSelection(option)}>
                            <div className={styles.search_dp}>
                              <Image src={option.image}  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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

            <button type="submit">Invite</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default InviteFriends;
