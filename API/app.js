const express = require("express");
const app = express();
app.use(express.json())
const { getCategories, getReviews, getReviewsWithId, postComment } = require("./controller");
const { handlesIncorrectPaths, handlesIncorrectReviewIds, PSQLhandlers, dataErrors, handle500statuses } = require("./errorHandlingControllers")



app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsWithId);

app.post("/api/reviews/:review_id/comments", postComment);

app.use(handlesIncorrectPaths)
app.use(handlesIncorrectReviewIds)
app.use(PSQLhandlers)
app.use(dataErrors)
app.use(handle500statuses)

module.exports = app;


