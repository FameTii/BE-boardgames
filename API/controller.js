// const categories = require("../db/data/development-data/categories");
const { fetchCategories, fetchReviews, fetchReviewsWithId} = require("./models");

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
        .then((reviewsId) => {
            res.status(200).send({reviewsId})
        })
        .catch((err) => {
            next(err)
        })
}