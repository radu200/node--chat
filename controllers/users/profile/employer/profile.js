const { dbPromise } = require("../../../.././config/database.js");
const msg = require("../../../utils/messages");
const urlPaths = require("../../../utils/url-paths");

module.exports.getCandidateDetails = (req, res, next) => {
  res.render("profile/employer/candidate_details");
};

module.exports.getEmployerJobDetail = (req, res, next) => {
  res.render("profile/employer/employer_job_detail");
};

//employer
module.exports.getEmployerProfileInfoEdit = async (req, res, next) => {
  try {
    const db = await dbPromise;
    const [userDetails] = await db.execute(
      "select id, first_name, last_name from users where id = ?",
      [req.user.id]
    );

    res.render("profile/employer/employer_profile_edit", {
      result: userDetails[0]
    });
  } catch (err) {
    console.log(err);
  }
};

//employer
module.exports.postEmployerProfileInfoEdit = async (req, res, next) => {
  let first_name = req.body.firstName;
  let last_name = req.body.lastName;

  req
    .checkBody(
      "firstName",
      "Prenumele trebuie să aibă o lungime între 1 și 250 de caractere"
    )
    .len(1, 250);
  req
    .checkBody(
      "lastName",
      "Numele de familie trebuie să aibă o lungime între 1 și 250 de caractere"
    )
    .len(1, 250);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("error_msg", errors);
    return res.redirect(urlPaths.back);
  }

  try {
    const db = await dbPromise;

    await db.execute(
      "update users set  first_name = ?, last_name = ?  where id = ?",
      [first_name, last_name, req.user.id]
    );

    res.redirect(urlPaths.profile);
  } catch (err) {
    console.log(err);
  }
};
///employer
module.exports.getCompanyInfoEdit = async (req, res, next) => {
  try {
    const db = await dbPromise;

    const [userDetails] = await db.execute(
      "select id, company_description,company_name, company_location, company_type from users where id = ?",
      [req.user.id]
    );

    res.render("profile/employer/company_info_edit", {
      result: userDetails[0]
    });
  } catch (err) {
    console.log(err);
  }
};

//employer
module.exports.postCompanyInfoEdit = async (req, res, next) => {
  const name = req.body.companyName;
  const description = req.body.companyDescription;
  const location = req.body.company_location;
  const type = req.body.companyType;

  //asta e solutia validarii
  req
    .checkBody(
      "companyName",
      "Numele trebuie să aibă o lungime intre 1 si 70 de caractere."
    )
    .len(1, 70);
  req
    .checkBody(
      "companyType",
      "Tipul companiei trebuie să aibă o lungime intre 1 si 70 de caractere"
    )
    .len(1, 70);
  req
    .checkBody(
      "companyDescription",
      "Descrierea trebuie să aibă o lungime intre 1 si 250 de caractere"
    )
    .len(1, 250);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("error_msg", errors);
    return res.redirect(urlPaths.companyEdit);
  }

  try {
    const db = await dbPromise;
    await db.execute(
      "update  users set  company_name = ? , company_description = ?,  company_location = ?,  company_type  = ? where id = ?",
      [name, description, location, type, req.user.id]
    );
    res.redirect(urlPaths.profile);
  } catch (err) {
    console.log(err);
  }
};
//employer company profile
module.exports.getCompanyProfile = async (req, res, next) => {
  try {
    const db = await dbPromise;

    const [user] = await db.execute(
      "SELECT  id, avatar,first_name, last_name, company_name, company_description, company_location, company_type  FROM users  WHERE id = ? AND blacklist = ? ",
      [req.params.id,'no']
    );
    if(user[0]){
      const [jobs] = await db.execute(
        "SELECT * FROM  jobs WHERE jobs.employer_id = ?  ",
        [user[0].id]
      );
      res.render("profile/employer/company_profile", {
         job: jobs,
        employer: user[0]
      });
      
    } else {
      res.render("profile/employer/company_profile");
    }

  } catch (err) {
    console.log(err);
  }
};
