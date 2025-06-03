const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;
const apiRoute = "/api";

app.use(cors());
app.use(express.json());

app.use(apiRoute + "/auth", require("./src/routes/authRoutes"));

app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
