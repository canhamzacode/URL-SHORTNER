const express = require("express");
const router = express.Router();
// const validateUrl = require("../middleware/validate-url");
const {
  shortenUrl,
  getAllUrl,
  getUrl,
  updateUrl,
  deleteUrl,
} = require("../controller");

router.route("/").get(getAllUrl).post(shortenUrl);
router.route("/:id").get(getUrl).patch(updateUrl).delete(deleteUrl);

module.exports = router;
