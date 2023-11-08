const CustomApiError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class ConflictRequestError extends CustomApiError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.CONFLICT;
  }
}

module.exports = ConflictRequestError;
