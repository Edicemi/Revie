const express = require("express");
router = express.Router();
const { body } = require("express-validator");
const {
  signUp,
  login,
  reviewPost,
  reviewCount,
  getReviews
} = require("../controllers/index");

const { validateUserToken } = require("../lib/ath");

// route for authentication
router.post(
  "/signUp",
  body("fullname", "Name is required").trim(),
  body("email").isEmail().normalizeEmail(),
  body("password", "Password must be of  8 characters long and alphanumeric")
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric(),
  signUp
);

router.post("/login", login);
router.post("/review", validateUserToken, reviewPost);
router.put("/countAdd/:reviewId", reviewCount);
router.get("/reviews", getReviews);

module.exports = router;
