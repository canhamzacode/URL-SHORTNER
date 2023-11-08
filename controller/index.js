const Url = require("../models/Url");
var validUrl = require("valid-url");
const { StatusCodes } = require("http-status-codes");
const {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
} = require("../errors");

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const shortenUrl = async (req, res) => {
  const { customName, originalUrl } = req.body;

  if (!originalUrl) {
    throw new BadRequestError("URL must be provided");
  }

  if (!validUrl.isUri(originalUrl)) {
    throw new BadRequestError("Provided Url is not valid");
  }

  let randomName = customName
    ? customName.replace(/\s/g, "-")
    : generateRandomString(5);

  const check = await Url.findOne({ customName: randomName });

  if (randomName.length < 5) {
    throw new BadRequestError("Provided name is not valid");
  } else if (check && customName) {
    throw new ConflictRequestError("Provided name is not available");
  }

  const existingUrl = await Url.findOne({ originalUrl });
  if (existingUrl) {
    res.status(StatusCodes.OK).json({
      message: "URL already exists",
      data: existingUrl.shortenUrl,
    });
    return;
  }

  const existingCustomNameUrl = await Url.findOne({ customName: randomName });
  if (existingCustomNameUrl) {
    throw new ConflictRequestError("Custom name already exists");
  }

  let urlExists = true;
  let i = 0;

  while (urlExists && i < 10) {
    const check = await Url.findOne({ customName: randomName });
    urlExists = !!check;

    if (!urlExists) {
      const url = await Url.create({
        ...req.body,
        customName: randomName,
        shortenUrl: `https://short.ner/${randomName}`,
      });

      res.status(StatusCodes.CREATED).json({
        message: "URL shortened successfully",
        data: url.shortenUrl,
      });
      break;
    }

    randomName = generateRandomString(5);
    i++;
  }
};

const getAllUrl = async (req, res) => {
  const urls = await Url.find();
  res.status(StatusCodes.OK).json({ urls });
};

const getUrl = async (req, res) => {
  const { id } = req.params;
  const url = await Url.find({ _id: id });
  if (!url) {
    throw new NotFoundError(`No URl with ${id}`);
  }
  res.status(StatusCodes.OK).json({ url });
};

const updateUrl = async (req, res) => {
  const { id } = req.params;
  const { customName, originalUrl } = req.body;

  const existingUrl = await Url.findOne({ _id: id });
  if (!existingUrl) {
    throw new NotFoundError(`No URL with ID ${id}`);
  }

  if (customName && customName.length < 5) {
    throw new BadRequestError("Custom name must be at least 5 characters long");
  }

  if (customName) {
    const existingCustomNameUrl = await Url.findOne({ customName: customName });
    if (existingCustomNameUrl) {
      throw new ConflictRequestError("Custom name already exists");
    }
  }

  if (originalUrl && !validUrl.isUri(originalUrl)) {
    throw new BadRequestError("Provided URL is not valid");
  }

  let randomName = customName
    ? customName.replace(/\s/g, "-")
    : existingUrl.customName;

  const data = {
    customName: randomName,
    originalUrl: originalUrl || existingUrl.originalUrl,
    shortenUrl: `https://short.ner/${randomName}`,
  };

  const updatedUrl = await Url.findOneAndUpdate({ _id: id }, data);
  res
    .status(StatusCodes.OK)
    .json({ message: "URL Updated Successfully", url: updatedUrl });
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;
  const url = await Url.findOneAndDelete({ _id: id });
  if (!url) {
    throw new NotFoundError(`No URl with ${id}`);
  }
  res.status(StatusCodes.OK).json();
};

module.exports = {
  shortenUrl,
  getAllUrl,
  getUrl,
  updateUrl,
  deleteUrl,
};
