const categories = require("../db/data/development-data/categories");
const { fetchCategories } = require("./models");

exports.getCategories = (req, res, next) => {
    fetchCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err)
    })
}
