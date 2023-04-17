const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

exports.fetchCategories = () => {
  const queryStr = `SELECT slug, description FROM categories`;
  return db.query(queryStr).then((result) => {
    if (result.rows === undefined) {
      return Promise.reject({
        status: 404,
        msg: "route does not exist",
      });
    }
    return result.rows;
  });
};

exports.fetchReviews = (category, sortBy = "created_at", orderBy = "DESC") => {
  const validSortByOptions = ["comment_count", "created_at", "votes"];
  const validOrderByOptions = ["ASC", "DESC"];
  const where = `WHERE category = '${category}' `;
  let order = "";
  if (sortBy == "comment_count") {
    order = `GROUP BY reviews.review_id ORDER BY ${sortBy} ${orderBy}`;
  } else {
    order = `GROUP BY reviews.review_id ORDER BY reviews.${sortBy} ${orderBy}`;
  }

  let queryStr = `SELECT reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.review_body, reviews.votes,
    COUNT (comments.review_id)::int AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id `;
  if (category !== undefined) {
    queryStr += where;
  }

  if (sortBy && !validSortByOptions.includes(sortBy)) {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }

  if (orderBy && !validOrderByOptions.includes(orderBy)) {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }
  queryStr += order;
  return db.query(queryStr).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "no category found",
      });
    } else {
      return result.rows;
    }
  });
};

exports.fetchReviewsWithId = (review_id) => {
  const comments = `, COUNT (comments.review_id)::int AS comment_count`;

  const queryStr = `SELECT reviews.review_id, reviews.title, reviews.review_body, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes 
    ${comments}
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = ${review_id}
    GROUP BY reviews.review_id`;
  return db.query(queryStr).then((result) => {
    const review = result.rows[0];
    if (review === undefined) {
      return Promise.reject({
        status: 404,
        msg: `no review found`,
      });
    } else {
      return review;
    }
  });
};

exports.postingComment = (review_id, newComment) => {
  const username = newComment.username;
  const body = newComment.body;
  if (body === "" || body === undefined) {
    return Promise.reject({
      status: 400,
      msg: `body is empty`,
    });
  }
  if (username === "" || username === undefined) {
    return Promise.reject({
      status: 400,
      msg: `no username`,
    });
  }

  const queryStr = `INSERT INTO comments (body, review_id, author) VALUES ('${body}', ${review_id}, '${username}') RETURNING *;`;
  return db.query(queryStr).then((result) => {
    const comment = result.rows[0];
    if (comment === undefined) {
      return Promise.reject({
        status: 400,
        msg: `username not found`,
      });
    } else {
      return comment;
    }
  });
};

exports.fetchCommentsOfReviewId = (review_id) => {
  const queryStr = `SELECT comment_id, body, comments.review_id, author, comments.votes, comments.created_at FROM comments RIGHT JOIN reviews ON reviews.review_id = comments.review_id WHERE reviews.review_id = ${review_id} 
    ORDER BY created_at DESC`;
  return db.query(queryStr).then((result) => {
    const comments = result.rows;
    if (comments.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `no comments found`,
      });
    } else if (comments[0].body === null) {
      return [];
    } else {
      return comments;
    }
  });
};

exports.updatingReviewVotes = (review_id, newVotes) => {
  const voteValue = newVotes.inc_votes;
  const queryStr = `UPDATE reviews SET votes = votes + ${voteValue} WHERE review_id = ${review_id} RETURNING *`;
  return db.query(queryStr).then((result) => {
    const review = result.rows[0];
    if (review === undefined) {
      return Promise.reject({
        status: 404,
        msg: `no review found`,
      });
    } else {
      return review;
    }
  });
};

exports.fetchUsers = () => {
  const queryStr = `SELECT * FROM users`;
  return db.query(queryStr).then((result) => {
    const users = result.rows;
    if (users === undefined) {
      return Promise.reject({
        status: 404,
        msg: "route does not exist",
      });
    }
    return users;
  });
};

exports.deletingUsers = (comment_id) => {
  const queryStr = `DELETE FROM comments where comment_id=${comment_id} RETURNING *`;
  return db.query(queryStr).then((result) => {
    const comment = result.rows;
    if (comment.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "comment_id does not exist",
      });
    }
  });
};
