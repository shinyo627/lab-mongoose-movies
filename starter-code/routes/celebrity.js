const express = require("express");
const router = express.Router();
const Celebrity = require("../models/Celebrity");

router.get("/celebrities", (req, res, next) => {
  // get all of mandem
  Celebrity.find()
    .then((celebritiesFromDB) => {
      // render a view and pass in the celebs
      console.log("this is the celebs", celebritiesFromDB);
      res.render("celebrities/index.hbs", {
        celebsList: celebritiesFromDB,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// router.get is always before any logic with params
router.get("/celebrities/new", (req, res, next) => {
  // mongoose methods are promise not express
  res.render("celebrities/new");
});

router.get("/celebrities/:celebId", (req, res, next) => {
  const id = req.params.celebId;
  // getting datas from model by model
  Celebrity.findById(id)
    .then((celebrityFromDB) => {
      console.log(celebrityFromDB);
      res.render("celebrities/show", {
        celebrity: celebrityFromDB,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// delete celeb
router.post("/celebrities/:celebId/delete", (req, res, next) => {
  const id = req.params.celebId;
  Celebrity.findByIdAndRemove(id)
    .then(() => {
      res.redirect("/celebrities");
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/celebrities", (req, res, next) => {
  // the keys are same as inside inputs' name attributes
  const { name, occupation, catchPhrase } = req.body;
  //  this is already adding to DB
  Celebrity.create({
    name: name,
    occupation: occupation,
    catchPhrase: catchPhrase,
  })
    .then((book) => {
      console.log(`New book was created: ${book}`);
      //
      res.redirect(`/celebrities`);
    })
    .catch((error) => {
      res.redirect("celebrities/new");
    });
});

// Edit Celebs
router.get("/celebrities/:celebId/edit", (req, res, next) => {
  const id = req.params.celebId;
  Celebrity.findById(id)
    .then((celebFromDB) => {
      res.render("celebrities/edit", {
        celebrity: celebFromDB,
      });
    })
    .catch((error) => {
      next(error);
    });
});

// Edit Post

router.post(`/celebrities/:id`, (req, res, next) => {
  const { name, occupation, catchPhrase } = req.body;
  const id = req.params.bookId;
  Celebrity.update(id, {
    name: name,
    occupation: occupation,
    catchPhrase: catchPhrase,
  })
    .then(() => {
      res.redirect(`/celebrities`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
