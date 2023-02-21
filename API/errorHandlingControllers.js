exports.handlesIncorrectPaths = ("*", (req, res) => {
    res.status(404).send("route does not exist");
  });
  
exports.handlesIncorrectReviewIds = ((err, req, res, next) => {
    if (err.msg === `no review found`) {
      res.status(404).send("no review found");
    } else {
      res.status(404);
    }
  });

exports.handle500statuses = ((err, req, res, next) => {
    res.status(500).send("Server Error!");
  });