const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("API está funcionando");
});

app.get("/test-connection", async (req, res) => {
	try {
		res.json({ success: true, message: "Conexão com banco funcionando" });
	} catch (error) {
		console.error("Erro na conexão com o banco:", error);
		res
			.status(500)
			.json({ success: false, message: "Erro na conexão com o banco" });
	}
});

app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
