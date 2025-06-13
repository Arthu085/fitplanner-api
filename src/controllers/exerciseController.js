const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const fetchAllExercises = async (req, res) => {
	const id_user = req.user.id;

	if (!id_user) {
		return res.status(400).json({
			error: "ID do usuário é obrigatório",
			success: false,
		});
	}

	try {
		const exercises = await prisma.exercise.findMany({
			include: {
				muscle_group: {
					select: {
						name: true,
					},
				},
			},
		});

		return res.status(200).json(exercises);
	} catch (error) {
		console.error("Erro ao buscar exercícios:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

module.exports = { fetchAllExercises };
