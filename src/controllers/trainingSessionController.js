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
		const id_training_session = Number(req.params.id_training_session);
		const id_user = req.user.id;
		const { exercises } = req.body;

		if (isNaN(id_training_session)) {
			return res
				.status(400)
				.json({ success: false, message: "ID da sessão inválido" });
		}

		if (!Array.isArray(exercises) || exercises.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Lista de exercícios é obrigatória",
			});
		}

		const existingSession = await prisma.training_session.findUnique({
			where: { id: id_training_session },
		});

		if (!existingSession) {
			return res
				.status(404)
				.json({ success: false, message: "Sessão não encontrada" });
		}

		if (existingSession.id_user !== id_user) {
			return res
				.status(403)
				.json({ success: false, message: "Acesso não autorizado" });
		}

		const validExercises = await prisma.exercise_workout.findMany({
			where: { id_training: existingSession.id_training },
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
				id_training_session: id_training_session,
				id_exercise: ex.id_exercise,
				series: ex.series ?? defaultValues.series,
				repetitions: ex.repetitions ?? defaultValues.repetitions,
				weight: ex.weight ?? null,
				notes: ex.notes ?? null,
			});
		}

		const session = await prisma.training_session.update({
			where: { id: id_training_session },
			data: { finished_at: new Date() },
		});

		await prisma.exercise_session.createMany({ data });

		return res.status(200).json({
			success: true,
			message: "Treino finalizado com sucesso.",
			session,
		});
	} catch (error) {
		console.error("Erro ao finalizar treino:", error);
		return res.status(500).json({ success: false, message: "Erro interno." });
	}
};

module.exports = {
	startTrainingSession,
	finishTrainingSession,
};
