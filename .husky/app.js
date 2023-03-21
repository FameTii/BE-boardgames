const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors())
app.use(express.json())

const { getCategories, getReviews, getReviewsWithId, getCommentsOfReviewId, updateReviewVotes, getUsers, postComment, deleteComment, getApi } = require("./controller");
const { handlesIncorrectPaths, handleCustomErrors, PSQLhandlers, handle500statuses, dataErrors } = require("./errorHandlingControllers")

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsWithId);

app.get("/api/reviews/:review_id/comments", getCommentsOfReviewId);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", updateReviewVotes);

app.get("/api/users", getUsers)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api", getApi)

app.use(handlesIncorrectPaths)
app.use(handleCustomErrors)
app.use(PSQLhandlers)
app.use(dataErrors)
app.use(handle500statuses)

module.exports = app;


