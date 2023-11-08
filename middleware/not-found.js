const notFound = (req, res) => {
  res.send(404).send("Route Does Not Exist");
};

module.exports = notFound;
