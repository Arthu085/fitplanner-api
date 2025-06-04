const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkActiveTrainingSession = async (req, res, next) => {
	const id_user = req.user.id;
	const { id_training } = req.params;

	try {
		const activeSession = await prisma.training_session.findFirst({
			where: {
				id_user,
				id_training: Number(id_training),
				finished_at: null,
			},
		});

		if (activeSession) {
			return res.status(400).json({
				success: false,
				message:
					"Você já iniciou este treino e ainda não finalizou a sessão anterior",
			});
		}

		next();
	} catch (error) {
		console.error("Erro ao verificar sessão ativa:", error);
		return res.status(500).json({
			success: false,
			message: "Erro interno ao verificar sessões ativas",
		});
	}
};

module.exports = checkActiveTrainingSession;
