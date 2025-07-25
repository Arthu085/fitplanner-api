const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");
const validateTrainingSession = require("../middlewares/trainingSession/validateTrainingSession");
const authorizeTraining = require("../middlewares/training/authorizeTraining");
const checkActiveTrainingSession = require("../middlewares/trainingSession/checkActiveTrainingSession");

const {
	startTrainingSession,
	finishTrainingSession,
	deleteTrainingSession,
	fetchTrainingSessionByUser,
	fetchTrainingSessionByUserAndId,
	fetchExerciseByTrainingAndSession,
} = require("../controllers/trainingSessionController");

const router = express.Router();

router.post(
	"/start/:id_training",
	authMiddleware,
	authorizeTraining,
	checkActiveTrainingSession,
	startTrainingSession
);

router.post(
	"/finish/:id_training_session",
	authMiddleware,
	validateTrainingSession(false),
	finishTrainingSession
);

router.delete(
	"/delete/:id_training_session",
	authMiddleware,
	validateTrainingSession(true),
	deleteTrainingSession
);

router.get("/", authMiddleware, fetchTrainingSessionByUser);

router.get(
	"/details/:id_training_session",
	authMiddleware,
	validateTrainingSession(true),
	fetchTrainingSessionByUserAndId
);

router.get(
	"/exercise/:id_training_session",
	authMiddleware,
	validateTrainingSession(true),
	fetchExerciseByTrainingAndSession
);

module.exports = router;
