const Joi = require("joi");

const exerciseSchema = Joi.object({
	name: Joi.string().min(1).required(),
	id_muscle_group: Joi.string().min(1).required(),
	description: Joi.string().min(1).required(),
});

const validateCreateExercise = (req, res, next) => {
	const { error } = exerciseSchema.validate(req.body, { abortEarly: false });

	if (error) {
		return res.status(400).json({
			success: false,
			error: "Erro de validação",
			details: error.details.map((detail) => detail.message),
		});
	}

	next();
};

module.exports = validateCreateExercise;
