import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/EditProfile.module.scss";
import Image from "next/image";
import axios from "axios";
import { useFormik } from "formik";
import { ImCheckboxChecked } from "react-icons/im";
import { ImCheckboxUnchecked } from "react-icons/im";
import ClosePart from "../../components/profileComp/ClosePart";

function ProjectDialoge({
  addProj,
  setAddProj,
  controlEdit,
  userAbout,
  setcontrolEdit,
  projId,
  mutateuserFetchData,
}) {
  const filteredExperience = userAbout?.project.find(
    (val) => val._id === projId
  );
  const [joinMonth, setjoinMonth] = useState(false);
  const [selectJoinmonths, setSelectJoinmonths] = useState(
    controlEdit ? filteredExperience?.joinMonth : ""
  );
  const [joinYear, setjoinYear] = useState(false);
  const [selectEndmonths, setSelectEndmonths] = useState(
    controlEdit ? filteredExperience?.endMonth : ""
  );
  const [endMonth, setendMonth] = useState(false);
  const [selectJoinyear, setSelectJoinyear] = useState(
    controlEdit ? filteredExperience?.joinYear : ""
  );
  const [endYear, setendYear] = useState(false);
  const [selectEndyear, setSelectEndyear] = useState(
    controlEdit ? filteredExperience?.endYear : ""
  );
  const [working, setWorking] = useState(
    controlEdit ? filteredExperience?.ongoing : false
  );
  const [company, setcompany] = useState(
    controlEdit ? filteredExperience?.name : ""
  );
  const [role, setRole] = useState(controlEdit ? filteredExperience?.tech : "");
  const [description, setDescription] = useState(
    controlEdit ? filteredExperience?.description : ""
  );
  const [addUrl, setAddUrl] = useState(controlEdit ? filteredExperience?.url : "")
  /* this useEffect will be control the editing existing data */
  useEffect(() => {
    if (controlEdit) {
      setcompany(filteredExperience?.name);
      setRole(filteredExperience?.tech);
      setAddUrl(filteredExperience?.url);
      setDescription(filteredExperience?.description);
      setWorking(filteredExperience?.ongoing);
      setSelectEndyear(filteredExperience?.endYear);
      setSelectJoinyear(filteredExperience?.joinYear);
      setSelectEndmonths(filteredExperience?.endMonth);
      setSelectJoinmonths(filteredExperience?.joinMonth);
    } else {
      setcompany("");
      setRole("");
      setAddUrl('')
      setDescription("");
      setWorking(false);
      setSelectEndyear("");
      setSelectJoinyear("");
      setSelectEndmonths("");
      setSelectJoinmonths("");
    }
  }, [
    controlEdit,
    filteredExperience?.name,
    filteredExperience?.tech,
    filteredExperience?.description,
    filteredExperience?.ongoing,
    filteredExperience?.endYear,
    filteredExperience?.joinYear,
    filteredExperience?.joinMonth,
    filteredExperience?.endMonth,
  ]);
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "dsfgfdgfg2121df2g12dfg1") {
      setAddProj(false);
    }
  };
  const closeDropdown = (e) => {
    const className = e.target.getAttribute("class");
    if (className !== "EditProfile_options__SmXdr") {
      setjoinMonth(false);
      setjoinYear(false);
      setendMonth(false);
      setendYear(false);
    }
  };
  const joinMonthSelection = (option) => {
    setSelectJoinmonths(option);
    setjoinMonth(false);
  };
  const Joinmonthsdates = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSelectJoinmonths(keyword);
    setjoinMonth(true);
  };
  const joinYearSelection = (option) => {
    setSelectJoinyear(option);
    setjoinYear(false);
  };
  const Joinyeardates = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSelectJoinyear(keyword);
    setjoinYear(true);
  };
  const endmonthsSelection = (option) => {
    setSelectEndmonths(option);
    setendMonth(false);
  };
  const Endmonthsdates = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSelectEndmonths(keyword);
    setendMonth(true);
  };
  const endyearSelection = (option) => {
    setSelectEndyear(option);
    setendYear(false);
  };
  const Endyeardates = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSelectEndyear(keyword);
    setendYear(true);
  };

  const handleCheckbox = () => {
    setWorking(!working);
  };
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date();
  let year = currentYear.getFullYear();
  const years = Array.from(
    { length: year - 1980 + 1 },
    (_, index) => 1980 + index
  );
  years.sort((a, b) => b - a);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (controlEdit) {
        await axios.put("/api/user/addProjectrience", {
          projId,
          description,
          role,
          addUrl,
          company,
          working,
          selectEndyear,
          selectJoinyear,
          selectEndmonths,
          selectJoinmonths,
        });
        mutateuserFetchData();
      } else {
        await axios.post("/api/user/addProjectrience", {
          description,
          role,
          addUrl,
          company,
          working,
          selectEndyear,
          selectJoinyear,
          selectEndmonths,
          selectJoinmonths,
        });
        mutateuserFetchData();
      }
    } catch (error) {}
    setAddProj(false);
    setcompany("");
    setRole("");
    setAddUrl('')
    setDescription("");
    setWorking(false);
    setSelectEndyear("");
    setSelectJoinyear("");
    setSelectEndmonths("");
    setSelectJoinmonths("");
  };
  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (addProj) {
      document.body.style.overflow = "hidden";
      setAddProj(true);
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [addProj]);
  return (
    <>
      {addProj && (
        <div
          className={styles.main}
          id="dsfgfdgfg2121df2g12dfg1"
          onClick={closeModel}
        >
          <div className={styles.fullEdit} onClick={closeDropdown}>
            <ClosePart
              title={"Add Project details"}
              CloseTheModal={setAddProj}
            />

            <form className={styles.upperPortion}>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required="required"
                  value={company}
                  onChange={(e) => setcompany(e.target.value)}
                />
                <span className={styles.label}>Project Name</span>
              </div>

              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="Role"
                  name="Role"
                  required="required"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className={styles.label}>Technologies used</span>
              </div>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="URL"
                  name="URL"
                  value={addUrl}
                  onChange={(e) => setAddUrl(e.target.value)}
                />
                <span className={styles.label}>Add URL (optional)</span>
              </div>
              <div className={styles.inputCheck}>
                <p>Currently working</p>
                {working ? (
                  <ImCheckboxChecked
                    onClick={handleCheckbox}
                    className={styles.checkBox}
                  />
                ) : (
                  <ImCheckboxUnchecked
                    onClick={handleCheckbox}
                    className={styles.checkBox}
                  />
                )}
              </div>

              <div className={styles.ExpEdit}>
                <div className={styles.joined}>
                  <p>Started In</p>
                </div>
                <div className={styles.devideEdit}>
                  <div className={styles.inputdates}>
                    <input
                      type="text"
                      id="joinMonth"
                      name="joinMonth"
                      required="required"
                      onClick={Joinmonthsdates}
                      onChange={Joinmonthsdates}
                      value={selectJoinmonths}
                      autoComplete="off"
                      // value={location}
                      // onChange={(e) => setLocation(e.target.value)}
                    />
                    <span className={styles.labelInput}>Month</span>
                    {joinMonth && (
                      <div className={styles.options}>
                        {months.map((option, index) => (
                          <div
                            key={index}
                            className={styles.dropdown_item}
                            onClick={() => joinMonthSelection(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.inputdates}>
                    <input
                      type="text"
                      id="joinYear"
                      name="joinYear"
                      required="required"
                      onClick={Joinyeardates}
                      onChange={Joinyeardates}
                      value={selectJoinyear}
                      autoComplete="off"
                    />

                    <span className={styles.labelInput}>Year</span>
                    {joinYear && (
                      <div className={styles.options}>
                        {years.map((option, index) => (
                          <div
                            key={index}
                            className={styles.dropdown_item}
                            onClick={() => joinYearSelection(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.ExpEdit}>
                <div className={styles.ended}>
                  <p>Ended In</p>
                </div>
                {!working ? (
                  <div className={styles.devideEdit}>
                    <div className={styles.inputdates}>
                      <input
                        type="text"
                        id="endMonth"
                        name="endMonth"
                        required="required"
                        onClick={Endmonthsdates}
                        onChange={Endmonthsdates}
                        value={selectEndmonths}
                        autoComplete="off"
                      />
                      <span className={styles.labelInput}>Month</span>
                      {endMonth && (
                        <div className={styles.options}>
                          {months.map((option, index) => (
                            <div
                              key={index}
                              className={styles.dropdown_item}
                              onClick={() => endmonthsSelection(option)}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={styles.inputdates}>
                      <input
                        type="text"
                        id="endYear"
                        name="endYear"
                        required="required"
                        onClick={Endyeardates}
                        onChange={Endyeardates}
                        value={selectEndyear}
                        autoComplete="off"
                      />
                      <span className={styles.labelInput}>Year</span>
                      {endYear && (
                        <div className={styles.options}>
                          {years.map((option, index) => (
                            <div
                              key={index}
                              className={styles.dropdown_item}
                              onClick={() => endyearSelection(option)}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.input_bx}>
                    <input
                      style={{ marginTop: "1rem" }}
                      type="text"
                      id="Present"
                      name="Present"
                      disabled
                      autoComplete="off"
                    />
                    <span
                      className={styles.label}
                      style={{ marginTop: "-1rem" }}
                    >
                      Project is ongoing
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.inputDesc}>
                <textarea
                  className={styles.textArea}
                  type="text"
                  id="description"
                  name="description"
                  required="required"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <span className={styles.labelInputDesc}>Description</span>
              </div>
              <div className={styles.input_bxButton}>
                <button type="submit" onClick={onSubmit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectDialoge;
