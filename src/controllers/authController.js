const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const generateToken = require("../utils/jwt");

const prisma = new PrismaClient();

const register = async (req, res) => {
	const { name, email, password } = req.body;

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		return res
			.status(400)
			.json({ message: "Usuário já existe", success: false });
	}

	if (name.length > 50 || email.length > 100 || password.length > 70) {
		return res.status(400).json({
			message: "Quantidade de caracteres inválida",
			success: false,
		});
	}

	if (!name || name.trim().length < 3) {
		return res.status(400).json({
			message: "Nome deve ter no mínimo 3 caracteres",
			success: false,
		});
	}

	if (!password || password.length < 6) {
		return res.status(400).json({
			message: "Senha deve ter no mínimo 6 caracteres",
			success: false,
		});
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({ message: "Email inválido", success: false });
	}

	const hashed = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hashed,
		},
	});

	res.status(201).json({
		id: user.id,
		name: user.name,
		email: user.email,
		token: generateToken(user.id),
		success: true,
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		return res
			.status(400)
			.json({ message: "Credenciais inválidas", success: false });
	}

	const valid = await bcrypt.compare(password, user.password);
	if (!valid)
		return res
			.status(401)
			.json({ message: "Credenciais inválidas", success: false });

	res.json({
		id: user.id,
		name: user.name,
		email: user.email,
		token: generateToken(user.id),
		success: true,
	});
};

module.exports = { register, login };
