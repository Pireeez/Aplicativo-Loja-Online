const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //pasta onde vai salvar
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ex: 123456.png
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
