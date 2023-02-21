const express = require("express");
const app = express();
const { getCategories, getReviews, getReviewsWithId} = require("./controller");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsWithId)

app.use((err, req, res, next) => {
  if (err.msg === `no review found`) {
    res.status(404).send({ msg: err.msg })
    next(err);
  }
});

app.use((err, req, res, next) => {
    res.status(500).send('Server Error!');
  });

module.exports = app;
