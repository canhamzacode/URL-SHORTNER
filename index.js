require("dotenv").config();
require("express-async-errors");
const express = require("express");
// require("express-async-errors");
const app = express();

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const routes = require("./routes/index");

const connectDB = require("./db/connect");
app.use(express.json());

// routes
app.use("/api/v1/urls", routes);

// middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    // db connection
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log("App Listening ...");
    });
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
