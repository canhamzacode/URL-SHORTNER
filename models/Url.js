const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
  {
    customName: {
      type: String,
      unique: true,
    },
    originalUrl: {
      type: String,
      required: [true, "Url Must Be Provided"],
    },
    shortenUrl: {
      type: String,
      unique: true,
      required: [true, "Url Must Be Provided"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expirationDate: {
      type: Date,
    },
  }
  //   { timestamps: true }
);

module.exports = mongoose.model("URL", UrlSchema);
