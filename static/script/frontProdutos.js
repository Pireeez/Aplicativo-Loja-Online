const getProdutos = async (nome) => {
    try {
        const data = await axios.get('/produto').then((res) => res.data);

        if (nome) {
            const data = await axios.get(`/produto?nome=${nome}`).then((res) => res.data);
            return data;
        }
        return data;
    } catch (error) {
        boxMessage(error.response.data.message, error.response.data.status);
    }
};

const createProduto = async (formData) => {
    try {
        const data = await axios
            .post('/produto', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((res) => res.data);
        return data;
    } catch (error) {
        return error.response.data;
    }
};

const updateProduto = async (formData) => {
    try {
        const data = await axios
            .patch('/produto', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((res) => res.data);
        return data;
    } catch (error) {
        return error.response.data;
    }
};

//lista produto
const displayListProduto = async () => {
    document.querySelector('.categorias-conteiner').style.display = 'none';
    document.querySelector('.pedidos-conteiner').style.display = 'none';
    document.querySelector('.produtos-conteiner').style.display = 'block';
    try {
        //busco produtos
        const { data } = await getProdutos(null);
        const tbody = document.querySelector('.produtos-conteiner .table tbody');
        tbody.innerHTML = '';

        data.forEach((item) => {
            const tr = document.createElement('tr');

            for (key in item) {
                if (key === 'statusCategoria') continue;
                if (key === 'imagem') continue;
                const td = document.createElement('td');

                if (key === 'nome' || key === 'descricao') {
                    td.textContent = limitaCaracter(item[key]);
                } else if (key === 'preco') {
                    td.textContent = formataPreco(item[key]);
                } else if (key === 'status') {
                    td.textContent = formataStatus(item[key]);
                    td.className = formataCor(item[key]);
                } else {
                    td.textContent = item[key];
                }
                tr.appendChild(td);
            }

            // coluna com botão de ação
            const tdAcoes = document.createElement('td');
            const btnAction = document.createElement('img');

            btnAction.src = './img/editSquare_categoria.png';
            btnAction.className = 'btn-edit';

            tdAcoes.appendChild(btnAction);
            tr.appendChild(tdAcoes);
            tbody.appendChild(tr);

            btnAction.addEventListener('click', () => {
                displayUpdateProduto(item);
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const displayNewProduto = async () => {
    document.querySelector('#overlay-create-produto').style.display = 'flex';
    try {
        const { data } = await getListaCategoria();
        //cria lista de categorias
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

        //customização do check do status
        const check = document.querySelector('#status-produto-check');
        const statusView = document.querySelector('#box-produto-status');
        check.checked = false;
        statusView.textContent = `Status: ${formataStatus(check.checked)}`;
        check.addEventListener('click', () => {
            statusView.textContent = `Status: ${formataStatus(check.checked)}`;
        });

        //botão que envia o novo produto
        const btnCreateProduto = document.querySelector('#btn-new-produto');

        btnCreateProduto.addEventListener('click', async () => {
            try {
                const findCategoria = data.find((item) => item.nome === select.value);
                if (!findCategoria) {
                    boxMessage('Informe uma categoria');
                    select.style = 'border: 1px solid red;';
                    select.addEventListener('input', () => (select.style.border = ''));
                    return;
                }
                const fileInput = document.querySelector('.fileElem');
                const produtoPayload = {
                    nome: document.querySelector('#nomeProduto').value,
                    descricao: document.querySelector('#descricaoProduto').value,
                    categoria: Number(findCategoria.id_categoria),
                    preco: parseFloat(document.querySelector('#precoProduto').value),
                    estoque: Number(document.querySelector('#estoqueProduto').value),
                    status: Boolean(document.querySelector('#status-produto-check').value) || 0,
                    imagem: fileInput.files[0] || null,
                };
                const msg = [];
                for (let key in produtoPayload) {
                    if (key === 'nome' || key === 'preco' || key === 'estoque') {
                        if (!produtoPayload[key]) {
                            const campo = document.querySelector(`#${key}Produto`);
                            campo.style.border = '1px solid red';
                            campo.addEventListener('input', () => (campo.style.border = ''));
                            msg.push(key);
                        }
                    }
                    if (key === 'estoque') {
                        if (produtoPayload[key] <= 0) {
                            return boxMessage('Estoque não pode ser 0 ou Negativo!');
                        }
                    }
                }

                if (msg.length > 0) {
                    boxMessage(`Os campos ${msg.join(', ')} são obrigatórios`);
                    return; // interrompe a função aqui
                }

                const formData = new FormData();
                for (let key in produtoPayload) {
                    formData.append(key, produtoPayload[key]);
                }

                const result = await createProduto(formData);
                if (result.status === 201 || result.status === 200) {
                    boxMessage(result.message, result.status);
                    exitBox();
                    displayListProduto();
                } else {
                    boxMessage(result.message, result.status);
                }
            } catch (error) {
                console.log(error);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const displayUpdateProduto = async (item) => {
    try {
        const { data } = await getListaCategoria();
        document.querySelector('#overlay-update-produto').style.display = 'flex';

        const dataMapUpdate = {
            id_produto: item.id_produto,
            nome: item.nome,
            descricao: item.descricao,
            categoria: item.categoria,
            preco: item.preco,
            estoque: item.estoque,
            status: item.status,
            imagem: item.imagem,
        };

        //mapeio e informo os valores nos campos
        //busco api

        const select = document.getElementById('select-update');
        for (key in dataMapUpdate) {
            if (key === 'id_produto') continue;
            if (key === 'categoria') {
                //exibo a categoria selecionada da lista de produto
                select.innerHTML = '';
                select.id = 'select-update';
                const opt = document.createElement('option');
                opt.id = key;
                opt.textContent = dataMapUpdate[key];
                select.appendChild(opt);

                //não existe categoria
                if (data.status === 404) {
                    return boxMessage(data.message, data.status);
                }

                //crio menu suspenso
                data.forEach((element) => {
                    const option = document.createElement('option');

                    if (element.nome === dataMapUpdate[key]) return;
                    option.textContent = element.nome;
                    select.appendChild(option);
                });
            } else if (key === 'status') {
                //mudo o status do checkbox
                document.getElementById(key).checked = dataMapUpdate[key];
                document.getElementById('statusUpdateProduto').textContent = `Status: ${formataStatus(
                    dataMapUpdate[key]
                )}`;
            } else if (key === 'imagem') {
                //exibo imagem
                document.getElementById('previewUpdate').src = dataMapUpdate[key];
            } else {
                document.getElementById(key).value = dataMapUpdate[key];
            }
        }

        const check = document.getElementById('status');
        check.addEventListener('click', () => {
            document.getElementById('statusUpdateProduto').textContent = `Status: ${formataStatus(check.checked)}`;
        });

        const btnUpdateProduto = document.getElementById('btn-update-produto');
        btnUpdateProduto.addEventListener('click', async () => {
            try {
                const formData = new FormData();

                for (key in dataMapUpdate) {
                    if (key === 'categoria') {
                        const findCetegoria = data.find((item) => item.nome === select.value);
                        formData.append(key, findCetegoria.id_categoria);
                    } else if (key === 'status') {
                        formData.append(key, check.checked);
                    } else if (key === 'imagem') {
                        formData.append(key, document.querySelector('#fileUpdate').files[0]);
                    } else if (key === 'id_produto') {
                        formData.append(key, dataMapUpdate.id_produto);
                    } else {
                        formData.append(key, document.getElementById(key).value);
                    }
                }

                const dataUpdate = await updateProduto(formData);

                if (dataUpdate.status === 200 || dataUpdate.status === 201) {
                    boxMessage(dataUpdate.message, dataUpdate.status);
                    exitBox();
                    displayListProduto();
                } else {
                    boxMessage(dataUpdate.message, dataUpdate.status);
                    displayListProduto();
                }
            } catch (error) {
                console.log(error);
            }
        });
    } catch (error) {
        console.log(error);
    }
};
