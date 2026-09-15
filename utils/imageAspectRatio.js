export const imageAspectRatio = (selectedImage, maxHeight, maxWidth) => {
    return new Promise((resolve) => {

        const img = document.createElement('img');
        // When the image is loaded, get its dimensions
        img.onload = () => {
            // Calculate the new dimensions while maintaining the aspect ratio
            let newWidth = img.width;
            let newHeight = img.height;
            if (img.width > maxWidth) {
                newWidth = maxWidth;
                newHeight = (img.height * maxWidth) / img.width;
            }

            if (newHeight > maxHeight) {
                newHeight = maxHeight;
                newWidth = (img.width * maxHeight) / img.height;
            }


            resolve({ width: newWidth, height: newHeight });
        };

        // Set the image source to preload it
        img.src = selectedImage;
    });
};
