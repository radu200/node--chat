const { db } = require(".././config/database.js");

module.exports.loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/api/login");
  }
};

//Login required middleware
module.exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/api/login");
  }
};

/// middleware for user access controll
module.exports.employer = function(req, res, next) {
  if (req.user.type === "employer") {
    return next();
  } else {
    res.redirect("/api/login");
  }
};

module.exports.jobSeeker = function(req, res, next) {
  if (req.user.type === "jobseeker") {
    return next();
  } else {
    res.redirect("/api/login");
  }
};

//json format
//Login required middleware
module.exports.ensureAuthenticatedJsonRes = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.json({
      auth: "notAuthenticated"
    });
  }
};

module.exports.employerJsonRes = function(req, res, next) {
  if (req.user.type === "employer") {
    res.json({
      auth: "employer"
    });
  } else {
    res.json({
      auth: "notEmployer"
    });
  }
};

module.exports.ensureEmailChecked = (req, res, next) => {
  db.query(
    "select id, email,email_status from users where id = ? ",
    [req.user.id],
    (err, results) => {
      if (err) throw err;

      if (
        results[0].email_status === "unverified" ||
        results[0].email_status === null
      ) {
        res.redirect("/api/resend/email/check");
      } else {
        return next();
      }
    }
  );
};

module.exports.userAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/api/profile");
  } else {
    res.redirect("/api/login");
  }
};