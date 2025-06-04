const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTraining = async (req, res) => {
	const { id_user, title, exercises } = req.body;

	if (
		!id_user ||
		!title ||
		!Array.isArray(exercises) ||
		exercises.length === 0
	) {
		return res
			.status(400)
			.json({ error: "Dados inválidos para criação do treino" });
	}

	try {
		const tableTraining = await prisma.training.create({
			data: {
				id_user,
				title,
			},
		});

		const idTraining = tableTraining.id;

		const workoutData = exercises.map((ex) => ({
			id_training: idTraining,
			id_exercise: ex.id_exercise,
			series: ex.series,
			repetitions: ex.repetitions,
		}));

		await prisma.exercise_workout.createMany({
			data: workoutData,
		});

		return res.status(201).json({
			success: true,
			message: "Treino criado com sucesso",
			training: {
				id: idTraining,
				title,
			},
		});
	} catch (error) {
		console.error("Erro ao criar treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
		});
	}
};

module.exports = { createTraining };
