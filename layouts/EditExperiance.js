import React, { useEffect, useState } from "react";
import styles from "../styles/EditProfile.module.scss";
import axios from "axios";
import { ImCheckboxChecked } from "react-icons/im";
import { ImCheckboxUnchecked } from "react-icons/im";
import ClosePart from "../components/profileComp/ClosePart";

function EditExperiance({
  setEditExp,
  controlEdit,
  userAbout,
  expId,
  mutateuserFetchData,
}) {
  const filteredExperience = userAbout?.experience.find(
    (val) => val._id === expId
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
    controlEdit ? filteredExperience?.working : false
  );
  const [company, setcompany] = useState(
    controlEdit ? filteredExperience?.company : ""
  );
  const [role, setRole] = useState(controlEdit ? filteredExperience?.Role : "");
  const [description, setDescription] = useState(
    controlEdit ? filteredExperience?.description : ""
  );
  /* this useEffect will be control the editing existing data */
  useEffect(() => {
    if (controlEdit) {
      setcompany(filteredExperience?.company);
      setRole(filteredExperience?.Role);
      setDescription(filteredExperience?.description);
      setWorking(filteredExperience?.working);
      setSelectEndyear(filteredExperience?.endYear);
      setSelectJoinyear(filteredExperience?.joinYear);
      setSelectEndmonths(filteredExperience?.endMonth);
      setSelectJoinmonths(filteredExperience?.joinMonth);
    } else {
      setcompany("");
      setRole("");
      setDescription("");
      setWorking(false);
      setSelectEndyear("");
      setSelectJoinyear("");
      setSelectEndmonths("");
      setSelectJoinmonths("");
    }
  }, [
    controlEdit,
    filteredExperience?.company,
    filteredExperience?.Role,
    filteredExperience?.description,
    filteredExperience?.working,
    filteredExperience?.endYear,
    filteredExperience?.joinYear,
    filteredExperience?.joinMonth,
    filteredExperience?.endMonth,
  ]);
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "main") {
      setEditExp(false);
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
        await axios.put("/api/user/editExperience", {
          expId,
          description,
          role,
          company,
          working,
          selectEndyear,
          selectJoinyear,
          selectEndmonths,
          selectJoinmonths,
        });
        mutateuserFetchData();
      } else {
        await axios.post("/api/user/editExperience", {
          description,
          role,
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
    setEditExp(false);
    setcompany("");
    setRole("");
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
            title={"Add Experience details"}
            CloseTheModal={setEditExp}
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
              <span className={styles.label}>Company Name</span>
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
              <span className={styles.label}>Role</span>
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
                <p>Joined In</p>
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
                  <span className={styles.label} style={{ marginTop: "-1rem" }}>
                    Present In current company
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
    </>
  );
}

export default EditExperiance;
