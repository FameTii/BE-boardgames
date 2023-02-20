const express = require("express");
const app = express();
app.use(express.json());
const { getCategories } = require("./controller");

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  if (err.msg === "invalid sort_by option") {
    res.status(400).send({ msg: err.msg });
  } else if (err.msg === "invalid order option") {
    res.status(400).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
