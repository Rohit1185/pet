const multer = require('multer');
// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
  cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
   cb(null, new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;