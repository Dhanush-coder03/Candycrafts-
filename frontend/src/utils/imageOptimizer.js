/**
 * Utility to compress and convert images to Base64 strings.
 * This ensures that local image uploads fit cleanly within localStorage limits (5MB)
 * without sacrificing visual quality.
 */

export const compressImageToBase64 = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Draw onto offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, 0, width, height);

        // Convert to compressed JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      image.onerror = (err) => {
        reject(err);
      };

      image.src = readerEvent.target.result;
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Reads multiple files and returns an array of compressed base64 strings
 */
export const compressMultipleImages = async (fileList, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  const files = Array.from(fileList);
  const promises = files.map(file => compressImageToBase64(file, maxWidth, maxHeight, quality));
  return Promise.all(promises);
};
