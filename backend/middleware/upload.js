const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /xlsx|xls|csv/;
    // Check ext
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype =
        file.mimetype.includes('excel') ||
        file.mimetype.includes('spreadsheetml') ||
        file.mimetype.includes('csv');

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Excel or CSV Files Only!');
    }
}

// Init upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
