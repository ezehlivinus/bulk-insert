const multer = require('multer');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    // console.log(path.extname(file.originalname));
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniquePrefix}-${file.originalname}`);
  }
});

const mimeTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const excelFilter = (req, file, cb) => {
  console.log(file.mimetype);

  if (mimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`wrong file type ${file.mimetype}. expected either of: ${mimeTypes}`));
    cb(null, false);
  }
};

exports.upload = multer({
  storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: excelFilter
});
