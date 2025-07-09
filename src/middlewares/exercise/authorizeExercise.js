const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authorizeExercise = async (req, res, next) => {
	const { id_exercise } = req.params;
	const id_user = req.user.id;

	try {
		const exercise = await prisma.exercise.findUnique({
			where: { id: Number(id_exercise) },
		});

		if (!exercise) {
			return res.status(404).json({
				error: "Exercício não encontrado",
				success: false,
			});
		}

		if (exercise.id_user !== id_user) {
			return res.status(403).json({
				error: "Você não tem permissão para editar ou excluir esse exercício",
				success: false,
			});
		}

		req.exercise = exercise;
		next();
	} catch (error) {
		console.error("Erro na autorização do exercício:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

module.exports = authorizeExercise;
