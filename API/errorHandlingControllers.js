exports.handlesIncorrectPaths =
  ("*",
  (req, res) => {
    res.status(404).send("route does not exist");
  });

exports.dataErrors = (err, req, res, next) => {
  if (err.msg === `body is empty`) {
    res.status(400).send(err.msg)
  } else if (err.msg === `no username`) {
    res.status(400).send(err.msg)
  }
  next(err);
};

exports.PSQLhandlers = (err, req, res, next) => {
  const errs = ["42703", "22P02", "42601"];
  const usererrs = ["23503"];
  if (errs.includes(err.code)) {
    res.status(400).send("bad request");
  } else if (usererrs.includes(err.code) && err.detail.includes('is not present in table "users".')) {
    res.status(404).send('username does not exist');
  } else if (usererrs.includes(err.code) && err.detail.includes('is not present in table "reviews".')) {
    res.status(404).send("cannot find review_id");
  } 
  next(err);
};
  
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg === `no review found`) {
        res.status(404).send("no review found");
    } else if (err.msg === `no comments found`) {
        res.status(404).send("no comments found") 
    } else if (err.msg === `no category found`){
        res.status(404).send(`no category found`)
    } else if (err.msg === `bad request`){
        res.status(400).send(`bad request`)
    }else {
        res.status(404)
    }
    next(err)
}


exports.handle500statuses = (err, req, res, next) => {
  res.status(500).send("Server Error!");
};
