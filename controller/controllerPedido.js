// Pedidos

// Listagem de pedidos realizados pelos usuários da loja.
// Filtros por data e valor total.
// Modal para visualizar itens de cada pedido.

const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const { ApiError } = require('../errors/library');
const { mError, mSuccess } = require('../library/message');
const sql = require('../library/sql');

const createPedidos = async (req, res, next) => {
    try {
        const itensCarrinho = await allQuery(`
            SELECT c.id_produto, c.quantidade, c.valor_unitario
            FROM Carrinho c
        `);

        //Calcular valor total
        const valorTotal = itensCarrinho.reduce((acc, item) => {
            return acc + item.quantidade * item.valor_unitario;
        }, 0);

        //Criar pedido
        const pedido = await runQuery(
            `
            INSERT INTO Pedidos (data, valor_total)
            VALUES (DATETIME('now'), ?)
            `,
            [valorTotal]
        );

        //pega lastID do pedido criado
        const id_pedido = pedido.lastID;

        //Inserir itens do pedido
        for (const item of itensCarrinho) {
            await runQuery(
                `
                INSERT INTO Itens_Pedidos (id_pedido, id_produto, quantidade, valor_unitario)
                VALUES (?, ?, ?, ?)
                `,
                [id_pedido, item.id_produto, item.quantidade, item.valor_unitario]
            );
        }

        //Limpar carrinho
        await runQuery(`DELETE FROM Carrinho`);

        res.success(mSuccess.custom('Pedido criado com sucesso!'), { id_pedido, valorTotal }, 201);
    } catch (error) {
        next(error);
    }
};

const getAllPedidos = async (req, res, next) => {
    try {
        const data = await allQuery(`
            SELECT
            p.id_pedido,
            p.data,
            SUM(i.quantidade) AS totalItens,
            SUM(i.valor_unitario * i.quantidade) AS valorTotal
            FROM Pedidos p
            LEFT JOIN Itens_Pedidos i ON i.id_pedido = p.id_pedido
            GROUP BY p.id_pedido
            `);

        res.success('', data, 200);
    } catch (error) {
        next(error);
    }
};

const detailsPedidos = async (req, res, next) => {
    try {
        const id_pedido = req.params.id;

        if (!id_pedido) {
            return next(ApiError('Informe o ID do pedido!'), 400);
        }

        const data = await allQuery(
            `
        WITH valorTotal AS 
            (
                SELECT
                    i.id_pedido,
                    pd.nome, 
                    SUM(i.quantidade) AS quantidade_total,
                    i.valor_unitario,
                    SUM(i.valor_unitario * i.quantidade) AS valor_total
                FROM Itens_Pedidos i
                JOIN Produtos pd ON pd.id_produto = i.id_produto 
                GROUP BY i.id_pedido, pd.nome, i.valor_unitario
            )
        SELECT
            pd.nome,
            p.data,
            vt.quantidade_total AS quantidade,
            vt.valor_unitario AS preco_unitario,
            vt.valor_total AS subtotal
        FROM Pedidos p
        JOIN valorTotal vt ON vt.id_pedido = p.id_pedido
        JOIN Produtos pd ON pd.nome = vt.nome
        WHERE p.id_pedido = ?
        ORDER BY vt.valor_total DESC;
            `,
            [id_pedido]
        );

        return res.success('teste', data, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = { createPedidos, getAllPedidos, detailsPedidos };
