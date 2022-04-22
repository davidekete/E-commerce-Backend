const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      console.log(hash);
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then((result) => {
          res.status(201).json({
            message: "User Created",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(401).json({
          message: "Auth failed",
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth Sucessful",
            token,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((error) => {});
});

router.delete("/:userId", (req, res) => {
  const id = req.params.userId;
  User.findByIdAndDelete(id)
    .then((result) => {
      res.status(200).json({
        message: "User Deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        err,
      });
    });
});

module.exports = router;
