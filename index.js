require("dotenv").config();
const express = require("express");
const app = express();
const categoriaRoutes = require("./routes/categoria");
app.use(express.json());
app.use(express.static("static"));

// Montar as rotas de tarefas sob o prefixo /tarefas
app.use("/categoria", categoriaRoutes);

// (Adicionaremos o middleware de erro aqui no próximo módulo)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
