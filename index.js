const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors()); // permite requisições do frontend
app.use(express.json()); // permite JSON no body

app.get("/", (req, res) => {
	res.send("API está funcionando");
});

app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
