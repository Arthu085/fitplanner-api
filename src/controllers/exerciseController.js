const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const fetchAllExercises = async (req, res) => {
	const id_user = req.user.id;
	const page = parseInt(req.query.page) || 1;
	const limitParam = req.query.limit;
	const limit = limitParam !== undefined ? parseInt(limitParam) : 6;
	const search = req.query.search?.toLowerCase() || "";
	const unlimited = limit === 0 || Boolean(search);

	const skip = (page - 1) * limit;

	if (!id_user) {
		return res.status(400).json({
			error: "ID do usuário é obrigatório",
			success: false,
		});
	}

	try {
		const baseWhere = {};

		if (search) {
			baseWhere.name = {
				contains: search,
				mode: "insensitive",
			};
		}

		const total = await prisma.exercise.count({ where: baseWhere });

		const query = {
			where: baseWhere,
			include: {
				muscle_group: {
					select: {
						name: true,
					},
				},
				user: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: { id: "desc" },
		};

		if (!unlimited) {
			query.skip = skip;
			query.take = limit;
		}

		const exercises = await prisma.exercise.findMany(query);

		return res.status(200).json({
			data: exercises,
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
		console.error("Erro ao buscar exercícios:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

const createExercise = async (req, res) => {
	const id_user = req.user.id;
	const { id_muscle_group, name, description } = req.body;

	if (!id_user) {
		return res.status(400).json({
			error: "ID do usuário é obrigatório",
			success: false,
		});
	}

	if (name.length > 100 || description.length > 500) {
		return res.status(400).json({
			message: "Quantidade de caracteres inválida",
			success: false,
		});
	}

	try {
		const exercise = await prisma.exercise.create({
			data: {
				id_user,
				id_muscle_group,
				name,
				description,
			},
		});

		return res.status(201).json({
			success: true,
			message: "Exercício criado com sucesso",
			exercise: {
				id: exercise.id,
				name: exercise.name,
			},
		});
	} catch (error) {
		console.error("Erro ao criar exercício:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

const deleteExercise = async (req, res) => {
	const exercise = req.exercise; // já validado e disponível pelo middleware

	try {
		const count = await prisma.exercise_workout.count({
			where: { id_exercise: exercise.id },
		});

		if (count > 0) {
			return res.status(400).json({
				success: false,
				message:
					"Não é possível excluir: este exercício está vinculado a um treino.",
			});
		}

		await prisma.exercise.delete({
			where: {
				id: exercise.id,
			},
		});

		return res.status(200).json({
			message: "Exercício excluído com sucesso",
			success: true,
		});
	} catch (error) {
		console.error("Erro ao excluir exercício:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

const editExercise = async (req, res) => {
	const { id_muscle_group, name, description } = req.body;
	const exercise = req.exercise; // já validado pelo middleware

	if (name.length > 100 || description.length > 500) {
		return res.status(400).json({
			message: "Quantidade de caracteres inválida",
			success: false,
		});
	}

	try {
		const updates = {};

		if (name && name !== exercise.name) {
			updates.name = name;
		}

		if (id_muscle_group && id_muscle_group !== exercise.id_muscle_group) {
			updates.id_muscle_group = id_muscle_group;
		}

		if (description && description !== exercise.description) {
			updates.description = description;
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({
				message: "Nenhuma alteração foi feita",
				success: false,
			});
		}

		await prisma.exercise.update({
			where: { id: exercise.id },
			data: updates,
		});

		return res.status(200).json({
			message: "Exercício atualizado com sucesso",
			success: true,
		});
	} catch (error) {
		console.error("Erro ao editar exercício:", error);
		return res.status(500).json({
			error: "Erro no servidor interno",
			success: false,
		});
	}
};

module.exports = {
	fetchAllExercises,
	createExercise,
	deleteExercise,
	editExercise,
};
