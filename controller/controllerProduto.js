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
const arrCamposUpdate = ['id_produto', 'nome', 'descricao', 'categoria', 'preco', 'estoque', 'status', 'imagem'];

const createProdutos = async (req, res, next) => {
    try {
        let { nome, descricao, categoria, preco, estoque, status, imagem } = req.body;

        //verifica se existe o campo
        for (key in req.body) {
            if (!arrCampos.includes(key)) {
                return next(ApiError(mError.naoExisteCampo, 400));
            }
        }

        //tratando cada tipo de dado
        categoria = Number(categoria);
        preco = parseFloat(preco);
        estoque = Number(estoque);
        status = Boolean(status);

        //campos obrigatório (preco, estoque) = null para caso tenha 0
        if (!nome || preco == null || estoque == null || !categoria) {
            return next(ApiError(mError.campoObrigatorio, 400));
        }

        //limite de estoque
        if (estoque > 100) {
            return next(ApiError(mError.limiteEstoque, 400));
        }

        //quantidade de estoque excedido
        const qtdEstoque = await getQuery(sql.sumEstoqueProduto, [categoria]);
        if (qtdEstoque.totalEstoque > 99) {
            return next(ApiError(mError.estoqueExcedido, 400));
        }

        //total de estoque restante
        const totalEstoque = qtdEstoque.totalEstoque + estoque;
        if (totalEstoque > 100) {
            const restante = 100 - qtdEstoque.totalEstoque;
            return next(ApiError(mError.estoqueRestante(restante), 406));
        }

        //preco e estoque não podem ser valores negativos
        if (preco < 0 || estoque < 0) {
            return next(ApiError(mError.valoresNegativos, 400));
        }

        //preco maior que 100
        if (estoque > 100) {
            return next(ApiError(mError.limiteEstoque, 400));
        }

        //total de estoque excedido!
        if (qtdEstoque.totalEstoque > 100) {
            return next(ApiError(mError.estoqueExcedido, 406));
        }

        //trativa antes de iserir
        const verificaNome = await getQuery(sql.existeNomeProduto, [nome]);

        //verifica de existe produto
        if (verificaNome.existeNome) {
            return next(ApiError(mError.existeProduto, 406));
        }

        //verifico se enviou um file de imagem se não recebe a img (url)
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
        const data = await allQuery(sql.filtraAllProdutos, []);

        if (data.length) {
            return res.success('', data, 200);
        } else {
            return next(ApiError(mError.naoExiste, 404));
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
        const data = await runQuery(sql.updateProduto(alteracao), params);

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
