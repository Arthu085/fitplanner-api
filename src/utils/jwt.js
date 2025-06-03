const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: "7d", // Válido por 7 dias
	});
};

module.exports = generateToken;
