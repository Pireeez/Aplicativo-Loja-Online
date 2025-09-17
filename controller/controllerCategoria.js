const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const { ApiError } = require('../errors/library');

const arrayColunas = ['id_categoria', 'nome', 'status'];

const createCategoria = async (req, res, next) => {
    try {
        const { nome, status } = req.body;

        for (key in req.body) {
            if (!arrayColunas.includes(key)) {
                return next(ApiError('Não existe esse campo na nossa tabela!', 404));
            }
        }

        if (typeof nome !== 'string' || typeof status !== 'boolean') {
            return next(ApiError('Os tipos dos campos estão inválidos!', 400)); //i18n
        }

        if (!nome) {
            return next(ApiError('Digite um nome para a categoria!', 400));
        }

        const verificaCategoria = await getQuery(`SELECT COUNT(*)AS nome FROM Categorias WHERE nome = ?`, nome);

        if (verificaCategoria.nome !== 0) {
            return next(ApiError('O nome dessa categoria já existe!', 406));
        }

        const sql = `INSERT INTO Categorias (nome, status) VALUES (?,?)`;
        const data = await runQuery(sql, [nome, status]);

        if (data.changes !== 0) {
            return res.status(201).json({
                message: `Categoria ${nome} criada com suceso!`,
                status: 201,
            });
        }
    } catch (error) {
        next(error);
    }
};

const getAllCategoria = async (req, res, next) => {
    try {
        const sql = 'SELECT id_categoria, nome, status FROM Categorias';
        const data = await allQuery(sql, []);

        if (data.length) {
            return res.status(200).json(data);
        } else {
            return next(ApiError('Nenhuma Categoria existente!', 404));
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
                    return next(ApiError(`O valor do status tem que ser Visível ou Invisível`, 400));
                }
            }
            if (key === 'id_categoria') continue;
            if (arrayColunas.includes(key)) {
                if (body[key] !== undefined || body[key] !== '' || body[key] !== null) {
                    alteracao.push(`${key} = ?`);
                    params.push(body[key]);
                } else {
                    return next(ApiError(`Informe o valor do ${key}!`, 404));
                }
            } else {
                return next(ApiError(`O campo ${key} não existe em nosso sistema`, 400));
            }
        }

        params.push(body.id_categoria);

        const categoriaAtual = await getQuery('SELECT status FROM Categorias WHERE id_categoria = ?', [
            body.id_categoria,
        ]);

        if (Boolean(categoriaAtual.status) === body.status) {
            return next(ApiError('Nenhuma atualização foi realizada na categoria!', 400));
        }

        const data = await runQuery(`UPDATE Categorias SET ${alteracao} WHERE id_categoria = ?`, params);

        console.log(data);
        if (data.changes === 0) {
            return next(ApiError('Nenhuma atualização foi realizada na categoria!', 400));
        }

        if (data.changes !== 0) {
            return res.status(200).json({
                message: `Categoria atualizado com sucesso!`,
                status: 200,
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCategoria, createCategoria, updateCategoria };
