// mcError = Mensagem de erro Categoria
// mSuccess = Mensagem de sucesso

const mError = {
    //categoria
    naoExisteCampo: 'Não existe esse campo em nossa tabela!',
    campoInvalido: (arg) => `O campo ${arg} não existe em nosso sistema`,
    digiteCategoria: 'Digite um nome para a categoria!',
    existeCategoria: 'O nome dessa categoria já existe!',
    naoExiste: 'Nenhuma Categoria existente!',
    valorStatus: `O valor do status tem que ser Visível ou Invisível`,
    informeValor: (arg) => `Informe o valor do ${arg}!`,
    nenhumUpdate: 'Nenhuma atualização foi realizada na categoria!',

    //produtos
    campoObrigatorio: 'Os campos (nome, preco, estoque e categoria) são obrigatórios!',
    limiteEstoque: 'Limite de estoque é de até 100!',
    estoqueRestante: (arg) => `Você só pode adicionar mais ${arg} no estoque!`,
    valoresNegativos: 'Preço e Estoque não podem ser valores negativos!',
    estoqueExcedido: 'Total de estoque dessa categoria excedido!',
    existeProduto: 'Esse produto já foi cadastrado!',
    falhaAddProduto: 'Não foi possível adicionar esse Produto!',

    //pedido
    carrinhoVazio: 'Carrinho está vázio, adicione um produto!',
    falhaPedido: 'Falha ao fazer o pedido!',
    nenhumPedidoRealizado: 'Nenhum Pedido realizado!',
    informeIdPedido: 'Informe o ID do pedido!',

    //carrinho
    qtdEstoqueMax: 'Quantidade máxima de estoque atingida',
    informeIdProduto: 'Informe o ID do Produto!',
    campoNumerico: 'Os campos devem ser numéricos!',
};

const mSuccess = {
    created: (arg) => `${arg} criado com sucesso!`,
    updated: `Produto atualizado com sucesso!`,
    deleted: (arg) => `${arg} deletado com sucesso!`,
    custom: (arg) => arg,
};

module.exports = { mError, mSuccess };
