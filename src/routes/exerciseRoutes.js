const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");

const { fetchAllExercises } = require("../controllers/exerciseController");

const router = express.Router();

router.get("/", authMiddleware, fetchAllExercises);

module.exports = router;
