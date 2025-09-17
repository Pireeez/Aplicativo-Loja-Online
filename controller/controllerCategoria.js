const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const { ApiError } = require('../errors/library');
const { mcError, mSuccess } = require('../library/message');

const arrayColunas = ['id_categoria', 'nome', 'status'];

const createCategoria = async (req, res, next) => {
    try {
        const { nome, status } = req.body;

        for (key in req.body) {
            if (!arrayColunas.includes(key)) {
                return next(ApiError(mcError.naoExisteCampo, 404));
            }
        }

        if (typeof nome !== 'string' || typeof status !== 'boolean') {
            return next(ApiError(mcError.campoInvalido('nome, status'), 400)); //i18n
        }

        if (!nome) {
            return next(ApiError(mcError.digiteCategoria, 400));
        }

        const verificaCategoria = await getQuery(`SELECT COUNT(*)AS nome FROM Categorias WHERE nome = ?`, nome);

        if (verificaCategoria.nome !== 0) {
            return next(ApiError(mcError.existeCategoria, 406));
        }

        const sql = `INSERT INTO Categorias (nome, status) VALUES (?,?)`;
        const data = await runQuery(sql, [nome, status]);

        if (data.changes !== 0) {
            return res.success(mSuccess.created(nome), data, 201);
        }
    } catch (error) {
        next(error);
    }
};

const getAllCategoria = async (req, res, next) => {
    try {
        const data = await allQuery('SELECT id_categoria, nome, status FROM Categorias', []);

        if (data.length) {
            return res.success(mSuccess.created, data, 201);
        } else {
            return next(ApiError(mcError.naoExisteCampo, 404));
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

        console.log(body);

        for (key in body) {
            if (key === 'status') {
                if (typeof body[key] !== 'boolean') {
                    return next(ApiError(mcError.valorStatus, 400));
                }
            }
            if (key === 'id_categoria') continue;
            if (arrayColunas.includes(key)) {
                if (body[key] !== undefined || body[key] !== '' || body[key] !== null) {
                    alteracao.push(`${key} = ?`);
                    params.push(body[key]);
                } else {
                    return next(ApiError(mcError.informeValor(key), 404));
                }
            } else {
                return next(ApiError(mcError.campoInvalido(key), 400));
            }
        }

        params.push(body.id_categoria);

        const categoriaAtual = await getQuery('SELECT status FROM Categorias WHERE id_categoria = ?', [
            body.id_categoria,
        ]);

        if (Boolean(categoriaAtual.status) === body.status) {
            return next(ApiError(mcError.nenhumUpdate, 400));
        }

        const data = await runQuery(`UPDATE Categorias SET ${alteracao} WHERE id_categoria = ?`, params);

        if (data.changes === 0) {
            return next(ApiError(mcError.nenhumUpdate, 400));
        }

        if (data.changes !== 0) {
            return res.success(mSuccess.updated(body.nome), data, 200);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCategoria, createCategoria, updateCategoria };
