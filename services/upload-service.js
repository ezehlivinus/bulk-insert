const fsPromises = require('fs').promises;

// delete a  file
/**
 * @description delete a file
 * @param {Object} file is the object req.file contain file info
 * @returns boolean
 */
exports.deleteFile = async (file) => {
  // if the file exist
  try {
    await fsPromises.access(file.path);
    await fsPromises.unlink(file.path);

    return true;
  } catch (error) {
    // one of access, unlink normally throw error,
    // when the file does not exits, we do nothing if that happens
    return false;
  }
};
