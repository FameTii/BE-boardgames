const express = require("express");
const app = express();
app.use(express.json())

const { getCategories, getReviews, getReviewsWithId, getCommentsOfReviewId, updateReviewVotes, getUsers, postComment } = require("./controller");
const { handlesIncorrectPaths, handlesIncorrectReviewIds, PSQLhandlers, handle500statuses, dataErrors } = require("./errorHandlingControllers")

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsWithId);

app.get("/api/reviews/:review_id/comments", getCommentsOfReviewId);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", updateReviewVotes);

app.get("/api/users", getUsers)

app.use(handlesIncorrectPaths)
app.use(handlesIncorrectReviewIds)
app.use(PSQLhandlers)
app.use(dataErrors)
app.use(handle500statuses)

module.exports = app;


