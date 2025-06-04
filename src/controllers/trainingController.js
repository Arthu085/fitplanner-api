const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTraining = async (req, res) => {
	const { title, exercises } = req.body;
	const id_user = req.user.id;

	if (
		!id_user ||
		!title ||
		!Array.isArray(exercises) ||
		exercises.length === 0
	) {
		return res.status(400).json({
			error: "Dados inválidos para criação do treino",
			success: false,
		});
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
			success: false,
		});
	}
};

const fetchTrainingByUser = async (req, res) => {
	const id_user = req.user.id;

	if (!id_user) {
		return res.status(400).json({
			error: "ID do usuário é obrigatório",
			success: false,
		});
	}

	try {
		const trainings = await prisma.training.findMany({
			where: { id_user: Number(id_user) },
			include: {
				exercise_workout: {
					include: {
						exercise: {
							include: {
								muscle_group: true,
							},
						},
					},
				},
			},
		});

		// Transformação para renomear os ids
		const formated = trainings.map((training) => ({
			id_training: training.id,
			id_user: training.id_user,
			title: training.title,
			exercise_workout: training.exercise_workout.map((workout) => ({
				id_workout: workout.id,
				id_training: workout.id_training,
				id_exercise: workout.id_exercise,
				series: workout.series,
				repetitions: workout.repetitions,
				exercise: {
					id_exercise: workout.exercise.id,
					id_muscle_group: workout.exercise.id_muscle_group,
					name: workout.exercise.name,
					description: workout.exercise.description,
					muscle_group: {
						id_muscle_group: workout.exercise.muscle_group.id,
						name: workout.exercise.muscle_group.name,
					},
				},
			})),
		}));

		return res.status(200).json(formated);
	} catch (error) {
		console.error("Erro ao buscar treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

const deleteTraining = async (req, res) => {
	const training = req.training; // já validado e disponível pelo middleware

	try {
		await prisma.training.delete({
			where: {
				id: training.id,
			},
		});

		return res.status(200).json({
			message: "Treino excluído com sucesso",
			success: true,
		});
	} catch (error) {
		console.error("Erro ao excluir treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

const editTraining = async (req, res) => {
	const { title, exercises } = req.body;
	const training = req.training; // já validado pelo middleware

	try {
		if (Array.isArray(exercises)) {
			for (const ex of exercises) {
				const { id_exercise_workout } = ex;

				if (id_exercise_workout) {
					const existing = await prisma.exercise_workout.findUnique({
						where: { id: id_exercise_workout },
					});

					if (!existing || existing.id_training !== training.id) {
						return res.status(404).json({
							error: `Exercício com id ${id_exercise_workout} não encontrado ou inválido`,
							success: false,
						});
					}
				}
			}
		}

		if (title) {
			await prisma.training.update({
				where: { id: training.id },
				data: { title },
			});
		}

		if (Array.isArray(exercises)) {
			for (const ex of exercises) {
				const { id_exercise_workout, id_exercise, series, repetitions } = ex;

				if (id_exercise_workout) {
					await prisma.exercise_workout.update({
						where: { id: id_exercise_workout },
						data: {
							...(id_exercise !== undefined && { id_exercise }),
							...(series !== undefined && { series }),
							...(repetitions !== undefined && { repetitions }),
						},
					});
				} else if (id_exercise && series && repetitions) {
					await prisma.exercise_workout.create({
						data: {
							id_training: training.id,
							id_exercise,
							series,
							repetitions,
						},
					});
				}
			}
		}

		return res.status(200).json({
			message: "Treino atualizado com sucesso",
			success: true,
		});
	} catch (error) {
		console.error("Erro ao editar treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

module.exports = {
	createTraining,
	fetchTrainingByUser,
	deleteTraining,
	editTraining,
};
