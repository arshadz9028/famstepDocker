import React, { useEffect, useState } from "react";
import styles from "../../styles/Ide.module.scss";

function ProblemStatement({ userTheme,codeData }) {
  return (
    <div
      className={`${
        userTheme === "vs-dark" ? styles.problem : styles.problem_dark
      }`}
    >
      <pre className={styles.question} >
        {codeData?.subData?.question}
      </pre>
    </div>
  );
}

export default ProblemStatement;
