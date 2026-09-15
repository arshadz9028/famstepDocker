import React, { useEffect, useState } from "react";
import styles from "../styles/EditProfile.module.scss";
import axios from "axios";
import { ImCheckboxChecked } from "react-icons/im";
import { ImCheckboxUnchecked } from "react-icons/im";
import ClosePart from "../components/profileComp/ClosePart";

function EditEducation({
  userAbout,
  controlEdu,
  setEditEdu,
  eduId,
  mutateuserFetchData,
}) {
  const filteredEducation = userAbout?.education.find(
    (val) => val._id === eduId
  );
  const [joinMonth, setjoinMonth] = useState(false);
  const [selectJoinmonths, setSelectJoinmonths] = useState(
    controlEdu ? filteredEducation?.joinMonth : ""
  );
  const [joinYear, setjoinYear] = useState(false);
  const [selectEndmonths, setSelectEndmonths] = useState(
    controlEdu ? filteredEducation?.endMonth : ""
  );
  const [endMonth, setendMonth] = useState(false);
  const [selectJoinyear, setSelectJoinyear] = useState(
    controlEdu ? filteredEducation?.joinYear : ""
  );
  const [endYear, setendYear] = useState(false);
  const [selectEndyear, setSelectEndyear] = useState(
    controlEdu ? filteredEducation?.endYear : ""
  );
  const [working, setWorking] = useState(
    controlEdu ? filteredEducation?.description : false
  );
  const [university, setuniversity] = useState(
    controlEdu ? filteredEducation?.university : ""
  );
  const [college, setcollege] = useState(
    controlEdu ? filteredEducation?.college : ""
  );
  const [course, setcourse] = useState(
    controlEdu ? filteredEducation?.course : ""
  );
  const [description, setDescription] = useState(
    controlEdu ? filteredEducation?.description : ""
  );

  /* this useEffect will be control the editing existing data */
  useEffect(() => {
    if (controlEdu) {
      setuniversity(filteredEducation?.university);
      setcollege(filteredEducation?.college);
      setcourse(filteredEducation?.course);
      setDescription(filteredEducation?.description);
      setWorking(filteredEducation?.studying);
      setSelectEndyear(filteredEducation?.endYear);
      setSelectJoinyear(filteredEducation?.joinYear);
      setSelectEndmonths(filteredEducation?.endMonth);
      setSelectJoinmonths(filteredEducation?.joinMonth);
    } else {
      setuniversity("");
      setcollege("");
      setcourse("");
      setDescription("");
      setWorking(false);
      setSelectEndyear("");
      setSelectJoinyear("");
      setSelectEndmonths("");
      setSelectJoinmonths("");
    }
  }, [
    controlEdu,
    filteredEducation?.university,
    filteredEducation?.college,
    filteredEducation?.course,
    filteredEducation?.description,
    filteredEducation?.studying,
    filteredEducation?.endYear,
    filteredEducation?.joinYear,
    filteredEducation?.joinMonth,
    filteredEducation?.endMonth,
  ]);
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "main") {
      setEditEdu(false);
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
      if (controlEdu) {
        await axios.put("/api/user/editEducation", {
          eduId,
          description,
          college,
          university,
          course,
          working,
          selectEndyear,
          selectJoinyear,
          selectEndmonths,
          selectJoinmonths,
        });
        mutateuserFetchData();
      } else {
        await axios.post("/api/user/editEducation", {
          description,
          college,
          university,
          course,
          working,
          selectEndyear,
          selectJoinyear,
          selectEndmonths,
          selectJoinmonths,
        });
        mutateuserFetchData();
      }
    } catch (error) {}
    setEditEdu(false);
    setuniversity("");
    setcollege("");
    setcourse("");
    setDescription("");
    setWorking(false);
    setSelectEndyear("");
    setSelectJoinyear("");
    setSelectEndmonths("");
    setSelectJoinmonths("");
  };

  return (
    <>
      <div className={styles.main} id="main" onClick={closeModel}>
        <div className={styles.fullEdit} onClick={closeDropdown}>
          <ClosePart
            title={"Add Education details"}
            CloseTheModal={setEditEdu}
          />

          <form className={styles.upperPortion}>
            <div className={styles.input_bx}>
              <input
                type="text"
                id="university"
                name="university"
                required="required"
                value={university}
                onChange={(e) => setuniversity(e.target.value)}
              />
              <span className={styles.label}>University</span>
            </div>

            <div className={styles.input_bx}>
              <input
                type="text"
                id="college"
                name="college"
                required="required"
                value={college}
                onChange={(e) => setcollege(e.target.value)}
              />
              <span className={styles.label}>College Name</span>
            </div>
            <div className={styles.input_bx}>
              <input
                type="text"
                id="course"
                name="course"
                required="required"
                value={course}
                onChange={(e) => setcourse(e.target.value)}
              />
              <span className={styles.label}>Course Name</span>
            </div>
            <div className={styles.inputCheck}>
              <p>Currently Studying</p>
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
                <p>Completed In</p>
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
                <div className={styles.input_bx} style={{ marginTop: "0rem" }}>
                  <input
                    type="text"
                    id="Present"
                    name="Present"
                    disabled
                    autoComplete="off"
                  />
                  <span className={styles.label}>Persuing</span>
                </div>
              )}
            </div>
            <div className={styles.inputDesc} >
              <textarea
                className={styles.textArea}
                type="text"
                id="description"
                name="description"
                rows={4}
                required="required"
                // value={e.target.value}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className={styles.labelInputDesc}>Description</span>
            </div>
            <div className={styles.input_bxButton}>
              <button onClick={onSubmit} type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditEducation;
