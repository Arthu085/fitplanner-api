const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const { createTraining } = require("../controllers/trainingController");

const router = express.Router();

router.post("/create", authMiddleware, createTraining);

module.exports = router;
