const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");

const {
	fetchAllMuscleGroups,
} = require("../controllers/muscleGroupController");

const router = express.Router();

router.get("/", authMiddleware, fetchAllMuscleGroups);

module.exports = router;
