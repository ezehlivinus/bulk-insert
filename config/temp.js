const { functions } = require('lodash');
// const multer = require('multer');

// exports.storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     cb(null, 'uploads');
//   },
//   filename: (req, file, cb) => {
//     // console.log(path.extname(file.originalname));
//     const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//     cb(null, `${uniquePrefix}-${file.originalname}`);
//   }
// });

/**
 * @description filter files types
 * @param {*} filter a multer filter function-like that filter specific file[mime] type
 * @param {*} mimeTypes an array of mimeTypes
 */
// const fileFilter = (filter, mimeTypes) => {
//   if (mimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error(`wrong file type ${file.mimetype}. expected either of: ${mimeTypes}`));
//     cb(null, false);
//   }

// };
