exports.handlesIncorrectPaths =
  ("*",
  (req, res) => {
    res.status(404).send("route does not exist");
  });

exports.handlesIncorrectReviewIds = (err, req, res, next) => {
  if (err.msg === `no review found`) {
    res.status(404).send("no review found");
  } else {
    res.status(404);
  }
  next(err);
};

exports.dataErrors = (err, req, res, next) => {
  if (err.msg === `body is empty`) {
    res.status(403).send(err.msg);
  };
  next(err);
};

exports.PSQLhandlers = (err, req, res, next) => {
  const errs = ["42703", "22P02"];
  const usererrs = ["23503"];
  if (errs.includes(err.code)) {
    res.status(400).send("bad request");
  } else if (usererrs.includes(err.code)) {
    res.status(404).send("cannot find review_id");
  }
  next(err);
};

exports.handle500statuses = (err, req, res, next) => {
  res.status(500).send("Server Error!");
};
