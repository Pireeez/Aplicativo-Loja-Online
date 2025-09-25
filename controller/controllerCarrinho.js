const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const { ApiError } = require('../errors/library');
const { mError, mSuccess } = require('../library/message');
const sql = require('../library/sql');

const addCarrinho = async (req, res, next) => {
    try {
        const { id_produto, quantidade, valor } = req.body;

        const qtdEstoque = await getQuery(`SELECT estoque AS estoqueProduto FROM Produtos WHERE id_produto = ?`, [
            id_produto,
        ]);

        if (quantidade > qtdEstoque.estoqueProduto) {
            return next(ApiError('A quantidade ultrapassou o limite do estoque', 400));
        }

        const verificaProduto = await getQuery(sql.existeProdutoCarrinho, [id_produto]);

        //upsert
        if (verificaProduto.existeProduto !== 0) {
            const data = await runQuery(
                `
                UPDATE Carrinho
                SET quantidade = ?, valor_unitario = ?
                WHERE id_produto = ?
                `,
                [quantidade, valor, id_produto]
            );
            if (data.changes !== 0) {
                return res.success(mSuccess.custom('Produto adicionado ao carrinho!'), data, 200);
            }
        }

        const data = await runQuery(
            `
            INSERT INTO Carrinho (id_produto, quantidade, valor_unitario)
            VALUES (?, ?, ?);`,
            [id_produto, quantidade, valor]
        );

        if (data.changes !== 0) {
            return res.success(mSuccess.custom('Produto adicionado ao carrinho!'), data, 200);
        }
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

        return res.success(mSuccess.updated, data, 200);
    } catch (error) {
        next(error);
    }
};

const deleteProdutoCarrinho = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await runQuery(`DELETE FROM Carrinho WHERE id_produto = ?`, [id]);

        if (data.changes !== 0) {
            return res.success(mSuccess.custom('Produto deletado do carrinho!'), data, 200);
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { addCarrinho, exibeCarrinho, updateQuantidadeCarrinho, deleteProdutoCarrinho };
