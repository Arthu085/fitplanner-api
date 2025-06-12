const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");
const authorizeTraining = require("../middlewares/training/authorizeTraining");
const validateCreateTraining = require("../middlewares/training/validateCreateTraining");

const {
	createTraining,
	fetchTrainingByUser,
	deleteTraining,
	editTraining,
	fetchTrainingDetails,
} = require("../controllers/trainingController");

const router = express.Router();

router.post("/create", authMiddleware, validateCreateTraining, createTraining);

router.get("/", authMiddleware, fetchTrainingByUser);

router.get(
	"/:id_training",
	authMiddleware,
	authorizeTraining,
	fetchTrainingDetails
);

router.delete(
	"/delete/:id_training",
	authMiddleware,
	authorizeTraining,
	deleteTraining
);

router.patch(
	"/edit/:id_training",
	authMiddleware,
	authorizeTraining,
	editTraining
);

module.exports = router;
