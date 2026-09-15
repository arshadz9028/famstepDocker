import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/SignupMoreDetail.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useFormik } from "formik";
import { registerDesignation } from "../../lib/validate";
import designationJson from "../../JsonFile/designationJson.json";
import { ContextProvider } from "../../global/context";

function DesignationModel({  isEditCollab,inputs,
desigIndex, handleChange,selectedDesignation, setSelectedDesignation, setDesignationModel }) {

  const [selectDesignation, setSelectDesignation] =
    useState(isEditCollab
      ? inputs[desigIndex]["role"] // Extract skills array
      : []);
  const [dropdown, setDropdown] = useState(false);
  const designationRef = useRef(null);

  //delete the selected skills
  const deleteSelectedProgram = (value) => {
    setsSelectedLanguage((oldItems) => {
      return oldItems.filter((val) => {
        return val !== value;
      });
    });
  };

  //close the modal
  const closeModel = (event) => {
    const className = event.target.getAttribute("id");
    if (className === "help_modalOuter") {
      setDesignationModel(false);
    }
  };

  //handle dropdown
  const handleClickOutside = (e) => {
    if (!designationRef.current.contains(e.target)) {
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
    formik.setFieldValue('designationOption', selectDesignation);
}, [selectDesignation])
  //fiterd the lanuage according to user input

  const filteredLanguages = designationJson.filter((option) =>
    option.designation.toLowerCase().startsWith(
      typeof selectDesignation === 'string' ? selectDesignation.toLowerCase() : ''
    )
  );

  //controlling input
  const FindDesignation = (e) => {
    setSelectDesignation(e.target.value);
    const filteredLanguages1 = designationJson.filter((option) =>
      option.designation.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    if (e.target.value.length > 0) {
      if (filteredLanguages1.length > 0) {
        setDropdown(true);
      } else {
        setDropdown(false);
      }
    } else {
      setDropdown(false);
    }
  };

  
  //using formik for validation and form control
  const formik = useFormik({
    initialValues: {
      designationOption: "",
    },
    validate: registerDesignation,
    onSubmit,
  });

  //on sumbit
  async function onSubmit(values) {
    setSelectedDesignation(selectDesignation);
    handleChange(desigIndex, "role", selectDesignation)
    setDesignationModel(false);
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
            onClick={() => setDesignationModel(false)}
          >
            <AiOutlineCloseCircle className={styles.svg_cross} />
          </div>
          <div className={styles.addYour_skills}>
            <p>Add Role</p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            autoComplete=""
            className={styles.countryDropDown_form}
          >
            <div className={styles.country_dropDown} ref={designationRef}>
              {formik.errors.designationOption &&
                formik.touched.designationOption && (
                  <span className={styles.errorSet}>
                    {formik.errors.designationOption}
                  </span>
                )}
              <div className={styles.input_bx}>
                <input
                  type="option"
                  id="designationOption"
                  name="designationOption"
                  value={selectDesignation} // Use selectedOption here
                  onChange={FindDesignation}
                  onClick={FindDesignation}
                  autoFocus
                  onBlur={formik.handleBlur}
                  // {...formik.getFieldProps('designation')}
                  style={
                    formik.errors.designationOption &&
                    formik.touched.designationOption
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
                          onClick={() => {
                            setSelectDesignation(option.designation);
                            formik.setFieldValue(
                              "designationOption",
                              option.designation
                            );
                            setDropdown(false);
                          }}
                        >
                          {option.designation}
                        </div>
                      );
                    })}
                  </div>
                )}
             
              </div>
            </div>

            <button type="submit">Next</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default DesignationModel;
