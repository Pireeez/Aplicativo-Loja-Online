const getPedido = async () => {
    try {
        const { data } = await axios.get('/pedido').then((res) => res.data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const getDetailsPedido = async (id) => {
    try {
        const { data } = await axios.get(`/pedido/${id}`).then((res) => res.data);
        return data;
    } catch (error) {
        console.log(error);
    }
};
const displayListPedido = async () => {
    document.querySelector('.categorias-conteiner').style.display = 'none';
    document.querySelector('.produtos-conteiner').style.display = 'none';
    document.querySelector('.pedidos-conteiner').style.display = 'block';
    try {
        const listPedido = await getPedido();

        const tbody = document.querySelector('.pedidos-conteiner .table tbody');
        tbody.innerHTML = '';
        listPedido.forEach((item) => {
            const tr = document.createElement('tr');

            for (key in item) {
                const td = document.createElement('td');

                if (key === 'valorTotal') {
                    td.id = key;
                    td.textContent = formataPreco(item[key]);
                } else {
                    td.id = key;
                    td.textContent = item[key];
                }
                tr.appendChild(td);
            }
            const tddetails = document.createElement('td');
            const btnDetails = document.createElement('img');

            btnDetails.src = './img/details.png';

            tddetails.appendChild(btnDetails);
            tr.appendChild(tddetails);
            tbody.appendChild(tr);

            btnDetails.addEventListener('click', () => {
                displayDetailsPedido(item);
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const displayDetailsPedido = async (item) => {
    document.querySelector('#overlay-details-pedido').style.display = 'flex';
    document.querySelector('.details-conteiner').style.display = 'block';
    try {
        const listaDetailsPedido = await getDetailsPedido(item.id_pedido);
        const tbody = document.querySelector('.details-conteiner .table tbody');

        document.querySelector('#data-pedido').textContent = new Date(item.data).toLocaleDateString();
        document.querySelector('#qtd-itens').textContent = item.totalItens;
        document.querySelector('#valor-total').textContent = formataPreco(item.valorTotal);

        listaDetailsPedido.forEach((item) => {
            const tr = document.createElement('tr');

            for (key in item) {
                const td = document.createElement('td');
                if (key === 'data') continue;
                if (key === 'nome') {
                    td.textContent = item[key];
                } else if (key === 'preco_unitario' || key === 'subtotal') {
                    td.textContent = formataPreco(item[key]);
                } else {
                    td.textContent = item[key];
                }

                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.log(error);
    }
};
