const { readSync } = require('fs');
const db = require('../db/connection')

exports.fetchCategories = () => {
    const queryStr = `SELECT slug, description FROM categories`
    return db.query(queryStr).then((result) => {
        if (result.rows === undefined) {
            return Promise.reject({
                status: 404,
                msg: 'route does not exist'
            })
        }
        return result.rows;
      });
}

exports.fetchReviews = () => {
    const queryStr = `SELECT reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes,
    COUNT (comments.review_id)::int AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC
    `
    return db.query(queryStr).then((result) => {
        return result.rows;
    })
}

exports.fetchReviewsWithId = (review_id) => {
    const queryStr = `SELECT reviews.review_id, reviews.title, reviews.review_body, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = ${review_id}
    GROUP BY reviews.review_id`
    return db.query(queryStr).then((result) => {
        const review = result.rows[0]
        if (review === undefined) {
            return Promise.reject({
                status: 404,
                msg: `no review found`
            })
        } else {
            return review
        }
    })
}

exports.fetchCommentsOfReviewId = (review_id) => {
    const queryStr = `SELECT comment_id, body, comments.review_id, author, comments.votes, comments.created_at FROM comments RIGHT JOIN reviews ON reviews.review_id = comments.review_id WHERE reviews.review_id = ${review_id} 
    ORDER BY created_at DESC`
    return db.query(queryStr).then((result) => {
        const comments = result.rows
        if(comments.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `no comments found`
            })
        } else if(comments[0].body === null){
            return []
        } else {
            return comments
        }
    })
}

// SELECT * FROM comments WHERE review_id = 3 ORDER BY created_at DESC;

    // \c nc_games_test;

    // then(({body}) => {
    //     expect(typeof body).toEqual({