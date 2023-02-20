const db = require('../db/connection')

exports.fetchCategories = () => {
    let queryStr = `SELECT slug, description FROM categories`
    return db.query(queryStr).then((result) => {
        return result.rows;
      });
}