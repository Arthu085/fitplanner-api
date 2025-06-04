const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authorizeTraining = async (req, res, next) => {
	const { id_training } = req.params;
	const id_user = req.user.id;

	try {
		const training = await prisma.training.findUnique({
			where: { id: Number(id_training) },
		});

		if (!training) {
			return res.status(404).json({
				error: "Treino não encontrado",
				success: false,
			});
		}

		if (training.id_user !== id_user) {
			return res.status(403).json({
				error:
					"Você não tem permissão para editar, excluir ou iniciar esse treino",
				success: false,
			});
		}

		req.training = training;
		next();
	} catch (error) {
		console.error("Erro na autorização do treino:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

module.exports = authorizeTraining;
