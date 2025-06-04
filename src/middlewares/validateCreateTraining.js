const Joi = require("joi");

const trainingSchema = Joi.object({
	title: Joi.string().min(1).required(),
	exercises: Joi.array()
		.items(
			Joi.object({
				id_exercise: Joi.number().integer().min(1).required(),
				series: Joi.number().integer().min(1).required(),
				repetitions: Joi.number().integer().min(1).required(),
			})
		)
		.min(1)
		.required(),
});

const validateCreateTraining = (req, res, next) => {
	const { error } = trainingSchema.validate(req.body, { abortEarly: false });

	if (error) {
		return res.status(400).json({
			success: false,
			error: "Erro de validação",
			details: error.details.map((detail) => detail.message),
		});
	}

	next();
};

module.exports = validateCreateTraining;
