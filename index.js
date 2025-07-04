const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
const apiRoute = "/api";

// Verifica se está em ambiente de produção
const isProduction = process.env.NODE_ENV === "production";

// Define o origin de forma condicional
const corsOptions = {
	origin: isProduction
		? "https://seu-front.vercel.app"
		: "http://localhost:5173",
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Rotas
app.use(apiRoute + "/auth", require("./src/routes/authRoutes"));
app.use(apiRoute + "/training", require("./src/routes/trainingRoutes"));
app.use(
	apiRoute + "/training/session",
	require("./src/routes/trainingSessionRoutes")
);
app.use(apiRoute + "/exercise", require("./src/routes/exerciseRoutes"));

// Inicia o servidor
app.listen(PORT, HOST, () => {
	console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
