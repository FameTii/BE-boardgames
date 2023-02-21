exports.handlesIncorrectPaths = ("*", (req, res) => {
    res.status(404).send("route does not exist");
  });
  
exports.handlesIncorrectReviewIds = (err, req, res, next) => {
    if (err.msg === `no review found`) {
        res.status(404).send("no review found");
    } else {
        res.status(404);
    }
    next(err)
};

exports.PSQLhandlers = (err, req, res, next) => {
    const errs = ['42703', '22P02']
    // console.log(err.code);
    if(errs.includes(err.code)) {
        res.status(400).send("bad request")
    }
    next(err)
}

exports.handle500statuses = (err, req, res, next) => {
    res.status(500).send("Server Error!");
  };
