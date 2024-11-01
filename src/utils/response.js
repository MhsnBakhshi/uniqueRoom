exports.successResponse = async (res, statusCode = 200, data) => {
  return res
    .status(statusCode)
    .json({ status: statusCode, success: true, data });
};
exports.errorResponse = async (res, statusCode, data) => {
  return res
    .status(statusCode)
    .json({ status: statusCode, success: false, data });
};
