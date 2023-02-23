// const categories = require("../db/data/development-data/categories");
const { fetchCategories, fetchReviews, fetchReviewsWithId, updatingReviewVotes, fetchCommentsOfReviewId} = require("./models");

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
    const {category, sortBy, orderBy} = req.query
    console.log(category);
    console.log(sortBy);
    console.log(orderBy);
    fetchReviews(category, sortBy, orderBy)
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
    const {review_id} = req.params
    fetchCommentsOfReviewId(review_id)
        .then((comments) => {
            res.status(200).send({comments})
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


// exports.getReviews = (req, res, next) => {
//     fetchReviews()
//         .then((reviews) => {
//             res.status(200).send({reviews})
//         })
//         .catch((err) => {
//             next(err)
//         })
// }