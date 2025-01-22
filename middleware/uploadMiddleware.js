const multer = require('multer');

// Configure Multer to store the file in memory temporarily
const storage = multer.memoryStorage();

// Set up Multer with the storage configuration
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // Limit file size to 2MB
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        const filetypes = /jpeg|jpg|png/; // Allowed file types
        const mimetype = filetypes.test(file.mimetype); // Check the mimetype
        const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase()); // Check the extension

        if (mimetype && extname) {
            return cb(null, true); // File is valid
        }
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG are allowed.')); // Reject the file
    }
});

// Export the middleware for single file upload (image)
module.exports = upload.single('image');
