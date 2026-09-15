import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/Scoreboard.module.scss";
import programmings from "../../JsonFile/progLanguages.json";

function Dropdown({ selectedLang, setselectedLang }) {
  const [dropdown, setDropdown] = useState(false);
  const [selectSkills, setSelectSkills] = useState();

  const skillsRef = useRef(null);
  const filteredLanguages = useRef(programmings);

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
    filteredLanguages.current = programmings;
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

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
      <div ref={skillsRef} className={styles.programming_border}>
        <div className={styles.tooltip}>
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
          {!dropdown && <pre
            className={styles.tooltiptext}
            
          >
           Select a language to see who&apos;s leading in that skill!
          </pre>}
        </div>
        {dropdown && (
          <div className={styles.dropdown}>
            <div className={styles.options}>
              {filteredLanguages.current.length > 0 ? (
                filteredLanguages.current.map((option) => (
                  <div
                    className={styles.dropdown_item}
                    key={option.id}
                    onClick={() => handleSelectLanguage(option)}
                  >
                    {option.language}
                  </div>
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    position: "relative",
                    top: "40%",
                    height: "transformY(50%)",
                    fontSize: "1.6rem",
                    fontWeight: "400",
                  }}
                >
                  No results found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dropdown;
