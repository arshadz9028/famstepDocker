import React, { useContext } from "react";
import styles from "../../styles/Post.module.scss";
import Image from "next/image";
import { ContextProvider } from "../../global/context";

function FilterAdjustment({ toggleButton }) {
    const {
        setSelectedImage,
        selectedImage,
        setSelectedImageMultiple,
    } = useContext(ContextProvider);

    return (
        <>
            {toggleButton === "filter" ? (
                <>
                    <div className={styles.grid_photo}>
                        <div>
                            <div
                                className={styles.card}
                                onClick={() => {
                                    setSelectedImage({
                                        ...selectedImage,
                                        filter: { ...selectedImage.filter, filter: " " },
                                    });

                                    setSelectedImageMultiple((prevImages) =>
                                        prevImages.map((image) =>
                                            image.id === selectedImage.id
                                                ? { ...image, filter: { ...image.filter, filter: " " } }
                                                : image
                                        )
                                    );
                                }}
                            >
                                <Image
                                    src={selectedImage.url}
                                    layout="fill"
                                    objectFit="contain"
                                    quality={0}
                                    alt="filter"
                                />
                            </div>
                            <div
                                className={styles.card}
                                style={{ filter: "blur(1.6px)" }}
                                onClick={() => {
                                    setSelectedImage({
                                        ...selectedImage,
                                        filter: { ...selectedImage.filter, filter: "blur(1.6px)" },
                                    });

                                    setSelectedImageMultiple((prevImages) =>
                                        prevImages.map((image) =>
                                            image.id === selectedImage.id
                                                ? { ...image, filter: { ...image.filter, filter: "blur(1.6px)" } }
                                                : image
                                        )
                                    );
                                }}
                            >
                                <Image
                                    src={selectedImage.url}
                                    layout="fill"
                                    objectFit="contain"
                                    quality={0}
                                    alt="filter"
                                />
                            </div>
                            <div
                                className={styles.card}
                                style={{ filter: "brightness(0.8)" }}
                                onClick={() => {
                                    setSelectedImage({
                                        ...selectedImage,
                                        filter: { ...selectedImage.filter, filter: "brightness(0.8)" },
                                    });

                                    setSelectedImageMultiple((prevImages) =>
                                        prevImages.map((image) =>
                                            image.id === selectedImage.id
                                                ? { ...image, filter: { ...image.filter, filter: "brightness(0.8)" } }
                                                : image
                                        )
                                    );
                                }}
                            >
                                <Image
                                    src={selectedImage.url}
                                    layout="fill"
                                    objectFit="contain"
                                    quality={0}
                                    alt="filter"
                                />
                            </div>
                            <div
                                className={styles.card}
                                style={{ filter: "contrast(150%)" }}
                                onClick={() => {
                                    setSelectedImage({
                                        ...selectedImage,
                                        filter: { ...selectedImage.filter, filter: "contrast(150%)" },
                                    });

                                    setSelectedImageMultiple((prevImages) =>
                                        prevImages.map((image) =>
                                            image.id === selectedImage.id
                                                ? { ...image, filter: { ...image.filter, filter: "contrast(150%)" } }
                                                : image
                                        )
                                    );
                                }}
                            >
                                <Image
                                    src={selectedImage.url}
                                    layout="fill"
                                    objectFit="contain"
                                    quality={0}
                                    alt="filter"
                                />
                            </div>
                            <div
                                className={styles.card}
                                style={{ filter: "grayscale(50%)" }}
                                onClick={() => {
                                    setSelectedImage({
                                        ...selectedImage,
                                        filter: { ...selectedImage.filter, filter: "grayscale(50%)" },
                                    });

                                    setSelectedImageMultiple((prevImages) =>
                                        prevImages.map((image) =>
                                            image.id === selectedImage.id
                                                ? { ...image, filter: { ...image.filter, filter: "grayscale(50%)" } }
                                                : image
                                        )
                                    );
                                }}
                            >
                                <Image
                                    src={selectedImage.url}
                                    layout="fill"
                                    objectFit="contain"
                                    quality={0}
                                    alt="filter"
                                />
                            </div>
                            <div
                                className={styles.card}
                                style={{ filter: "hue-rotate(330deg)" }}
                                onClick={() => {
                                    setSelectedImage({
                                        ...selectedImage,
                                        filter: { ...selectedImage.filter, filter: "hue-rotate(330deg)" },
                                    });

                                    setSelectedImageMultiple((prevImages) =>
                                        prevImages.map((image) =>
                                            image.id === selectedImage.id
                                                ? { ...image, filter: { ...image.filter, filter: "hue-rotate(330deg)" } }
                                                : image
                                        )
                                    );
                                }}
                            >
                                <Image
                                    src={selectedImage.url}
                                    layout="fill"
                                    objectFit="contain"
                                    quality={0}
                                    alt="filter"
                                />
                            </div>
                            <div
                                className={styles.card}
                                style={{ filter: "grayscale(80%)" }}
                                onClick={() => {
                                    setSelectedImage({
                                        ...selectedImage,
                                        filter: { ...selectedImage.filter, filter: "grayscale(80%)" },
                                    });

                                    setSelectedImageMultiple((prevImages) =>
                                        prevImages.map((image) =>
                                            image.id === selectedImage.id
                                                ? { ...image, filter: { ...image.filter, filter: "grayscale(80%)" } }
                                                : image
                                        )
                                    );
                                }}
                            >
                                <Image
                                    src={selectedImage.url}
                                    layout="fill"
                                    objectFit="contain"
                                    quality={0}
                                    alt="filter"
                                />
                            </div>
                            <div
                                className={styles.card}
                                style={{ filter: "saturate(120%)" }}
                                onClick={() => {
                                    setSelectedImage({
                                        ...selectedImage,
                                        filter: { ...selectedImage.filter, filter: "saturate(120%)" },
                                    });

                                    setSelectedImageMultiple((prevImages) =>
                                        prevImages.map((image) =>
                                            image.id === selectedImage.id
                                                ? { ...image, filter: { ...image.filter, filter: "saturate(120%)" } }
                                                : image
                                        )
                                    );
                                }}
                            >
                                <Image
                                    src={selectedImage.url}
                                    layout="fill"
                                    objectFit="contain"
                                    quality={0}
                                    alt="filter"
                                />
                            </div>
                            <div
                                className={styles.card}
                                style={{ filter: "sepia(60%)" }}
                                onClick={() => {
                                    setSelectedImage({
                                        ...selectedImage,
                                        filter: { ...selectedImage.filter, filter: "sepia(60%)" },
                                    });

                                    setSelectedImageMultiple((prevImages) =>
                                        prevImages.map((image) =>
                                            image.id === selectedImage.id
                                                ? { ...image, filter: { ...image.filter, filter: "sepia(60%)" } }
                                                : image
                                        )
                                    );
                                }}
                            >
                                <Image
                                    src={selectedImage.url}
                                    layout="fill"
                                    objectFit="contain"
                                    quality={0}
                                    alt="filter"
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.adjustment}>
                    <div className={styles.progress_bar}>
                        <label htmlFor="Blur">Blur</label>
                        <input
                            type="range"
                            id="vol"
                            name="Blur"
                            value={selectedImage.filter.blur}
                            min={0}
                            step={0.1}
                            max={2}
                            className={styles.custom_slider}
                            onChange={(e) => {
                                setSelectedImage({
                                    ...selectedImage,
                                    filter: { ...selectedImage.filter, blur: e.target.value },
                                });

                                setSelectedImageMultiple((prevImages) =>
                                    prevImages.map((image) =>
                                        image.id === selectedImage.id
                                            ? { ...image, filter: { ...image.filter, blur: e.target.value } }
                                            : image
                                    )
                                );
                            }}
                        />
                    </div>
                    <div className={styles.progress_bar}>
                        <label htmlFor="Brightness">Brightness</label>
                        <input
                            type="range"
                            id="vol"
                            name="Brightness"
                            value={selectedImage.filter.brightness}
                            min={50}
                            step={1}
                            max={150}
                            className={styles.custom_slider}
                            onChange={(e) => {
                                setSelectedImage({
                                    ...selectedImage,
                                    filter: { ...selectedImage.filter, brightness: e.target.value },
                                });

                                setSelectedImageMultiple((prevImages) =>
                                    prevImages.map((image) =>
                                        image.id === selectedImage.id
                                            ? { ...image, filter: { ...image.filter, brightness: e.target.value } }
                                            : image
                                    )
                                );
                            }}
                        />
                    </div>
                    <div className={styles.progress_bar}>
                        <label htmlFor="Contrast">Contrast</label>
                        <input
                            type="range"
                            id="vol"
                            name="Contrast"
                            value={selectedImage.filter.contrast}
                            min={100}
                            step={1}
                            max={200}
                            className={styles.custom_slider}
                            onChange={(e) => {
                                setSelectedImage({
                                    ...selectedImage,
                                    filter: { ...selectedImage.filter, contrast: e.target.value },
                                });

                                setSelectedImageMultiple((prevImages) =>
                                    prevImages.map((image) =>
                                        image.id === selectedImage.id
                                            ? { ...image, filter: { ...image.filter, contrast: e.target.value } }
                                            : image
                                    )
                                );
                            }}
                        />
                    </div>
                    <div className={styles.progress_bar}>
                        <label htmlFor="Grayscale">Grayscale</label>
                        <input
                            type="range"
                            id="vol"
                            name="Grayscale"
                            value={selectedImage.filter.grayscale}
                            min={0}
                            step={1}
                            max={100}
                            className={styles.custom_slider}
                            onChange={(e) => {
                                setSelectedImage({
                                    ...selectedImage,
                                    filter: { ...selectedImage.filter, grayscale: e.target.value },
                                });

                                setSelectedImageMultiple((prevImages) =>
                                    prevImages.map((image) =>
                                        image.id === selectedImage.id
                                            ? { ...image, filter: { ...image.filter, grayscale: e.target.value } }
                                            : image
                                    )
                                );
                            }}
                        />
                    </div>
                    <div className={styles.progress_bar}>
                        <label htmlFor="Invert">Invert</label>
                        <input
                            type="range"
                            id="vol"
                            name="Invert"
                            value={selectedImage.filter.invert}
                            min={0}
                            step={1}
                            max={40}
                            className={styles.custom_slider}
                            onChange={(e) => {
                                setSelectedImage({
                                    ...selectedImage,
                                    filter: { ...selectedImage.filter, invert: e.target.value },
                                });

                                setSelectedImageMultiple((prevImages) =>
                                    prevImages.map((image) =>
                                        image.id === selectedImage.id
                                            ? { ...image, filter: { ...image.filter, invert: e.target.value } }
                                            : image
                                    )
                                );
                            }}
                        />
                    </div>
                    <div className={styles.progress_bar}>
                        <label htmlFor="hue-rotate">hue-rotate</label>
                        <input
                            type="range"
                            id="vol"
                            name="hue-rotate"
                            value={selectedImage.filter.hue_rotate}
                            min={0}
                            step={1}
                            max={360}
                            className={styles.custom_slider}
                            onChange={(e) => {
                                setSelectedImage({
                                    ...selectedImage,
                                    filter: { ...selectedImage.filter, hue_rotate: e.target.value },
                                });

                                setSelectedImageMultiple((prevImages) =>
                                    prevImages.map((image) =>
                                        image.id === selectedImage.id
                                            ? { ...image, filter: { ...image.filter, hue_rotate: e.target.value } }
                                            : image
                                    )
                                );
                            }}
                        />
                    </div>
                    <div className={styles.progress_bar}>
                        <label htmlFor="Saturate">Saturate</label>
                        <input
                            type="range"
                            id="vol"
                            name="Saturate"
                            value={selectedImage.filter.saturate}
                            min={1}
                            step={1}
                            max={200}
                            className={styles.custom_slider}
                            onChange={(e) => {
                                setSelectedImage({
                                    ...selectedImage,
                                    filter: { ...selectedImage.filter, saturate: e.target.value },
                                });

                                setSelectedImageMultiple((prevImages) =>
                                    prevImages.map((image) =>
                                        image.id === selectedImage.id
                                            ? { ...image, filter: { ...image.filter, saturate: e.target.value } }
                                            : image
                                    )
                                );
                            }}
                        />
                    </div>
                    <div className={styles.progress_bar}>
                        <label htmlFor="progress_bar">Sepia</label>
                        <input
                            type="range"
                            id="vol"
                            name="progress_bar"
                            value={selectedImage.filter.sepia}
                            min={0}
                            step={1}
                            max={100}
                            className={styles.custom_slider}
                            onChange={(e) => {
                                setSelectedImage({
                                    ...selectedImage,
                                    filter: { ...selectedImage.filter, sepia: e.target.value },
                                });

                                setSelectedImageMultiple((prevImages) =>
                                    prevImages.map((image) =>
                                        image.id === selectedImage.id
                                            ? { ...image, filter: { ...image.filter, sepia: e.target.value } }
                                            : image
                                    )
                                );
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default FilterAdjustment;
