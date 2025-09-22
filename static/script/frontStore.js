(async () => {
    try {
        const { data } = await getProdutos();
        listaProdutoCategoria(data);
    } catch (error) {
        console.error(error);
    }
})();

const listaProdutoCategoria = (data) => {
    const mainStore = document.querySelector('.main-store');
    mainStore.innerHTML = ''; // limpa conteúdo inicial

    // Agrupar produtos por categoria
    const produtosPorCategoria = {};
    data.forEach((produto) => {
        if (!produtosPorCategoria[produto.categoria]) {
            produtosPorCategoria[produto.categoria] = [];
        }
        produtosPorCategoria[produto.categoria].push(produto);
    });

    // Criar HTML por categoria
    for (const categoria in produtosPorCategoria) {
        // Cabeçalho da categoria
        const containerCategoria = document.createElement('div');
        containerCategoria.className = 'categoria-produto';

        const h2 = document.createElement('h2');
        h2.textContent = categoria;

        const p = document.createElement('p');
        p.textContent = `${produtosPorCategoria[categoria].length} Produtos`;

        containerCategoria.appendChild(h2);
        containerCategoria.appendChild(p);
        mainStore.appendChild(containerCategoria);

        // Container de produtos
        const sectionContainer = document.createElement('section');
        sectionContainer.className = 'container-produtos';
        mainStore.appendChild(sectionContainer);

        // Produtos
        produtosPorCategoria[categoria].forEach((item) => {
            const divContainer = document.createElement('div');
            divContainer.className = 'info-produto';

            // imagem
            const divImg = document.createElement('div');
            divImg.className = 'info-img';
            const imgProduto = document.createElement('img');
            imgProduto.src = item.imagem;
            divImg.appendChild(imgProduto);

            // info-text
            const infoProduto = document.createElement('div');
            infoProduto.className = 'info-text';

            const h3Produto = document.createElement('h3');
            h3Produto.textContent = limitaCaracter(item.nome);

            const pProduto = document.createElement('p');
            pProduto.textContent = limitaCaracter(item.descricao);

            const h4Produto = document.createElement('h4');
            h4Produto.textContent = formataPreco(item.preco);

            infoProduto.appendChild(h3Produto);
            infoProduto.appendChild(pProduto);
            infoProduto.appendChild(h4Produto);

            // botão
            const btnProduto = document.createElement('button');
            btnProduto.textContent = 'Adicionar ao Carrinho';

            // se não tem estoque, mostra texto
            if (item.estoque === 0 || item.status === 0) {
                const semEstoque = document.createElement('p');
                semEstoque.className = 'sem-estoque';
                semEstoque.textContent = 'Sem estoque';

                btnProduto.disabled = true;
                btnProduto.classList.add('btn-disabled');

                infoProduto.appendChild(semEstoque);
            }

            infoProduto.appendChild(btnProduto);
            // montar card
            divContainer.appendChild(divImg);
            divContainer.appendChild(infoProduto);
            sectionContainer.appendChild(divContainer);

            btnProduto.addEventListener('click', () => {
                sendProdutoCarrinho(item);
            });
        });
    }
};

let totalCarrinho = 0;
const sendProdutoCarrinho = (produto) => {
    try {
        console.log(produto);
        const cartItems = document.createElement('div');
        cartItems.classList.add('cart-items');

        const imgItens = document.createElement('div');
        imgItens.classList.add('img-items');

        const valorTotal = document.createElement('h3');
        valorTotal.textContent = formataPreco(produto.preco);

        const previwCar = document.createElement('img');
        previwCar.src = produto.imagem;
        previwCar.classList.add('previw-car');

        const nameDesc = document.createElement('div');
        nameDesc.classList.add('name-desc');

        const h4Name = document.createElement('h4');
        h4Name.textContent = produto.nome;

        const pDesc = document.createElement('p');
        pDesc.textContent = limitaCaracter(produto.descricao);

        const qtdProduto = document.createElement('div');
        qtdProduto.classList.add('qtd-produto');

        const selectQtd = document.createElement('select');

        for (let i = 1; i < produto.estoque; i++) {
            const option = document.createElement('option');
            option.textContent = i;
            selectQtd.appendChild(option);
        }

        const deleteProduto = document.createElement('div');
        deleteProduto.classList.add('delete-produto');

        const imgDelete = document.createElement('img');
        imgDelete.src = './img/delete.png';

        cartItems.appendChild(imgItens);
        imgItens.appendChild(previwCar);
        imgItens.appendChild(nameDesc);

        nameDesc.appendChild(h4Name);
        nameDesc.appendChild(pDesc);
        nameDesc.appendChild(qtdProduto);

        qtdProduto.appendChild(selectQtd);
        qtdProduto.appendChild(deleteProduto);

        deleteProduto.appendChild(imgDelete);

        imgItens.appendChild(valorTotal);

        document.querySelector('#carrinho').append(cartItems);
        totalCarrinho += produto.preco * 1;
        document.querySelector('#valueTotal').textContent = `Valor Total: ${formataPreco(totalCarrinho)}`;
    } catch (error) {
        console.error(error);
    }
};
