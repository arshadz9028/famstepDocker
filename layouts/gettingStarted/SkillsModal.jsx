import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/SignupMoreDetail.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useFormik } from "formik";
import { registerskills } from "../../lib/validate";
import SelectedProgramingCard from "../../components/SelectedProgramingCard";
import ProgrammingLanguage from "../../JsonFile/allSkills.json";
import { ContextProvider } from "../../global/context";
import axios from "axios";

function SkillsModal({ setSkillModal, Value, mutatefollowerData }) {
  const {
    setSelectedSkills,
    selectedSkills,
    selectedLanguage,
    setsSelectedLanguage,
  } = useContext(ContextProvider);
  const [selectSkills, setSelectSkills] = useState("");
  const skillButtonRef = useRef(Value);
  const [dropdown, setDropdown] = useState(false);
  const [error, setError] = useState();
  const skillsRef = useRef(null);

  //delete the selected skills
  const deleteSelectedProgram = (value) => {
    const updatedLanguages = selectedLanguage.filter((val) => val !== value);
    setsSelectedLanguage(updatedLanguages);
    setError("");
    if (updatedLanguages.length > 0) {
      formik.setFieldValue("skillsOption", selectedLanguage[0]);
    } else {
      formik.setFieldValue("skillsOption", "");
    }
  };

  //close the modal
  const closeModel = (event) => {
    const className = event.target.getAttribute("id");
    if (className === "help_modalOuter") {
      setSkillModal(false);
    }
  };

  //handle dropdown
  const handleClickOutside = (e) => {
    if (!skillsRef.current.contains(e.target)) {
      setDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  useEffect(() => {
    setsSelectedLanguage(selectedSkills);
    formik.setFieldValue("skillsOption", selectedSkills);
  }, [selectedSkills]);

  //fiterd the lanuage according to user input
  const filteredLanguages = ProgrammingLanguage.filter((option) =>
    option.skill.toLowerCase().startsWith(selectSkills.toLowerCase())
  );

  //controlling input
  const FindSkills = (e) => {
    setSelectSkills(e.target.value);

    setError("");
    skillButtonRef.current = "Select";
    formik.setFieldValue("skillsOption", e.target.value);

    const filteredLanguages1 = ProgrammingLanguage.filter((option) =>
      option.skill.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    if (!e.target.value.trim() && selectedLanguage.lenght > 0) {
      formik.setFieldValue("skillsOption", selectedLanguage[0]);
    }

    if (e.target.value.length > 0) {
      if (filteredLanguages1.length > 0) {
        setDropdown(true);
      } else {
        setDropdown(false);
      }
    } else {
      formik.setFieldValue("skillsOption", selectedLanguage[0]);
      skillButtonRef.current = Value;
      setDropdown(false);
    }
  };

  const ErrorHandleFunc = () => {};

  const handleLanguageSelection = (option) => {
    const selectedLanguageExists = selectedLanguage.includes(option.skill);
    if (selectedLanguageExists) {
      setError("The skill is already selected.");
    } else {
      skillButtonRef.current = Value;
      setsSelectedLanguage((value) => [...value, option.skill]);
      formik.setFieldValue("skillsOption", [option.skill]);
      setSelectSkills("");
      setError("");
      setDropdown(false);
    }
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const SelectTheOption = () => {
    const skills = capitalizeWords(selectSkills.trim());
    if (
      skillButtonRef.current === "Select" &&
      selectSkills.trim() != "" &&
      !formik.errors.skillsOption
    ) {
      const selectedLanguageExists = selectedLanguage.some(
        (lang) => lang.toLowerCase() === skills.toLowerCase()
      );
      if (selectedLanguageExists) {
        setError("The skill is already selected.");
      } else {
        formik.setFieldValue("skillsOption", skills);
        setsSelectedLanguage((value) => [...value, skills]);
        setSelectSkills("");
        setError("");
        skillButtonRef.current = Value;
      }
    } else {
      // formik.setFieldValue("skillsOption", "");
    }
  };

  //using formik for validation and form control
  const formik = useFormik({
    initialValues: {
      skillsOption: "",
    },
    validate: registerskills,
    onSubmit,
  });

  //on sumbit
  async function onSubmit(values) {
    if (skillButtonRef.current == "Save") {
      try {
        const response = await axios.put("/api/auth/signup/updateSkills", {
          selectedLanguage,
        });
        mutatefollowerData();
        if (response.status == "200") {
          setError("");
          setsSelectedLanguage([]);
          setSkillModal(false);
        }
      } catch (error) {
        setError(error.response.data.error);
      }
    } else if (
      selectedLanguage.length > 0 &&
      skillButtonRef.current == "Next"
    ) {
      setSelectedSkills(selectedLanguage);
      setSkillModal(false);
    }
  }

  return (
    <>
      <div
        id="help_modalOuter"
        className={styles.help_modalOuter}
        onClick={closeModel}
      >
        <div className={styles.skillModal_center}>
          <div
            className={styles.help_cross}
            onClick={() => setSkillModal(false)}
          >
            <AiOutlineCloseCircle className={styles.svg_cross} />
          </div>
          <div className={styles.addYour_skills}>
            <p>Add your skill</p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
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

              {formik.errors.skillsOption && formik.touched.skillsOption && (
                <span className={styles.errorSet}>
                  {formik.errors.skillsOption}
                </span>
              )}
              <div className={styles.input_bx}>
                <input
                  type="option"
                  id="skillsOption"
                  name="skillsOption"
                  value={selectSkills} // Use selectedOption here
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
                <span className={styles.label}>Search and Select, or Type</span>

                {dropdown && (
                  <div className={styles.options}>
                    {filteredLanguages.map((option) => {
                      return (
                        <div
                          className={styles.dropdown_item}
                          key={option.id}
                          onClick={() => handleLanguageSelection(option)}
                        >
                          {option.skill}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {skillButtonRef.current === "Select" && (
              <button type="button" onClick={SelectTheOption}>
                Select
              </button>
            )}

            {(skillButtonRef.current === "Save" ||
              skillButtonRef.current === "Next") && (
              <button type="submit">{skillButtonRef.current}</button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default SkillsModal;
