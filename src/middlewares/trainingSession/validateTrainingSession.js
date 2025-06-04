const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const validateTrainingSession = (allowFinished = false) => {
	return async (req, res, next) => {
		const { id_training_session } = req.params;

		try {
			const session = await prisma.training_session.findUnique({
				where: { id: Number(id_training_session) },
			});

			if (!session) {
				return res.status(404).json({
					success: false,
					message: "Sessão de treino não encontrada",
				});
			}

			if (!allowFinished && session.finished_at !== null) {
				return res.status(400).json({
					success: false,
					message: "Sessão de treino já foi finalizada",
				});
			}

			req.trainingSession = session;
			next();
		} catch (error) {
			console.error("Erro ao validar sessão de treino:", error);
			return res.status(500).json({
				success: false,
				message: "Erro interno ao validar a sessão",
			});
		}
	};
};

module.exports = validateTrainingSession;
