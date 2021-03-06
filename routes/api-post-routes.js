var db = require("../models");
//var passport = require("../config/passport");

module.exports = function (app) {
  // get all posted rocks. We want user to be able to see ALL posts( their own and others)
  app.get("/api/rock/sellerData", function (req, res) {
    db.Rock.findAll({
      where: {
        posted: true
      }
    })
      .then(function (dbRock) {
        res.json(dbRock);
      })
      .catch(function (err) {
        res.status(500).end();
        console.log(err);
      });
  });

  // get all users rocks (inventory)
  app.get("/api/user/inventory", function (req, res) {
    const uid = req.session.passport.user.id;
    db.Rock.findAll({where: {userId: uid}},
      {include: db.User}
    )
      .then(function (dbrocks) {
        res.json(dbrocks);
      })
      .catch(function () {
        res.status(500).end();
      });
  });
  // Get specific rock in user inventory
  app.get("/api/user/inventory/:id", function (req, res) {
    db.Rock.findOne({
      where: {
        id: req.params.id
      },
      include: db.User
    })
      .then(function (dbrocks) {
        res.json(dbrocks);
      })
      .catch(function () {
        res.status(500).end();
      });
  });
  // allow a logged in user to add rock to their inventory
  app.post("/api/user/inventory", function (req, res) {
    const uid = req.session.passport.user.id;
    req.body.UserId = uid;
    db.Rock.create(req.body, {include: db.User})
      .then(function (dbPost) {
        res.json(dbPost);
      })
      .catch(err => console.log(err));
  });
  // allow a logged in user to post new rock
  app.post("/api/rock/sellerData", function(req, res) { 
    var uid = req.session.passport.user.id;
    req.body.UserId = uid;
    db.Rock.create(req.body, {include: db.User})
      .then(function(dbPost) {
        res.json(dbPost);
      })
      .catch(err => console.log(err));
  });

  app.delete("/api/rock/sellerData/:id", function (req, res) {
    db.Rock.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });
  app.put("/api/rock/sellerData/:id", function (req, res) {
    db.Rock.update(
      {
        posted: true},
      {where: { id: req.params.id}
      }).then(function (dbUpdate) {
      res.json(dbUpdate);
    });
  });
  app.put("/api/user/inventory/:id", function (req, res) {
    db.Rock.update(
      req.body, {
        where: {
          id: req.body.id
        }
      }).then(function (dbPost) {
      res.json(dbPost);
    });
  });
};