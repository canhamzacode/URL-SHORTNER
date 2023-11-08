const { default: urlExist } = require("url-exist");
const CustomApiError = require("../errors/custom-api");

const validateUrl = async (req, res, next) => {
  const { url } = req.body;
  const isExist = await urlExist(url);
  if (!isExist) {
    throw new BadRequestError("Url Does not exist Try again");
  }
  next();
};
