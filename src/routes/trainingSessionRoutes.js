const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const validateTrainingSession = require("../middlewares/validateTrainingSession");
const authorizeTraining = require("../middlewares/authorizeTraining");
const checkActiveTrainingSession = require("../middlewares/checkActiveTrainingSession");

const {
	startTrainingSession,
	finishTrainingSession,
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
	validateTrainingSession,
	finishTrainingSession
);

module.exports = router;
