const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const fetchAllMuscleGroups = async (req, res) => {
	const id_user = req.user.id;

	if (!id_user) {
		return res.status(400).json({
			error: "ID do usuário é obrigatório",
			success: false,
		});
	}

	try {
		const muscleGroups = await prisma.muscle_group.findMany({});

		return res.status(200).json({
			data: muscleGroups,
			success: true,
		});
	} catch (error) {
		console.error("Erro ao buscar grupos musculares:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

module.exports = { fetchAllMuscleGroups };
