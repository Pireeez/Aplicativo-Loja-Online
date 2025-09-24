(async () => {
    try {
        const { data } = await getProdutos();
        listaProdutoCategoria(data);
    } catch (error) {
        console.error(error);
    }
})();

const postCarrinhoProduto = async (payload) => {
    try {
        const data = axios.post('/carrinho', payload).then((res) => res.data);
        return data;
    } catch (error) {
        console.log(error.response.data);
    }
};

const getCarrinhoProduto = async () => {
    try {
        const data = axios.get('/carrinho').then((res) => res.data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const updateCarrinho = async (payload) => {
    try {
        const data = axios.patch('/carrinho', payload).then((res) => res.data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const deleteCarrinhoProduto = async (id) => {
    try {
        const data = axios.delete(`/carrinho/${id}`).then((res) => res.data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const listaProdutoCategoria = (data) => {
    const mainStore = document.querySelector('.main-store');
    mainStore.innerHTML = '';

    //quando clicar no produto aumentar quantidade no carrinho
    //categoria invisível e estoque
    //produto
    //coerencia
    //número na quantidade inteiros
    //nome de categoria n pode ser o mesmo com e sem ácento

    //agrupar produtos por categoria
    const produtosPorCategoria = {};
    data.forEach((produto) => {
        if (produto.statusCategoria === 0) return;
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
            if (item.estoque === 0) {
                const semEstoque = document.createElement('p');
                semEstoque.className = 'sem-estoque';
                semEstoque.textContent = 'Sem estoque';

                btnProduto.disabled = true;
                btnProduto.classList.add('btn-disabled');

                infoProduto.appendChild(semEstoque);
            }

            if (item.status === 0) {
                divContainer.style.display = 'none';
            }

            infoProduto.appendChild(btnProduto);
            // montar card
            divContainer.appendChild(divImg);
            divContainer.appendChild(infoProduto);
            sectionContainer.appendChild(divContainer);

            btnProduto.addEventListener('click', () => {
                //quando clicar adicionar +1 desse produto no carrinho
                sendProdutoCarrinho(item);
            });
        });
    }
};
const carrinhoContagem = {};
const sendProdutoCarrinho = async (produto) => {
    try {
        if (!carrinhoContagem[produto.id_produto]) {
            carrinhoContagem[produto.id_produto] = 0;
        }

        // incrementa a quantidade do produto específico
        carrinhoContagem[produto.id_produto] += 1;

        const payload = {
            id_produto: produto.id_produto,
            quantidade: carrinhoContagem[produto.id_produto],
            valor: produto.preco * carrinhoContagem[produto.id_produto],
        };

        const dataPostCarrinho = await postCarrinhoProduto(payload);

        if (dataPostCarrinho.status === 200) {
            return boxMessage(dataPostCarrinho.message, dataPostCarrinho.status);
        }
    } catch (error) {
        boxMessage(error.response.data.message, error.response.data.status);
    }
};

const listProdutoCarrinho = async () => {
    document.getElementById('cartModal').style.display = 'flex';
    try {
        let qtdItens = 0;
        let totalCarrinho = 0;

        const dataGetCarrinho = await getCarrinhoProduto();
        const data = dataGetCarrinho.data;

        document.querySelector('#carrinho').innerHTML = '';
        if (data.length === 0) {
            document.querySelector('#valueTotal').textContent = `Valor Total: $0,00`;
            document.querySelector('#qtd-itens-car').textContent = ``;
        }

        for (produto of data) {
            const cartItems = document.createElement('div');
            cartItems.classList.add('cart-items');

            const imgItens = document.createElement('div');
            imgItens.classList.add('img-items');

            const valorTotal = document.createElement('h3');
            valorTotal.textContent = formataPreco(produto.totalProduto);

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

            for (let i = 1; i <= produto.estoque; i++) {
                const option = document.createElement('option');
                option.textContent = i;
                selectQtd.appendChild(option);
            }
            selectQtd.value = produto.quantidade;

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

            totalCarrinho += produto.totalProduto * 1;
            document.querySelector('#valueTotal').textContent = `Valor Total: ${formataPreco(totalCarrinho)}`;

            deleteProduto.setAttribute('data-id', produto.id_produto);
            deleteProduto.addEventListener('click', (e) => {
                const idProduto = e.currentTarget.getAttribute('data-id');
                sendDeleteCarrinhoProduto(Number(idProduto));
            });

            selectQtd.setAttribute('data-id', produto.id_produto);
            selectQtd.addEventListener('change', (e) => {
                const idProduto = e.currentTarget.getAttribute('data-id');
                sendUpdateQtdCarrinho(Number(idProduto), Number(selectQtd.value));
            });
            document.querySelector('#qtd-itens-car').textContent = `${(qtdItens += 1)} Itens`;
        }
    } catch (error) {
        console.log(error);
    }
};

const sendUpdateQtdCarrinho = async (idProduto, qtdUpdate) => {
    try {
        const payload = {
            id_produto: idProduto,
            quantidade: qtdUpdate,
        };

        const data = await updateCarrinho(payload);

        if (data.status === 200) {
            boxMessage(data.message, data.status);
            listProdutoCarrinho();
        }
    } catch (error) {
        console.log(error);
    }
};
const sendDeleteCarrinhoProduto = async (produtoDelete) => {
    try {
        const data = await deleteCarrinhoProduto(produtoDelete);
        console.log(data);
        if (data.changes !== 0) {
            boxMessage(data.message, data.status);
            listProdutoCarrinho();
        }
    } catch (error) {
        console.log(error);
    }
};
