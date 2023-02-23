// const categories = require("../db/data/development-data/categories");
const { fetchCategories, fetchReviews, fetchReviewsWithId, updatingReviewVotes, fetchCommentsOfReviewId, postingComment} = require("./models");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
    fetchReviews()
        .then((reviews) => {
            res.status(200).send({reviews})
        })
        .catch((err) => {
            next(err)
        })
}

exports.getReviewsWithId = (req, res, next) => {
    const {review_id} = req.params;
    fetchReviewsWithId(review_id)
        .then((review) => {
            res.status(200).send({review})
        })
        .catch((err) => {
            next(err)
        })
}

exports.getCommentsOfReviewId = (req, res, next) => {
    fetchCommentsOfReviewId(review_id)
        .then((comments) => {
            console.log(comments);
            res.status(200).send({comments})
        })
        .catch((err) => {
            next(err)
        })
}

exports.postComment = (req, res, next) => {
    const {review_id} = req.params;
    const newComment = req.body
    postingComment(review_id, newComment)
        .then((comment) => {
            res.status(201).send(comment)
        })
        .catch((err) => {
            next(err)
        })
}

exports.updateReviewVotes = (req, res, next) => {
    const {review_id} = req.params
    const newVotes = req.body
    updatingReviewVotes(review_id, newVotes)
        .then((review) => {
            res.status(200).send(review)
        })
        .catch((err) => {
            next(err)
        })
}
