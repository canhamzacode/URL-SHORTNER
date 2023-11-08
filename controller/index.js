const Url = require("../models/Url");
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

  let randomName = customName ? customName : generateRandomString(5);
  let urlExists = true;

  while (urlExists) {
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
        data: { url: { shortenUrl } },
      });
      break;
    }

    randomName = generateRandomString(5);
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

  let randomName = customName ? customName : generateRandomString(5);

  while (true) {
    const check = await Url.findOne({ customName: randomName });

    if (!check) {
      break;
    } else {
      randomName = generateRandomString(5);
    }
  }
  const data = {
    customName: randomName,
    originalUrl,
    shortenUrl: `https://short.ner/${randomName}`,
  };
  const url = await Url.findOneAndUpdate({ _id: id }, data);
  res.status(StatusCodes.OK).json({ message: "URL Updated Sucessfully", url });
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
