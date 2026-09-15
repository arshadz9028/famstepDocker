import React, { useState, useContext, useEffect } from "react";
import styles from "../../styles/Post.module.scss";
import Image from "next/image";
import { ContextProvider } from "../../global/context";
import FilterAdjustment from "./FilterAdjustment";

export default function Filter() {
  const [toggleButton, setToggleButton] = useState("filter");
  const { setSelectedFile, selectedImage, setIsFormOpen } =
    useContext(ContextProvider);

  // Function to save the filtered image as a URL and console log it
  const saveFilteredImage = () => {
   
    const canvas = document.createElement("canvas");
    const image = document.createElement("img");
    image.src = selectedImage.url;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");

      ctx.filter = `${selectedImage.filter.filter} invert(${selectedImage.filter.invert}%) blur(${selectedImage.filter.blur}px) brightness(${selectedImage.filter.brightness}%) contrast(${selectedImage.filter.contrast}%) grayscale(${selectedImage.filter.grayscale}%) hue-rotate(${selectedImage.filter.hue_rotate}deg) saturate(${selectedImage.filter.saturate}%) sepia(${selectedImage.filter.sepia}%)`;
      ctx.drawImage(image, 0, 0);

      const filteredImageURL = canvas.toDataURL(); // Save filtered image as a URL

      // Convert the filteredImageURL to a File object
      fetch(filteredImageURL)
        .then((response) => response.blob())
        .then((blob) => {
          const fileName = "filtered_image.jpg";
          const file = new File([blob], fileName, {
            type: blob.type,
            lastModified: new Date().getTime(),
          });
          // Pass the filtered image file to the <Form /> component
          setSelectedFile((prevFiles) =>
            prevFiles.map((img) =>
              img.id === selectedImage.id
                ? {
                    ...img,
                    file, // Update the file object with the filtered image
                  }
                : img
            )
          );
          setIsFormOpen(false);
          // Additional logic to handle the File object as needed
        })
        .catch((error) => {
          console.error("Error converting URL to File:", error);
        });
    };
  };

  return (
    <>
      <div className={styles.right}>
        <div className={styles.filter_buttons}>
          <div
            className={
              toggleButton === "filter"
                ? `${styles.button_hover} ${styles.filterButton}`
                : styles.filterButton
            }
            onClick={() => {
              setToggleButton("filter");
            }}
          >
            <p>Filter</p>
          </div>
          <div
            className={
              toggleButton === "Adjustment"
                ? `${styles.button_hover} ${styles.filterButton}`
                : styles.filterButton
            }
            onClick={() => {
              setToggleButton("Adjustment");
            }}
          >
            <p>Adjustments</p>
          </div>
        </div>
        <FilterAdjustment toggleButton={toggleButton} />
        <div className={styles.bottom}>
          <input
            className={styles.button}
            style={{ width: "12rem" }}
            type="submit"
            value="Next"
            onClick={saveFilteredImage}
          />
        </div>
      </div>
    </>
  );
}
