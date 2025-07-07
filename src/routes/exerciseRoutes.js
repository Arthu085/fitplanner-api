const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");

const {
	fetchAllExercises,
	createExercise,
	deleteExercise,
	editExercise,
} = require("../controllers/exerciseController");
const validateCreateExercise = require("../middlewares/exercise/validateCreateExercise");
const authorizeExercise = require("../middlewares/exercise/authorizeExercise");
const validateMuscleGroup = require("../middlewares/muscleGroup/validateMuscleGroup");

const router = express.Router();

router.get("/", authMiddleware, fetchAllExercises);
router.post(
	"/create",
	authMiddleware,
	validateCreateExercise,
	validateMuscleGroup,
	createExercise
);
router.delete(
	"/delete/:id_exercise",
	authMiddleware,
	authorizeExercise,
	deleteExercise
);
router.patch(
	"/edit/:id_exercise",
	authMiddleware,
	authorizeExercise,
	validateMuscleGroup,
	editExercise
);

module.exports = router;
