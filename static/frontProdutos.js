const getProdutos = async () => {
    try {
        const data = await axios.get('/produto').then((res) => res.data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const getCategoria = async () => {
    try {
        const data = axios.get('/categoria').then((res) => res.data);
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
        const tbody = document.querySelector('.table tbody'); // seleciona o tbody real
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
                console.log('olá');
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const displayNewProduto = async () => {
    document.querySelector('.overlay-create-produto').style.display = 'flex';
    try {
        const data = await getCategoria();
        const select = document.querySelector('#list-select-categoria');

        data.forEach((item) => {
            const option = document.createElement('option');
            option.textContent = item.nome;
            option.id = item.id_categoria;
            select.appendChild(option);
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
                    status: Boolean(document.querySelector('#status-produto-check').value),
                    imagem: fileInput.files[0],
                };
                for (key in dataMap) {
                    if (key === 'nome' || key === 'preco') {
                        if (!dataMap[key]) {
                            const name = document.querySelector(`#${key}Produto`);
                            name.style.border = '1px solid red';
                            name.addEventListener('input', () => (name.style.border = ''));
                        }
                        boxMessage(`O Campo ${key} é obrigatório`);
                    }
                }

                const formData = new FormData();
                for (let key in dataMap) {
                    formData.append(key, dataMap[key]);
                }

                const result = await createProduto(formData);

                if (result.status) {
                    return boxMessage(result.message);
                }

                console.log(result);
            } catch (error) {
                console.log(error);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const limitaCaracter = (text) => {
    if (text.length > 20) {
        return (text = `${text.substring(0, 20)}...`);
    }
    return text;
};

const formataPreco = (preco) => {
    preco = preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return preco;
};

const formataStatus = (status) => {
    if (status === 1) {
        return (status = 'Visível');
    }

    if (status === 0) {
        return (status = 'Invisível');
    }
};

const formataCor = (statusCor) => {
    if (statusCor === 'Visível') {
        return 'status-color-green';
    }

    if (statusCor === 'Invisível') {
        return 'status-color-red';
    }
};

const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileElem');

// Clicar na área abre o input
dropArea.addEventListener('click', () => fileInput.click());

// Seleção via input
fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

// Arrastar sobre a área
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('hover');
});

// Sair da área sem soltar
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover');
});

// Soltar arquivos
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('hover');
    handleFiles(e.dataTransfer.files);
});

// Função interna para processar arquivo
function handleFiles(files) {
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        // Cria URL temporária para mostrar a imagem
        const preview = document.getElementById('preview');
        const imageURL = URL.createObjectURL(file);
        preview.src = imageURL;
    }
}
