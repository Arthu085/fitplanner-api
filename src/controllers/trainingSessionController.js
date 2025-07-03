const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const startTrainingSession = async (req, res) => {
	try {
		const id_training = Number(req.params.id_training);
		const id_user = req.user.id;

		if (isNaN(id_training)) {
			return res
				.status(400)
				.json({ success: false, message: "ID de treino inválido" });
		}

		const session = await prisma.training_session.create({
			data: {
				id_user,
				id_training,
				started_at: new Date(),
				finished_at: null,
			},
		});

		return res.status(200).json({
			success: true,
			message: "Treino iniciado",
			session,
		});
	} catch (error) {
		console.error("Erro ao iniciar treino:", error);
		return res.status(500).json({ success: false, message: "Erro interno" });
	}
};

const finishTrainingSession = async (req, res) => {
	try {
		const id_user = req.user.id;
		const session = req.trainingSession; // já vem do middleware
		const { exercises } = req.body;

		if (session.id_user !== id_user) {
			return res
				.status(403)
				.json({ success: false, message: "Acesso não autorizado" });
		}

		if (!Array.isArray(exercises) || exercises.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Lista de exercícios é obrigatória",
			});
		}

		const validExercises = await prisma.exercise_workout.findMany({
			where: { id_training: session.id_training },
			select: { id_exercise: true, series: true, repetitions: true },
		});

		const validMap = new Map();
		validExercises.forEach((e) =>
			validMap.set(e.id_exercise, {
				series: e.series,
				repetitions: e.repetitions,
			})
		);

		const data = [];

		for (const ex of exercises) {
			if (!validMap.has(ex.id_exercise)) {
				return res.status(400).json({
					success: false,
					message: `Exercício inválido: ${ex.id_exercise} não pertence ao treino`,
				});
			}

			const defaultValues = validMap.get(ex.id_exercise);

			data.push({
				id_training_session: session.id,
				id_exercise: ex.id_exercise,
				series: ex.series ?? defaultValues.series,
				repetitions: ex.repetitions ?? defaultValues.repetitions,
				weight: ex.weight ?? null,
				notes: ex.notes ?? null,
			});
		}

		const updatedSession = await prisma.training_session.update({
			where: { id: session.id },
			data: { finished_at: new Date() },
		});

		await prisma.exercise_session.createMany({ data });

		return res.status(200).json({
			success: true,
			message: "Treino finalizado com sucesso.",
			session: updatedSession,
		});
	} catch (error) {
		console.error("Erro ao finalizar treino:", error);
		return res.status(500).json({ success: false, message: "Erro interno." });
	}
};

const deleteTrainingSession = async (req, res) => {
	const session = req.trainingSession; // já vem do middleware
	const id_user = req.user.id;

	if (session.id_user !== id_user) {
		return res
			.status(403)
			.json({ success: false, message: "Acesso não autorizado" });
	}

	try {
		await prisma.training_session.delete({
			where: {
				id: session.id,
			},
		});

		return res.status(200).json({
			message: "Sessão de treino excluída com sucesso",
			success: true,
		});
	} catch (error) {
		console.error("Erro ao excluir sessão de treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

const fetchTrainingSessionByUser = async (req, res) => {
	const id_user = req.user.id;
	const page = parseInt(req.query.page) || 1;
	const limitParam = req.query.limit;
	const limit = limitParam !== undefined ? parseInt(limitParam) : 6;
	const unlimited = limit === 0;

	const skip = (page - 1) * limit;

	if (!id_user) {
		return res.status(400).json({
			error: "ID do usuário é obrigatório",
			success: false,
		});
	}

	try {
		const total = await prisma.training_session.count({
			where: { id_user: Number(id_user) },
		});

		const queryOptions = {
			where: { id_user: Number(id_user) },
			select: {
				id: true,
				id_user: true,
				id_training: true,
				started_at: true,
				finished_at: true,
				training: {
					select: { title: true },
				},
			},
			orderBy: { id: "desc" },
		};

		if (!unlimited) {
			queryOptions.skip = skip;
			queryOptions.take = limit;
		}

		const trainingsSessions = await prisma.training_session.findMany(
			queryOptions
		);

		const formated = trainingsSessions.map((session) => ({
			id_training_session: session.id,
			id_user: session.id_user,
			id_training: session.id_training,
			started_at: session.started_at,
			finished_at: session.finished_at,
			training: {
				title: session.training.title,
			},
		}));

		return res.status(200).json({
			data: formated,
			pagination: unlimited
				? null
				: {
						page,
						limit,
						total,
						totalPages: Math.ceil(total / limit),
				  },
		});
	} catch (error) {
		console.error("Erro ao buscar sessões de treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

const fetchTrainingSessionByUserAndId = async (req, res) => {
	const id_training_session = req.trainingSession.id; // já vem do middleware
	const id_user = req.user.id;

	if (!id_user) {
		return res.status(400).json({
			error: "ID do usuário é obrigatório",
			success: false,
		});
	}

	try {
		const trainingSession = await prisma.training_session.findFirst({
			where: { id_user: Number(id_user), id: Number(id_training_session) },
			include: {
				training: true,
				exercise_session: {
					include: {
						exercise: true,
					},
				},
			},
		});

		const formated = {
			id_training_session: trainingSession.id,
			id_user: trainingSession.id_user,
			id_training: trainingSession.id_training,
			started_at: trainingSession.started_at,
			finished_at: trainingSession.finished_at,
			training: {
				id_training: trainingSession.training.id,
				title: trainingSession.training.title,
			},
			exercise_session: trainingSession.exercise_session.map((exercise) => ({
				id_exercise_session: exercise.id,
				id_training_session: exercise.id_training_session,
				id_exercise: exercise.id_exercise,
				series: exercise.series,
				repetitions: exercise.repetitions,
				weight: exercise.weight,
				notes: exercise.notes,
				exercise: {
					id_exercise: exercise.exercise.id,
					id_muscle_group: exercise.exercise.id_muscle_group,
					name: exercise.exercise.name,
					description: exercise.exercise.description,
				},
			})),
		};

		return res.status(200).json(formated);
	} catch (error) {
		console.error("Erro ao buscar sessão de treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

const fetchExerciseByTrainingAndSession = async (req, res) => {
	const id_training_session = req.trainingSession.id; // já vem do middleware
	const id_user = req.user.id;

	if (!id_user) {
		return res.status(400).json({
			error: "ID do usuário é obrigatório",
			success: false,
		});
	}

	try {
		const session = await prisma.training_session.findFirst({
			where: {
				id: Number(id_training_session),
				id_user: Number(id_user),
			},
			select: {
				id_training: true,
			},
		});

		if (!session) {
			return res.status(404).json({
				success: false,
				message: "Sessão de treino não encontrada",
			});
		}

		const exerciseIds = await prisma.exercise_workout.findMany({
			where: {
				id_training: session.id_training,
			},
			select: {
				id_exercise: true,
			},
		});

		return res
			.status(200)
			.json(exerciseIds.map((e) => ({ id_exercise: e.id_exercise })));
	} catch (error) {
		console.error("Erro ao buscar exercícios da sessão de treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

module.exports = {
	startTrainingSession,
	finishTrainingSession,
	deleteTrainingSession,
	fetchTrainingSessionByUser,
	fetchTrainingSessionByUserAndId,
	fetchExerciseByTrainingAndSession,
};
