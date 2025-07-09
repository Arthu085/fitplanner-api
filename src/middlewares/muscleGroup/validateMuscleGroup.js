const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const validateMuscleGroup = async (req, res, next) => {
	const { id_muscle_group } = req.body;

	try {
		const muscleGroup = await prisma.muscle_group.findUnique({
			where: { id: Number(id_muscle_group) },
		});

		if (!muscleGroup) {
			return res.status(400).json({
				success: false,
				error: "Grupo muscular informado não existe",
			});
		}

		next();
	} catch (error) {
		console.error("Erro ao validar grupo muscular:", error);
		return res.status(500).json({
			success: false,
			error: "Erro no servidor interno",
		});
	}
};

module.exports = validateMuscleGroup;
