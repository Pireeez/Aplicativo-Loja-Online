const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const { ApiError } = require('../errors/library');
const { normalizar } = require('../lib');
const { mError, mSuccess } = require('../library/message');
const sql = require('../library/sql');

const arrayColunas = ['id_categoria', 'nome', 'status'];

const createCategoria = async (req, res, next) => {
    try {
        const { nome, status } = req.body;

        for (key in req.body) {
            if (!arrayColunas.includes(key)) {
                return next(ApiError(mError.naoExisteCampo, 404));
            }
        }

        if (typeof nome !== 'string' || typeof status !== 'boolean') {
            return next(ApiError(mError.campoInvalido('nome, status'), 400)); //i18n
        }

        if (!nome) {
            return next(ApiError(mError.digiteCategoria, 400));
        }

        const verificaCategoria = await allQuery(sql.nomeExisteCategoria, []);

        const existeNome = verificaCategoria.find((item) => normalizar(item.nome) === normalizar(nome)); //to do

        if (existeNome) {
            return next(ApiError(mError.existeCategoria, 406));
        }

        const data = await runQuery(sql.insertCategoria, [nome, status]);

        if (data.changes !== 0) {
            return res.success(mSuccess.created(nome), data, 201);
        } //to do: erro
    } catch (error) {
        next(error);
    }
};

const getAllCategoria = async (req, res, next) => {
    try {
        const data = await allQuery(sql.filtraAllCategoria, []);

        if (data.length) {
            return res.success(mSuccess.created, data, 201);
        } else {
            return next(ApiError(mError.naoExisteCampo, 404));
        }
    } catch (error) {
        next(error);
    }
};

const updateCategoria = async (req, res, next) => {
    try {
        const body = req.body;
        const alteracao = [];
        const params = [];

        for (key in body) {
            if (key === 'id_categoria') {
                continue;
            }
            if (key === 'status') {
                if (typeof body[key] !== 'boolean') {
                    return next(ApiError(mError.valorStatus, 400));
                }
            }

            if (arrayColunas.includes(key)) {
                if (body[key] !== undefined && body[key] !== '' && body[key] !== null) {
                    alteracao.push(`${key} = ?`);
                    params.push(body[key]);
                } else {
                    return next(ApiError(mError.informeValor(key), 404));
                }
            } else {
                return next(ApiError(mError.campoInvalido(key), 400));
            }
        }

        params.push(body.id_categoria);

        const categoriaAtual = await getQuery(sql.statusCategoria, [body.id_categoria]); //to do

        if (Boolean(categoriaAtual.status) === body.status) {
            return next(ApiError(mError.nenhumUpdate, 400));
        } //to do

        const data = await runQuery(sql.updateCategoria(alteracao), params);

        if (data.changes === 0) {
            return next(ApiError(mError.nenhumUpdate, 400));
        }

        if (data.changes !== 0) {
            return res.success(mSuccess.updated, data, 200);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCategoria, createCategoria, updateCategoria };
