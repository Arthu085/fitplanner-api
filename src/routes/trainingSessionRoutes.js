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

module.exports = router;
