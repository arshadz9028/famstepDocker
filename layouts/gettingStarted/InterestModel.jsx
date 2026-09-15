import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/SignupMoreDetail.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useFormik } from "formik";
import { registerHobbies } from "../../lib/validate";
import SelectedProgramingCard from "../../components/SelectedProgramingCard";
import { ContextProvider } from "../../global/context";
import axios from "axios";
import { useRouter } from "next/router";

function InterestModal({ setInterestModel, interestModelAtleast }) {
  const {
    setSelectedInterests,
    selectedInterests,
    selectedHobbies,
    setsSelectedHobbies,
  } = useContext(ContextProvider);
  const [selectInterests, setSelectInterests] = useState("");
  const [selectCapital, setSelectCapital] = useState("");
  const [interestButton, setInterestButton] = useState("Next");
  const [error, setError] = useState();
  const router = useRouter();

  //delete the selected skills
  const deleteSelectedProgram = (value) => {
    setsSelectedHobbies((oldItems) => {
      return oldItems.filter((val) => {
        return val !== value;
      });
    });
  };

  useEffect(() => {
    if (selectInterests !== "") {
      setInterestButton("Select");
      setError("");
    } else {
      setInterestButton("Next");
      formik.setFieldValue("hobbyOption", selectedHobbies);
    }
  }, [selectInterests]);

  useEffect(() => {
    setsSelectedHobbies(selectedInterests);
  }, [selectedInterests]);

  //close the modal
  const closeModel = (event) => {
    const className = event.target.getAttribute("id");
    if (className === "help_modalOuter") {
      setInterestModel(false);
    }
  };

  const capitalizeFLetter = (e) => {
    const capital = e.target.value;
    setSelectInterests(e.target.value);
    if (capital) {
      setSelectCapital(capital[0].toUpperCase() + capital.slice(1));
    }
  };

  const hobbyFunction = (e) => {
    e.preventDefault();
    const selectedHobbyExists = selectedHobbies.includes(" " + selectCapital);

    if (selectedHobbyExists) {
      setError("This hobby has already been selected.");
    } else {
      setsSelectedHobbies((value) => [...value, " " + selectCapital]);
      formik.setFieldValue("hobbyOption", selectedHobbies);
      setSelectInterests(""); // Clear selectInterests state
      setError("");
    }
  };

  //using formik for validation and form control
  const formik = useFormik({
    initialValues: {
      hobbyOption: "",
    },
    validate: registerHobbies,
    onSubmit,
  });

  //on sumbit
  async function onSubmit(values) {
    if (selectedHobbies.length > 0) {
     
      if (interestModelAtleast) {
        try {
          const response = await axios.post("/api/auth/signup/gettingStartedSkip",{values});
          if (response.status == "200") {
            router.push("/network");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        setSelectedInterests(selectedHobbies);
        setInterestModel(false);
      }
    } else {
      formik.setFieldValue("hobbyOption", "");
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
            onClick={() => setInterestModel(false)}
          >
            <AiOutlineCloseCircle className={styles.svg_cross} />
          </div>
          <div className={styles.addYour_skills}>
            {!interestModelAtleast ? (
              <p>Enter your interests and select them.</p>
            ) : (
              <p style={{textAlign:"center"}} >
                Kindly enter and select at least one interest to help us
                personalize your experience.{" "}
              </p>
            )}
          </div>

          <form
            onSubmit={formik.handleSubmit}
            autoComplete=""
            className={styles.countryDropDown_form}
          >
            <div className={styles.addedSkills}>
              {selectedHobbies.map((value, index) => {
                return (
                  <SelectedProgramingCard
                    key={index}
                    value={value}
                    deleteSelectedProgram={deleteSelectedProgram}
                  />
                );
              })}
            </div>

            <div className={styles.country_dropDown}>
              <span className={styles.errorSet}>{error}</span>
              {formik.errors.hobbyOption && formik.touched.hobbyOption && (
                <span className={styles.errorSet}>
                  {formik.errors.hobbyOption}
                </span>
              )}

              <div className={styles.input_bx}>
                <input
                  type="option"
                  id="hobbyOption"
                  name="hobbyOption"
                  placeholder="e.g., web development, photography, fitness"
                  value={selectInterests} // Use selectedOption here
                  onChange={capitalizeFLetter}
                  autoFocus
                  onBlur={formik.handleBlur}
                  style={
                    formik.errors.hobbyOption && formik.touched.hobbyOption
                      ? { outline: "1px solid red" }
                      : null
                  }
                />
                <span className={styles.label}>Type and select</span>
              </div>
            </div>

            {interestButton !== "Next" ? (
              <button type="button" style={{cursor:"pointer"}} onClick={hobbyFunction}>
                Select
              </button>
            ) : (
              <button style={{cursor:"pointer"}} type="submit">Next</button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default InterestModal;
