/* eslint-disable no-console */
// Handles middleware
// This works with the package 'express-async-error' that was required at the index server file
// eslint-disable-next-line no-unused-vars

module.exports = (error, req, res, next) => {
  const data = {
    status: false,
    message: `Something failed:... ${error.message}`
  };

  console.error('From async error middleware', error);
  next(error);
  return res.status(500).send(data);
};
