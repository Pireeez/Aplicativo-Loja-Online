const getProdutos = async () => {
    try {
        const data = await axios.get('/produto').then((res) => res.data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const createProduto = async (formData) => {
    try {
        const data = await axios
            .post('/produto', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((res) => res.data);
        return data;
    } catch (error) {
        return error.response.data;
    }
};

const displayListProduto = async () => {
    document.querySelector('.categorias-conteiner').style.display = 'none';
    document.querySelector('.pedidos-conteiner').style.display = 'none';
    document.querySelector('.produtos-conteiner').style.display = 'block';
    try {
        const data = await getProdutos();
        const tbody = document.querySelector('.table tbody');
        tbody.innerHTML = '';

        data.forEach((item) => {
            const tr = document.createElement('tr');

            for (key in item) {
                if (key === 'imagem') continue;

                const td = document.createElement('td');

                if (key === 'nome' || key === 'descricao') {
                    td.textContent = limitaCaracter(item[key]);
                } else if (key === 'preco') {
                    td.textContent = formataPreco(item[key]);
                } else if (key === 'status') {
                    td.textContent = formataStatus(item[key]);
                    td.className = formataCor(td.textContent);
                } else {
                    td.textContent = item[key];
                }
                tr.appendChild(td);
            }

            // coluna com botão de ação
            const tdAcoes = document.createElement('td');
            const btnAction = document.createElement('img');
            btnAction.src = './img/editSquare_categoria.png';
            tdAcoes.appendChild(btnAction);
            tr.appendChild(tdAcoes);
            tbody.appendChild(tr);

            btnAction.addEventListener('click', () => {
                console.log('eae ');
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const displayNewProduto = async () => {
    document.querySelector('.overlay-create-produto').style.display = 'flex';
    try {
        const data = await getListaCategoria();
        const select = document.querySelector('#list-select-categoria');
        select.innerHTML = '';
        const optionDefault = document.createElement('option');
        optionDefault.disabled = true;
        optionDefault.selected = true;
        optionDefault.textContent = 'Selecione uma categoria';
        select.appendChild(optionDefault);
        data.forEach((item) => {
            const option = document.createElement('option');
            option.textContent = item.nome;
            option.id = item.id_categoria;
            select.appendChild(option);
        });

        const check = document.querySelector('#status-produto-check');
        const statusView = document.querySelector('#box-produto-status');
        check.addEventListener('click', () => {
            statusView.textContent = `Status: ${formataStatus(check.checked)}`;
        });

        const btnCeate = document.querySelector('#btn-new-produto');
        btnCeate.addEventListener('click', async () => {
            try {
                const findCategoria = data.find((item) => item.nome === select.value);
                if (!findCategoria) {
                    boxMessage('Informe uma categoria');
                    select.style = 'border: 1px solid red;';
                    select.addEventListener('input', () => (select.style.border = ''));
                    return;
                }
                const fileInput = document.querySelector('#fileElem');
                const dataMap = {
                    nome: document.querySelector('#nomeProduto').value,
                    descricao: document.querySelector('#descricaoProduto').value,
                    categoria: Number(findCategoria.id_categoria),
                    preco: parseFloat(document.querySelector('#precoProduto').value),
                    estoque: Number(document.querySelector('#estoqueProduto').value),
                    status: Boolean(document.querySelector('#status-produto-check').value) || 0,
                    imagem: fileInput.files[0] || null,
                };
                const msg = [];
                for (key in dataMap) {
                    if (key === 'nome' || key === 'preco' || key === 'estoque') {
                        if (!dataMap[key]) {
                            const name = document.querySelector(`#${key}Produto`);
                            name.style.border = '1px solid red';
                            name.addEventListener('input', () => (name.style.border = ''));
                            msg.push(' ' + key);
                        }
                    }
                    boxMessage(`O Campo ${msg} é obrigatório`);
                    if (key === 'preco' || key === 'estoque') {
                        if (dataMap[key] !== 'number') {
                            boxMessage(`O campo: ${key} tem que ser númerico!`);
                        }
                    }
                }

                const formData = new FormData();
                for (let key in dataMap) {
                    formData.append(key, dataMap[key]);
                }

                const result = await createProduto(formData);

                if (result.status === 406 || result.status === 400) {
                    boxMessage(result.message);
                    exitBox();
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        });
    } catch (error) {
        console.log(error);
    }
};
