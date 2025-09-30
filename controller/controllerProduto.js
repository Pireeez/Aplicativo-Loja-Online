// Produtos

// Criar e atualizar produtos via modal.
// Campos obrigatórios: nome, preço, estoque, categoria.
// Regras:
//  Nome único.
//  Preço e estoque não podem ser negativos.
//  Estoque total por categoria ≤ 100.
//  Preço com máscara monetária "R$".

//fazer validação pela versão com procedure
//procedure criar uma nova rota de produtos
//fazer validação da quantidade, considerando os dados do banco do front

const { runQuery, getQuery, allQuery } = require('../database/database-helper');
const { ApiError } = require('../errors/library');
const { mError, mSuccess } = require('../library/message');
const sql = require('../library/sql');
const arrCampos = ['nome', 'descricao', 'categoria', 'preco', 'estoque', 'status', 'imagem'];
const arrCamposUpdate = ['id_produto', 'nome', 'descricao', 'id_categoria', 'preco', 'estoque', 'status', 'imagem'];

const createProdutos = async (req, res, next) => {
    try {
        let { nome, descricao, categoria, preco, estoque, status, imagem } = req.body;

        for (key in req.body) {
            if (!arrCampos.includes(key)) {
                return next(ApiError(mError.naoExisteCampo, 400));
            }
        }

        categoria = Number(categoria);
        preco = parseFloat(preco);
        estoque = Number(estoque);
        status = status === 'false' ? false : true;

        if (estoque > 100) {
            return next(ApiError(mError.limiteEstoque, 400));
        }

        const qtdEstoque = await getQuery(sql.sumEstoqueProduto, [categoria]);
        if (qtdEstoque.totalEstoque > 100) {
            return next(ApiError(mError.estoqueExcedido, 406));
        }

        const totalEstoque = qtdEstoque.totalEstoque + estoque;
        if (totalEstoque > 100) {
            const restante = 100 - qtdEstoque.totalEstoque;
            return next(ApiError(mError.estoqueRestante(restante), 406));
        }

        if (!nome || preco == null || estoque == null || !categoria) {
            return next(ApiError(mError.campoObrigatorio, 400));
        }

        if (preco < 0 || estoque < 0) {
            return next(ApiError(mError.valoresNegativos, 400));
        }

        const verificaNome = await getQuery(sql.existeNomeProduto, [nome]);

        if (verificaNome.existeNome) {
            return next(ApiError(mError.existeProduto, 406));
        }

        imagem = req.file ? `/uploads/${req.file.filename}` : imagem;

        const data = await runQuery(sql.insertProdutos, [nome, descricao, categoria, preco, estoque, status, imagem]);

        if (data.changes !== 0) {
            res.success(mSuccess.created(nome), data, 201);
        } else {
            next(ApiError(mError.falhaAddProduto, 400));
        }
    } catch (error) {
        next(error);
    }
};

const getAllProdutos = async (req, res, next) => {
    try {
        const nome = req.query.nome;

        if (nome) {
            const data = await allQuery(
                `
            SELECT
            p.id_produto,
            p.nome,
            p.descricao,
            c.nome AS categoria,
            c.status AS statusCategoria,
            p.preco, p.estoque,
            p.status,
            p.imagem
            FROM Produtos p
            JOIN Categorias c ON c.id_categoria = p.id_categoria
            WHERE LOWER(p.nome) LIKE LOWER(?) OR LOWER(p.descricao) LIKE LOWER(?)
            `,
                ['%' + nome + '%', '%' + nome + '%']
            );

            if (data.length) {
                res.success('', data, 200);
            } else {
                next(ApiError('Esse produto não existe!', 404));
            }
        }

        const data = await allQuery(sql.filtraAllProdutos, []);

        if (data.length) {
            res.success('', data, 200);
        } else {
            next(ApiError(mError.naoExiste, 404));
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

        bodyUpdate.categoria = Number(bodyUpdate.categoria);
        bodyUpdate.id_produto = Number(bodyUpdate.id_produto);
        bodyUpdate.preco = parseFloat(bodyUpdate.preco) || 0;
        bodyUpdate.estoque = Number(bodyUpdate.estoque);
        bodyUpdate.status = Boolean(bodyUpdate.status === 'false' ? false : true);

        if (bodyUpdate.estoque > 99) {
            return next(ApiError(mError.limiteEstoque, 406));
        }

        if (bodyUpdate.preco < 0 || bodyUpdate.estoque < 0) {
            return next(ApiError(mError.valoresNegativos, 400));
        }

        const dataEstoqueProduto = await allQuery(sql.estoqueProdutoUpdate, [bodyUpdate.categoria]);
        if (dataEstoqueProduto.length > 0) {
            const qtdEstoqueProduto = dataEstoqueProduto.find((item) => item.id_produto !== bodyUpdate.id_produto);
            if (qtdEstoqueProduto) {
                const totalEstoque = qtdEstoqueProduto.totalEstoque + bodyUpdate.estoque;

                if (totalEstoque > 100) {
                    const restante = 100 - qtdEstoqueProduto.totalEstoque;
                    return next(ApiError(mError.estoqueRestante(restante), 406));
                }

                if (qtdEstoqueProduto.totalEstoque > 100) {
                    return next(ApiError(mError.estoqueExcedido, 406));
                }
            }
        }

        bodyUpdate.imagem = req.file ? `/uploads/${req.file.filename}` : null;

        for (key in bodyUpdate) {
            if (key === 'id_produto') continue;
            if (arrCamposUpdate.includes(key)) {
                if (bodyUpdate[key] !== undefined && bodyUpdate[key] !== null && bodyUpdate[key] !== '') {
                    alteracao.push(`${key} = ?`);
                    params.push(bodyUpdate[key]);
                }
            }
        }
        params.push(bodyUpdate.id_produto);

        if (alteracao.length === 0 || params.length === 0) {
            return next(ApiError(mError.nenhumUpdate, 400));
        }

        const data = await runQuery(sql.updateProduto(alteracao), params);

        if (data.changes !== 0) {
            res.success(mSuccess.updated, data, 200);
        } else {
            next(ApiError(mError.nenhumUpdate, 400));
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { createProdutos, getAllProdutos, updateProdutos };
