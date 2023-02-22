// const categories = require("../db/data/development-data/categories");
const { fetchCategories, fetchReviews, fetchReviewsWithId, updatingReviewVotes} = require("./models");

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