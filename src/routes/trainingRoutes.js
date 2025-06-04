const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
	createTraining,
	fetchTrainingByUser,
} = require("../controllers/trainingController");

const router = express.Router();

router.post("/create", authMiddleware, createTraining);
router.get("/:id_user", authMiddleware, fetchTrainingByUser);

module.exports = router;
