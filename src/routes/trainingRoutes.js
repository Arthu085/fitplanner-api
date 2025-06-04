const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
	createTraining,
	fetchTrainingByUser,
	deleteTraning,
	editTraining,
} = require("../controllers/trainingController");

const router = express.Router();

router.post("/create", authMiddleware, createTraining);
router.get("/", authMiddleware, fetchTrainingByUser);
router.delete("/delete/:id_training", authMiddleware, deleteTraning);
router.patch("/edit/:id_training", authMiddleware, editTraining);

module.exports = router;
