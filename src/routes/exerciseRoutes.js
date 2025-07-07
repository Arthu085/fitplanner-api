const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");

const {
	fetchAllExercises,
	createExercise,
	deleteExercise,
} = require("../controllers/exerciseController");
const validateCreateExercise = require("../middlewares/exercise/validateCreateExercise");
const authorizeExercise = require("../middlewares/exercise/authorizeExercise");

const router = express.Router();

router.get("/", authMiddleware, fetchAllExercises);
router.post("/create", authMiddleware, validateCreateExercise, createExercise);
router.delete(
	"/delete/:id_exercise",
	authMiddleware,
	authorizeExercise,
	deleteExercise
);

module.exports = router;
