require("dotenv").config();
const express = require("express");
const app = express();
const categoriaRoutes = require("./routes/categoria");
const produtoRoutes = require("./routes/produto");
const pedidoRoutes = require("./routes/pedido");

app.use(express.json());
app.use(express.static("static"));
app.use("/uploads", express.static("uploads"));

// Montar as rotas de tarefas sob o prefixo /tarefas
app.use("/categoria", categoriaRoutes);
app.use("/produto", produtoRoutes);
app.use("/pedido", pedidoRoutes);

// (Adicionaremos o middleware de erro aqui no próximo módulo)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});
