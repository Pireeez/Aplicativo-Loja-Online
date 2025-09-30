const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const { ApiError } = require('../errors/library');
const { mError, mSuccess } = require('../library/message');
const sql = require('../library/sql');

const addCarrinho = async (req, res, next) => {
    try {
        const { id_produto, quantidade, valor } = req.body;

        for (key in req.body) {
            if (typeof req.body[key] === 'string') {
                return next(ApiError(mError.campoNumerico));
            }
        }

        const qtdEstoque = await getQuery(sql.qtdEstoqueProduto, [id_produto]);

        if (quantidade > qtdEstoque.estoqueProduto) {
            return next(ApiError(mError.qtdEstoqueMax, 400));
        }

        const dataUpsertCarrinho = await runQuery(sql.upsertCarrinho, [id_produto, quantidade, valor]);

        if (dataUpsertCarrinho.changes !== 0) {
            res.success(mSuccess.custom('Produto adicionado com sucesso!'), dataUpsertCarrinho, 200);
        } else {
            next(ApiError(mError.falhaAddProduto, 400));
        }
    } catch (error) {
        next(error);
    }
};

const exibeCarrinho = async (req, res, next) => {
    try {
        const dataProdutoCarrinho = await allQuery(sql.dadosProdutoCarrinho);

        return res.success('', dataProdutoCarrinho, 200);
    } catch (error) {
        next(error);
    }
};

const updateQuantidadeCarrinho = async (req, res, next) => {
    try {
        const { id_produto, quantidade } = req.body;

        if (!id_produto) {
            return next(ApiError(mError.informeIdProduto, 400));
        }

        const dataUpdateQuantidadeCarrinho = await getQuery(sql.dataUpdateQuantidadeCarrinho, [quantidade, id_produto]);

        return res.success(mSuccess.updated, dataUpdateQuantidadeCarrinho, 200);
    } catch (error) {
        next(error);
    }
};

const deleteProdutoCarrinho = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(ApiError(sql.informeIdProduto, 400));
        }

        const dataDeleteProdutoCarrinho = await runQuery(sql.deleteProdutoCarrinho, [id]);

        if (dataDeleteProdutoCarrinho.changes !== 0) {
            return res.success(mSuccess.deleted('Produto'), dataDeleteProdutoCarrinho, 200);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { addCarrinho, exibeCarrinho, updateQuantidadeCarrinho, deleteProdutoCarrinho };
