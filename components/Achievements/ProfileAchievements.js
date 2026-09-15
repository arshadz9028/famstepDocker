import React, { useState, useContext, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../../styles/Profile.module.scss";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierForestDark } from "../../node_modules/react-syntax-highlighter/dist/cjs/styles/hljs";

function ProfileAchievements({ value }) {
    const codepath = value;
  const [code, setCode] = useState("");

  useEffect(() => {
    const fetchCode = async () => {
      try {
        if (codepath) {
          const response = await fetch(codepath);

          const codeContent = await response.text();
          const match = codeContent.match(/`([^`]*)`/);
          const extractedCode = match && match[1] ? match[1] : "";

          setCode(extractedCode);
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      }
    };

    fetchCode();
  }, [codepath]);
    const customCodeStyle = {
        fontFamily: "Zilla Slab, serif", // Set your custom font here
        fontSize: "2rem", // Set your custom font size
      };
  return (
    <div className={styles.cards} key={value?._id}>
      <SyntaxHighlighter
        wrapLines={true}
        language="javascript"
        codeTagProps={{ style: customCodeStyle }}
        style={atelierForestDark}
        className={styles.profile_gallery_img}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default ProfileAchievements;
