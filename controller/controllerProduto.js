// Produtos

// Criar e atualizar produtos via modal.
// Campos obrigatórios: nome, preço, estoque, categoria.
// Regras:
//  Nome único.
//  Preço e estoque não podem ser negativos.
//  Estoque total por categoria ≤ 100.
//  Preço com máscara monetária "R$".

const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const arrCampos = ['nome', 'descricao', 'categoria', 'preco', 'estoque', 'status', 'imagem'];
const arrCamposUpdate = ['id_produto', 'nome', 'descricao', 'categoria', 'preco', 'estoque', 'status', 'imagem'];

const createProdutos = async (req, res, next) => {
    try {
        let { nome, descricao, categoria, preco, estoque, status, imagem } = req.body;
        for (key in req.body) {
            if (!arrCampos.includes(key)) {
                return res.status(400).json({
                    message: 'Não foi possível adicionar produto pois esses campos não existem',
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
                message: 'Os campos (nome, preco, estoque e categoria) são obrigatórios!',
            });
        }
        //preco e estoque não podem ser valores negativos
        if (preco < 0 || estoque < 0) {
            return res.status(400).json({
                message: 'O preço e o estoque não podem ser negativos!',
                status: 400,
            });
        }

        const dataCategoria = await getQuery(
            `SELECT SUM(estoque) AS totalEstoque FROM Produtos WHERE id_categoria = ?`,
            [categoria]
        );

        if (dataCategoria.totalEstoque > 100) {
            return res.status(406).json({ message: 'Total de estoque excedido!', status: 406 });
        }
        const verificaNome = await getQuery(`SELECT COUNT(*) AS existeNome FROM Produtos WHERE nome = ?`, [nome]);

        if (verificaNome.existeNome) {
            return res.status(406).json({
                message: 'Esse produto já foi cadastrado!',
                status: 406,
            });
        }

        //verifico se enviou um file de imagem se não recebe a img (url)
        imagem = req.file ? `/uploads/${req.file.filename}` : imagem;
        const sql = `INSERT INTO Produtos (nome, descricao, id_categoria, preco, estoque, status, imagem)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const data = await runQuery(sql, [nome, descricao, categoria, preco, estoque, status, imagem]);
        if (data.changes !== 0) {
            res.status(201).json({
                message: `Produto: ${nome} adicionado com sucesso!`,
                status: 201,
            });
        } else {
            res.status(400).json({
                message: 'Não foi possível adicionar esse Produto!',
            });
        }
    } catch (error) {
        next(error);
        res.status(500).json({
            message: 'Aconteceu um probleminha no nosso servidor =(',
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
            return res.status(404).json({ message: 'Nenhum Produto existente!', status: 404 });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Aconteceu um probleminha no nosso servidor =(',
        });
    }
};

const updateProdutos = async (req, res, next) => {
    try {
        const bodyUpdate = req.body;
        const alteracao = [];
        const params = [];
        const campos = [];
        if (bodyUpdate.estoque > 100) {
            return res.status(406).json({ message: 'Quantidade máxima de estoque é 100!', status: 406 });
        }

        if (!bodyUpdate.id_produto) {
            return res.status(406).json({ message: 'É necessário informar o ID!', status: 400 });
        }

        if (typeof bodyUpdate.id_produto !== 'number') {
            return res.status(406).json({ message: 'O ID tem que ser númerico', status: 400 });
        }
        for (key in bodyUpdate) {
            if (key === 'id_produto') continue;
            if (arrCamposUpdate.includes(key)) {
                if (bodyUpdate[key] !== undefined || bodyUpdate[key] !== '' || bodyUpdate[key] !== null) {
                    alteracao.push(`${key} = ?`);
                    campos.push(key);
                    params.push(bodyUpdate[key]);
                }
            }
        }
        params.push(bodyUpdate.id_produto);
        if (alteracao.length === 0 || params.length === 0) {
            return res.status(400).json({ message: `Nenhuma alteração realizada!`, status: 400 });
        }

        const sql = `UPDATE Produtos SET ${alteracao} WHERE id_produto = ?`;
        const data = await runQuery(sql, params);
        if (data.changes !== 0) {
            return res.status(200).json({ message: `Campos: ${campos.join(', ')} alterado com sucesso!`, status: 200 });
        }
        console.log(data);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { createProdutos, getAllProdutos, updateProdutos };
