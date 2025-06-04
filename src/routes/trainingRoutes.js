const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeTraining = require("../middlewares/authorizeTraining");
const validateCreateTraining = require("../middlewares/validateCreateTraining");

const {
	createTraining,
	fetchTrainingByUser,
	deleteTraining,
	editTraining,
} = require("../controllers/trainingController");

const router = express.Router();

router.post("/create", authMiddleware, validateCreateTraining, createTraining);
router.get("/", authMiddleware, fetchTrainingByUser);
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
