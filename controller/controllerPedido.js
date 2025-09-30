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
        const itensCarrinho = await allQuery(sql.itensCarrinho);

        if (!itensCarrinho) {
            return next(ApiError(mError.carrinhoVazio, 404));
        }

        const valorTotal = itensCarrinho.reduce((acc, item) => {
            return acc + item.quantidade * item.valor_unitario;
        }, 0);

        const pedido = await runQuery(sql.insertPedidos, [valorTotal]);

        if (pedido.changes === 0) {
            return next(ApiError(mError.falhaPedido, 400));
        }

        const id_pedido = pedido.lastID;
        for (const item of itensCarrinho) {
            await runQuery(sql.insertItensPedidos, [id_pedido, item.id_produto, item.quantidade, item.valor_unitario]);

            await runQuery(sql.subtraiEstoqueExistente, [item.quantidade, item.id_produto]);
        }

        await runQuery(sql.limpaCarrinho);

        res.success(mSuccess.created('Pedido'), { id_pedido, valorTotal }, 201);
    } catch (error) {
        next(error);
    }
};

const getAllPedidos = async (req, res, next) => {
    try {
        const filter = req.query;

        if (filter) {
            let { dataInicial, dataFinal, valorMin, valorMax } = filter;
            const params = [];
            const filtroData = [];
            const filtroValor = [];

            for (key in filter) {
                if (filter[key] !== undefined && filter[key] !== null && filter[key] !== '') {
                    if (key === 'dataInicial') {
                        filtroData[0] = 'WHERE p.data >= ?';
                        params.push(`${filter[key]} 00:00:00`);
                    }

                    if (key === 'dataFinal') {
                        filtroData[0] = 'WHERE p.data <= ?';
                        params.push(`${filter[key]} 23:59:59`);
                    }
                    if (key === 'valorMin') {
                        filtroValor[0] = 'HAVING SUM(i.valor_unitario * i.quantidade) >= ?';
                        let valueMin = parseFloat(filter[key]);
                        params.push(valueMin);
                    }

                    if (key === 'valorMax') {
                        filtroValor[0] = 'HAVING SUM(i.valor_unitario * i.quantidade) <= ?';
                        let valueMax = parseFloat(filter[key]);
                        params.push(valueMax);
                    }
                }
            }

            if (filter.dataInicial && filter.dataFinal) {
                filtroData[0] = 'WHERE p.data >= ? AND p.data <= ?';
            }
            if (filter.valorMin && filter.valorMax) {
                filtroValor[0] = 'HAVING SUM(i.valor_unitario * i.quantidade) BETWEEN ? AND ?';
            }

            const FilterPedido = await allQuery(
                `
                SELECT
                p.id_pedido,
                p.data,
                SUM(i.quantidade) AS totalItens,
                SUM(i.valor_unitario * i.quantidade) AS valorTotal
                FROM Pedidos p
                LEFT JOIN Itens_Pedidos i ON i.id_pedido = p.id_pedido
                ${filtroData}
                GROUP BY p.id_pedido
                ${filtroValor}
                `,
                params
            );

            res.success('', FilterPedido, 200);

            return;
        }

        const dataInfoPedido = await allQuery(sql.infoPedidos);

        if (!dataInfoPedido) {
            return next(ApiError(mError.nenhumPedidoRealizado, 404));
        } else {
            res.success('', dataInfoPedido, 200);
        }
    } catch (error) {
        next(error);
    }
};

const detailsPedidos = async (req, res, next) => {
    try {
        const id_pedido = req.params.id;

        if (!id_pedido) {
            return next(ApiError(mError.informeIdPedido), 400);
        }

        const data = await allQuery(sql.detailsPedidos, [id_pedido]);

        return res.success('', data, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = { createPedidos, getAllPedidos, detailsPedidos };
