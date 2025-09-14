const { runQuery, getQuery, allQuery } = require("../database/database-helper");
const arrayColunas = ["nome", "status"];

const createCategoria = async (req, res, next) => {
    try {
        const { nome, status } = req.body;
        const nome_normalizado = normalizar(nome);

        if (!nome) {
            return res.status(400).json({
                message: "Digite um nome para a categoria!",
                status: 400,
            });
        }
        const sql = `INSERT INTO Categorias (nome, nome_normalizado, status) VALUES (?,?,?)`;
        const data = await runQuery(sql, [nome, nome_normalizado, status]);
        if (data.code === "SQLITE_CONSTRAINT") {
            return res.status(406).json({
                message: "O nome dessa categoria já existe!",
                status: 406,
            });
        }
        if (data.changes !== 0) {
            return res.status(201).json({
                message: `✅ Categoria ${nome} criada com suceso!`,
                status: 201,
            });
        }
    } catch (error) {
        next(error);
        res.status(500).json({
            message: "Aconteceu um probleminha no nosso servidor =(",
        });
    }
};

const getAllCategoria = async (req, res, next) => {
    try {
        const sql = "SELECT id_categoria, nome, status FROM Categorias";
        const data = await allQuery(sql, []);

        if (data.length) {
            return res.status(200).json(data);
        } else {
            return res
                .status(404)
                .json({ message: "Nenhuma Categoria existente!", status: 404 });
        }
    } catch (error) {
        next(error);
        res.status(500).json({
            message: "Aconteceu um probleminha no nosso servidor :(!",
        });
    }
};

const updateCategoria = async (req, res, next) => {
    try {
        const body = req.body;
        const alteracao = [];
        const params = [];

        for (key in body) {
            if (arrayColunas.includes(key)) {
                if (
                    body[key] !== undefined ||
                    body[key] !== "" ||
                    body[key] !== null
                ) {
                    alteracao.push(`${key} = ?`);
                    params.push(body[key]);
                } else {
                    return res.status(404).json({
                        message: `Não existe a categoria: ${body[key]} em nosso sistema!`,
                        status: 404,
                    });
                }
            }
        }

        const categoriaAtual = await getQuery(
            "SELECT status FROM Categorias WHERE id_categoria = ?",
            [body.id_categoria]
        );

        if (Boolean(categoriaAtual.status) === body.status) {
            return res.status(400).json({
                message: "Nenhuma atualização foi realizada na categoria!",
                status: 400,
            });
        }
        const nome_normalizado = normalizar(body.nome);
        alteracao.push(`nome_normalizado = ?`);
        params.push(nome_normalizado, body.id_categoria);

        const sql = `UPDATE Categorias SET ${alteracao} WHERE id_categoria = ?`;
        const data = await runQuery(sql, params);
        if (data.code === "SQLITE_CONSTRAINT") {
            return res.status(406).json({
                message: "O nome da categoria já existe!",
                status: 406,
            });
        }

        if (data.changes === 0) {
            return res.status(400).json({
                message: "Nenhuma atualização foi realizada na categoria!",
                status: 400,
            });
        }

        if (data.changes !== 0) {
            return res.status(200).json({
                message: `✅ Categoria atualizado com sucesso!`,
                status: 200,
            });
        }
    } catch (error) {
        next(error);

        res.status(500).json({
            message: "Aconteceu um probleminha no nosso servidor :(!",
        });
    }
};

const normalizar = (categoria) => {
    return categoria
        .toLowerCase()
        .normalize("NFD") // separa acentos
        .replace(/[\u0300-\u036f]/g, ""); // remove acentos
};

module.exports = { getAllCategoria, createCategoria, updateCategoria };
