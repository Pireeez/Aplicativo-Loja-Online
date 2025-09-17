// Produtos

// Criar e atualizar produtos via modal.
// Campos obrigatórios: nome, preço, estoque, categoria.
// Regras:
//  Nome único.
//  Preço e estoque não podem ser negativos.
//  Estoque total por categoria ≤ 100.
//  Preço com máscara monetária "R$".

const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const { ApiError } = require('../errors/library');
const { mcError, mSuccess } = require('../library/message');
const arrCampos = ['nome', 'descricao', 'categoria', 'preco', 'estoque', 'status', 'imagem'];
const arrCamposUpdate = ['id_produto', 'nome', 'descricao', 'categoria', 'preco', 'estoque', 'status', 'imagem'];

const createProdutos = async (req, res, next) => {
    try {
        let { nome, descricao, categoria, preco, estoque, status, imagem } = req.body;

        for (key in req.body) {
            if (!arrCampos.includes(key)) {
                return next(ApiError(mcError.naoExisteCampo, 400));
            }
        }

        //tratando cada tipo de dado
        categoria = Number(categoria);
        preco = parseFloat(preco);
        estoque = Number(estoque);
        status = Boolean(status);

        //campos obrigatório (preco, estoque) = null para caso tenha 0
        if (!nome || preco == null || estoque == null || !categoria) {
            return next(ApiError(mcError.campoObrigatorio, 400));
        }

        if (estoque > 100) {
            return next(ApiError(mcError, 400));
        }

        const qtdEstoque = await getQuery(`SELECT SUM(estoque) AS totalEstoque FROM Produtos WHERE id_categoria = ?`, [
            categoria,
        ]);

        const totalEstoque = qtdEstoque.totalEstoque + estoque;
        if (totalEstoque > 100) {
            const restante = 100 - qtdEstoque.totalEstoque;
            return next(ApiError(mcError.estoqueRestante(restante), 406));
        }

        //preco e estoque não podem ser valores negativos
        if (preco < 0 || estoque < 0) {
            return next(ApiError(mcError.valoresNegativos, 400));
        }

        //preco maior que 100
        if (estoque > 100) {
            return next(ApiError(mcError.limiteEstoque, 400));
        }

        if (qtdEstoque.totalEstoque > 100) {
            return next(ApiError(mcError.estoqueExcedido, 406));
        }

        //trativa antes de iserir
        const verificaNome = await getQuery(`SELECT COUNT(*) AS existeNome FROM Produtos WHERE nome = ?`, [nome]);

        if (verificaNome.existeNome) {
            return next(ApiError(mcError.existeProduto, 406));
        }

        //verifico se enviou um file de imagem se não recebe a img (url)
        imagem = req.file ? `/uploads/${req.file.filename}` : imagem;
        const sql = `INSERT INTO Produtos (nome, descricao, id_categoria, preco, estoque, status, imagem)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const data = await runQuery(sql, [nome, descricao, categoria, preco, estoque, status, imagem]);

        if (data.changes !== 0) {
            res.success(mSuccess.created(nome), data, 201);
        } else {
            next(ApiError(mcError.falhaAddProduto, 400));
        }
    } catch (error) {
        next(error);
    }
};

const getAllProdutos = async (req, res, next) => {
    try {
        const data = await allQuery(
            `SELECT p.id_produto, p.nome, p.descricao, c.nome AS categoria, p.preco, p.estoque, p.status, p.imagem FROM Produtos p JOIN Categorias c ON c.id_categoria = p.id_categoria `,
            []
        );

        if (data.length) {
            return res.success('', data, 200);
        } else {
            return next(ApiError(mcError.naoExiste, 404));
        }
    } catch (error) {
        next(error);
    }
};

const updateProdutos = async (req, res, next) => {
    try {
        const bodyUpdate = req.body;
        const alteracao = [];
        const params = [];
        const campos = [];

        if (bodyUpdate.estoque > 100) {
            return next(ApiError('Quantidade máxima de estoque é 100!', 406));
        }

        for (key in bodyUpdate) {
            if (key === 'id_produto') continue;
            if (arrCamposUpdate.includes(key)) {
                if (bodyUpdate[key] !== undefined || bodyUpdate[key] !== '' || bodyUpdate[key] !== null) {
                    alteracao.push(`${key} = ?`);
                    params.push(bodyUpdate[key]);
                    campos.push(key);
                }
            }
        }

        params.push(bodyUpdate.id_produto);

        if (alteracao.length === 0 || params.length === 0) {
            return next(ApiError('Nenhuma alteração realizada!', 400));
        }

        const sql = `UPDATE Produtos SET ${alteracao} WHERE id_produto = ?`;
        const data = await runQuery(sql, params);

        if (data.changes !== 0) {
            res.status(200).json({ message: `Campos: "${campos.join(', ')}" alterado com sucesso!`, status: 200 });
        } else {
            next(ApiError('Nenhuma alteração realizada!', 400));
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { createProdutos, getAllProdutos, updateProdutos };
