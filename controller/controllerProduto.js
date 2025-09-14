// Produtos

// Criar e atualizar produtos via modal.
// Campos obrigatórios: nome, preço, estoque, categoria.
// Regras:
//  Nome único.
//  Preço e estoque não podem ser negativos.
//  Estoque total por categoria ≤ 100.
//  Preço com máscara monetária "R$".

const { runQuery, getQuery, allQuery } = require("../database/database-helper");
const { formataNome } = require("../lib");
const arrCampos = [
    "nome",
    "descricao",
    "categoria",
    "preco",
    "estoque",
    "status",
    "imagem",
];

const createProdutos = async (req, res, next) => {
    try {
        let { nome, descricao, categoria, preco, estoque, status, imagem } =
            req.body;
        for (key in req.body) {
            if (!arrCampos.includes(key)) {
                return res.status(400).json({
                    message:
                        "Não foi possível adicionar produto pois esses campos não existem",
                });
            }
        }

        //tratando cada tipo de dado
        categoria = Number(categoria);
        preco = parseFloat(preco);
        estoque = Number(estoque);
        status = Boolean(status);

        //campos obrigatório (preco, estoque) = null para caso tenha 0
        if (!nome || preco == null || estoque == null || !categoria) {
            return res.status(400).json({
                message:
                    "Os campos (nome, preco, estoque e categoria) são obrigatórios!",
            });
        }
        //preco e estoque não podem ser valores negativos
        if (preco < 0 || estoque < 0) {
            return res.status(400).json({
                message: "O preço e o estoque não podem ser negativos!",
                status: 400,
            });
        }

        const totalEstoque = await getQuery(
            `SELECT SUM(estoque) AS totalEstoque FROM Produtos WHERE id_categoria = ?`,
            [categoria]
        );

        if (totalEstoque > 100) {
            return res
                .status(406)
                .json({ message: "Total de estoque excedido!", status: 406 });
        }
        const verificaNome = await getQuery(
            `SELECT COUNT(*) AS existeNome FROM Produtos WHERE nome = ?`,
            [nome]
        );

        if (verificaNome.existeNome) {
            return res.status(406).json({
                message: "Esse produto já foi cadastrado!",
                status: 406,
            });
        }

        //verifico se enviou um file de imagem se não recebe a img (url)
        imagem = req.file ? `/uploads/${req.file.filename}` : imagem;
        const sql = `INSERT INTO Produtos (nome, descricao, id_categoria, preco, estoque, status, imagem)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const data = await runQuery(sql, [
            nome,
            descricao,
            categoria,
            preco,
            estoque,
            status,
            imagem,
        ]);
        if (data.changes !== 0) {
            res.status(201).json({
                message: `Produto: ${nome} adicionado com sucesso!`,
                status: 201,
            });
        } else {
            res.status(400).json({
                message: "Não foi possível adicionar esse Produto!",
            });
        }
    } catch (error) {
        next(error);
        res.status(500).json({
            message: "Aconteceu um probleminha no nosso servidor =(",
        });
    }
};

const getAllProdutos = async (req, res, next) => {
    try {
        const sql = `SELECT p.id_produto, p.nome, p.descricao, c.nome AS categoria, p.preco, p.estoque, p.status, p.imagem FROM Produtos p JOIN Categorias c ON c.id_categoria = p.id_categoria `;
        const data = await allQuery(sql, []);
        if (data.length) {
            return res.status(200).json(data);
        } else {
            return res
                .status(404)
                .json({ message: "Nenhum Produto existente!", status: 404 });
        }
    } catch (error) {
        res.status(500).json({
            message: "Aconteceu um probleminha no nosso servidor =(",
        });
    }
};

module.exports = { createProdutos, getAllProdutos };
