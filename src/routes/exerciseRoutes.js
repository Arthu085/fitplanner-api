const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");

const {
	fetchAllExercises,
	createExercise,
} = require("../controllers/exerciseController");
const validateCreateExercise = require("../middlewares/exercise/validateCreateExercise");

const router = express.Router();

router.get("/", authMiddleware, fetchAllExercises);
router.post("/create", authMiddleware, validateCreateExercise, createExercise);

module.exports = router;
