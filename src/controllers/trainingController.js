const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTraining = async (req, res) => {
	const { title, exercises } = req.body;
	const id_user = req.user.id;

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
					select: {
						id: true,
						id_exercise: true,
						series: true,
						repetitions: true,
					},
				},
			},
		});

		const modified = trainings.map((training) => ({
			...training,
			exercise_workout: training.exercise_workout.map((item) => ({
				...item,
				id_exercise_workout: item.id,
				id: undefined,
			})),
		}));

		return res.status(200).json(modified);
	} catch (error) {
		console.error("Erro ao buscar treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

const fetchTrainingDetails = async (req, res) => {
	const training = req.training;

	try {
		const details = await prisma.training.findUnique({
			where: { id: Number(training.id) },
			include: {
				exercise_workout: {
					select: {
						id: true,
						id_exercise: true,
						series: true,
						repetitions: true,
						exercise: {
							select: {
								id_muscle_group: true,
								name: true,
								description: true,
								muscle_group: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				},
			},
		});

		const modified = {
			...details,
			exercise_workout: details.exercise_workout.map((item) => ({
				...item,
				id_exercise_workout: item.id,
				id: undefined,
			})),
		};

		return res.status(200).json(modified);
	} catch (error) {
		console.error("Erro ao buscar detalhes do treino:", error);
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
		// Busca exercícios atuais no banco para o treino
		const currentExercises = await prisma.exercise_workout.findMany({
			where: { id_training: training.id },
		});

		// IDs dos exercícios atuais
		const currentIds = currentExercises.map((ex) => ex.id);

		// IDs enviados na requisição
		const sentIds = (Array.isArray(exercises) ? exercises : [])
			.filter((ex) => ex.id_exercise_workout)
			.map((ex) => ex.id_exercise_workout);

		// Identifica exercícios removidos (presentes no banco, mas não na requisição)
		const toDeleteIds = currentIds.filter((id) => !sentIds.includes(id));

		// Verifica se houve alteração no título
		const titleChanged = title && title !== training.title;

		// Verifica se houve alteração nos exercícios
		// Simplificação: compara quantidade + conteúdo básico (pode ser melhorado)
		const exercisesChanged =
			exercises.length !== currentExercises.length ||
			exercises.some((ex) => {
				if (!ex.id_exercise_workout) return true; // novo exercício
				// procura o exercício atual para comparar dados
				const currentEx = currentExercises.find(
					(ce) => ce.id === ex.id_exercise_workout
				);
				if (!currentEx) return true;
				return (
					ex.id_exercise !== currentEx.id_exercise ||
					ex.series !== currentEx.series ||
					ex.repetitions !== currentEx.repetitions
				);
			});

		if (!titleChanged && !exercisesChanged && toDeleteIds.length === 0) {
			return res.status(400).json({
				message: "Nenhuma alteração foi feita",
				success: false,
			});
		}

		// Validação dos exercícios enviados
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

		// Atualiza o título se necessário
		if (titleChanged) {
			await prisma.training.update({
				where: { id: training.id },
				data: { title },
			});
		}

		// Remove os exercícios deletados
		if (toDeleteIds.length > 0) {
			await prisma.exercise_workout.deleteMany({
				where: { id: { in: toDeleteIds } },
			});
		}

		// Atualiza ou cria exercícios
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
	fetchTrainingDetails,
	deleteTraining,
	editTraining,
};
