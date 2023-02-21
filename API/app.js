const express = require("express");
const app = express();
const { getCategories, getReviews, getReviewsWithId } = require("./controller");
const { handlesIncorrectPaths, handlesIncorrectReviewIds, handle500statuses } = require("./errorHandlingControllers")
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsWithId);

app.use(handlesIncorrectPaths)
app.use(handlesIncorrectReviewIds)
app.use(handle500statuses)

module.exports = app;
