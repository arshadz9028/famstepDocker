import multer from 'multer';


export const upload =  multer({
  storage: multer.memoryStorage(), // Store file temporarily in memory
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
});
export const uploadCode =  multer({
  storage: multer.memoryStorage(), // Store file temporarily in memory
});


