require('dotenv').config();

const express = require('express');
const app = express();

const categoriaRoutes = require('./routes/categoria');
const produtoRoutes = require('./routes/produto');
const pedidoRoutes = require('./routes/pedido');
const carrinhoRoute = require('./routes/carrinho');

app.use(express.json());
app.use(express.static('static'));
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    res.success = (message, data = null, status = 200) => {
        return res.status(status).json({
            status,
            message,
            data,
        });
    };
    next();
});

// Montar as rotas de tarefas sob o prefixo /tarefas
app.use('/categoria', categoriaRoutes);
app.use('/produto', produtoRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/carrinho', carrinhoRoute);
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Define um status de erro padrão
    const status = err.statusCode || 500;
    const message = err.message || 'Erro Interno do Servidor';

    res.status(status).json({
        status,
        message,
    });
});

// (Adicionaremos o middleware de erro aqui no próximo módulo)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `Servidor rodando na porta http://localhost:${port}/backoffice.html ou http://localhost:${port}/store.html`
    );
});
