const express = require("express");
const app = express();
app.use(express.json())
const { getCategories, getReviews, getReviewsWithId, updateReviewVotes } = require("./controller");
const { handlesIncorrectPaths, handlesIncorrectReviewIds, PSQLhandlers, handle500statuses } = require("./errorHandlingControllers")

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsWithId);

app.patch("/api/reviews/:review_id", updateReviewVotes)

app.use(handlesIncorrectPaths)
app.use(handlesIncorrectReviewIds)
app.use(PSQLhandlers)
app.use(handle500statuses)

module.exports = app;
