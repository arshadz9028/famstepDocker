import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "../../styles/Ide.module.scss";
import programmings from "../../JsonFile/progLanguages.json";
import CountdownTimer from "../CountdownTimer";
import { BiSidebar } from "react-icons/bi";

function IdeSubNav({
  selectedLang,
  setselectedLang,
  codeData,
  sideBarSLider,
  setSideBarSLider,
  userTheme,
  entriesEnable
}) {
  const [selectSkills, setSelectSkills] = useState();
  const [dropdown, setDropdown] = useState(false);

  const skillsRef = useRef(null);

  const handleClickOutside = (e) => {
    if (!skillsRef.current.contains(e.target)) {
      setDropdown(false);
    }
  };

  const handleSelectLanguage = (option) => {
    setselectedLang(option);
    localStorage.setItem("selectedLanguage", JSON.stringify(option)); // Store selected language in localStorage
    setDropdown(false);
    setSelectSkills("");
  };

  useEffect(() => {
    const savedSelectedLanguage = localStorage.getItem("selectedLanguage");
    if (savedSelectedLanguage) {
      setselectedLang(JSON.parse(savedSelectedLanguage)); // Parse the stored string back to an object
    }
  }, []);

  useEffect(() => {
    document.addEventListener("touchstart", handleClickOutside, true);

    return () => {
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, []);

  const filteredLanguages = useRef(programmings);

  const FindSkills = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSelectSkills(keyword);
    setselectedLang("");
    filteredLanguages.current = programmings.filter((option) =>
      option.language.toLowerCase().startsWith(keyword)
    );
  };

  return (
    <>
      {/* Ide Mobile navbar */}
      {/* navbar center */}
      <div className={styles.navbar_section}>
        {/* logo control */}
        <div className={styles.logo_Control}>
          {!sideBarSLider && (
            <div
              className={styles.files_contain}
              onClick={() => setSideBarSLider(!sideBarSLider)}
            >
              <BiSidebar
                style={{
                  color: userTheme === "vs-dark" ? "#1b1918" : "#545454",
                  borderRadius: ".5rem",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          )}

          <div ref={skillsRef} className={styles.programming_border_mob}>
            <div className={styles.inputBox}>
              <input
                type="option"
                id="skillsOption"
                autoComplete="off"
                name="skillsOption"
                required="required"
                value={selectedLang?.language}
                onClick={() => {
                  setDropdown(true);
                }}
                onChange={FindSkills}
              />
            </div>
            {dropdown && (
              <div className={styles.dropdown}>
                <div className={styles.options}>
                  {filteredLanguages.current.map((option) => (
                    <div
                      className={styles.dropdown_item}
                      key={option.id}
                      onClick={() => handleSelectLanguage(option)}
                    >
                      {option.language}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

       { entriesEnable && <div className={styles.tooltip}>
          <div
            className={styles.textSubmitMob}
            style={{
              color: userTheme === "vs-light" ? "#000000" : "#ffffff",
            }}
          >
            <span>Entries:</span>
            <div className={styles.EntriesCircle}>
              <p>{codeData?.subData?.submission?.length}</p>
            </div>
          </div>
          <pre
            className={styles.tooltiptext}
            style={{ left: "0", bottom: "-2rem" }}
          >
            Submissions
          </pre>
        </div>}
      </div>
    </>
  );
}

export default IdeSubNav;
