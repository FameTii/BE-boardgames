// const categories = require("../db/data/development-data/categories");

const { fetchCategories, fetchReviews, fetchReviewsWithId, updatingReviewVotes, fetchCommentsOfReviewId, fetchUsers, postingComment, deletingUsers} = require("./models");
const endpoints = require("./endpoints.json");

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
    const {review_id} = req.params;
    fetchCommentsOfReviewId(review_id)
        .then((comments) => {
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

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    deletingUsers(comment_id)
    .then((comment) => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

exports.getApi = (req, res, next) => {
    res.send(endpoints);
}

