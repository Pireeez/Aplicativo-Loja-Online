const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const { ApiError } = require('../errors/library');
const { mError, mSuccess } = require('../library/message');
const sql = require('../library/sql');

const addCarrinho = async (req, res, next) => {
    try {
        const { id_produto, quantidade, valor } = req.body;
        //vai entrar com produto e a quantidade
        //pegar o valor total referente aquele pedido

        const verificaProduto = await getQuery(sql.existeProdutoCarrinho, [id_produto]);

        if (verificaProduto.existeProduto !== 0) {
            return next(ApiError('Produto já adicionado ao carrinho!', 400));
        }
        const data = await runQuery(
            `
            INSERT INTO Carrinho (id_produto, quantidade, valor_unitario)
            VALUES (?, ?, ?);`,
            [id_produto, quantidade, valor]
        );

        res.success(mSuccess.custom('Produto adicionado ao carrinho!'), data, 200);
    } catch (error) {
        next(error);
    }
};

const exibeCarrinho = async (req, res, next) => {
    try {
        const data = await allQuery(`
            SELECT
            p.id_produto,
            p.nome,
            p.descricao,
            c.quantidade,
            p.estoque,
            SUM(p.preco * c.quantidade) AS totalProduto,
            p.imagem,
            c.data_adicao
            FROM Carrinho c
            JOIN Produtos p ON p.id_produto = c.id_produto
            GROUP BY p.id_produto
            `);

        return res.success('', data, 200);
    } catch (error) {
        next(error);
    }
};

const updateQuantidadeCarrinho = async (req, res, next) => {
    try {
        const { id_produto, quantidade } = req.body;

        //verificar a quantidade existente no estoque

        const data = await getQuery(
            `
            UPDATE Carrinho
            SET quantidade = ?
            WHERE id_produto = ?
            `,
            [quantidade, id_produto]
        );

        res.success(mSuccess.updated, data, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = { addCarrinho, exibeCarrinho, updateQuantidadeCarrinho };
