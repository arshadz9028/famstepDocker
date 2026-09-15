import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/SignupMoreDetail.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useFormik } from "formik";
import { registerskills } from "../../lib/validate";
import SelectedProgramingCard from "../../components/SelectedProgramingCard";
import ProgrammingLanguage from "../../JsonFile/allSkills.json";
import { ContextProvider } from "../../global/context";
import axios from "axios";
// import skills from "../../JsonFile/allSkills.json";
function SkillsCollab({
  isEditCollab,
  selectedColab,
  setsSelectedColab,
  setSkillModal,
  Value,
  mutatefollowerData,
  skillsIndex,
  handleChange,
  inputs,
  collabType
}) {
  // const {
  //   selectedColab, setsSelectedColab,skillCollab, setSkillCollab
  // } = useContext(ContextProvider);
  const [skillCollab, setSkillCollab] = useState(
    collabType === "collab" 
      ? (isEditCollab ? inputs[skillsIndex].skills : [])
      : selectedColab
  );

  const [selectSkills, setSelectSkills] = useState("");
  const skillButtonRef = useRef(Value);
  const [dropdown, setDropdown] = useState(false);
  const [error, setError] = useState();
  const skillsRef = useRef(null);

  //delete the selected skills
  const deleteSelectedProgram = (value) => {
    const updatedLanguages = selectedColab.filter((val) => val !== value);
    setsSelectedColab(updatedLanguages);
    setError("");
    if (updatedLanguages.length > 0) {
      formik.setFieldValue("skillsOption", selectedColab[0]);
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
    setsSelectedColab(skillCollab);
    formik.setFieldValue("skillsOption", skillCollab);
  }, [skillCollab]);

  //fiterd the lanuage according to user input
  const filteredLanguages = ProgrammingLanguage?.filter((option) =>
    option.skill?.toLowerCase().startsWith(selectSkills.toLowerCase())
  );
  //controlling input
  const FindSkills = (e) => {
    setSelectSkills(e.target.value);
    setError("");
    skillButtonRef.current = "Select";
    formik.setFieldValue("skillsOption", e.target.value);

    const filteredLanguages1 = ProgrammingLanguage.filter((option) =>
      option.skill?.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    if (!e.target.value.trim() && selectedColab.lenght > 0) {
      formik.setFieldValue("skillsOption", selectedColab[0]);
    }

    if (e.target.value.length > 0) {
      if (filteredLanguages1.length > 0) {
        setDropdown(true);
      } else {
        setDropdown(false);
      }
    } else {
      formik.setFieldValue("skillsOption", selectedColab[0]);
      skillButtonRef.current = Value;
      setDropdown(false);
    }
  };

  const handleLanguageSelection = (option) => {
    const selectedLanguageExists = selectedColab.includes(option.skill);
    if (selectedLanguageExists) {
      setError("The skill is already selected.");
    } else {
      skillButtonRef.current = Value;
      setsSelectedColab((value) => [...value, option.skill]);
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
      const selectedLanguageExists = selectedColab.some(
        (lang) => lang.toLowerCase() === skills.toLowerCase()
      );
      if (selectedLanguageExists) {
        setError("The skill is already selected.");
      } else {
        formik.setFieldValue("skillsOption", skills);
        setsSelectedColab((value) => [...value, skills]);
        setSelectSkills("");
        setError("");
        skillButtonRef.current = Value;
      }
    } else {
      // formik.setFieldValue("skillsOption", "");
    }
  };
  const saveSkills = () => {
    handleChange(skillsIndex, "skills", selectedColab)
    setSkillModal(false)
  }

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
          selectedColab,
        });
        mutatefollowerData();
        if (response.status == "200") {
          setError("");
          setsSelectedColab([]);
          setSkillModal(false);
        }
      } catch (error) {
        setError(error.response.data.error);
      }
    } else if (selectedColab.length > 0 && skillButtonRef.current == "Next") {
      setSkillCollab(selectedColab);
      setSkillModal(false);
    }
  }
  return (
    <>
      <div
        id="help_modalOuter"
        className={styles.help_modalOuter}
        onClick={closeModel}
        style={{ background: "rgba(5, 5, 5, 0.3)" }}
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
              {selectedColab?.map((value, index) => {
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

            {!skillButtonRef.current && (
              <button type="submit" onClick={saveSkills}>
                Save
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default SkillsCollab;