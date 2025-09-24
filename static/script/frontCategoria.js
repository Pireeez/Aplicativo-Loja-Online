//Pega lista de categoria
const getListaCategoria = async () => {
    try {
        const data = await axios.get('/categoria').then((res) => res.data);
        return data;
    } catch (error) {
        return error.response.data;
    }
};

//cria nova categoria
const createNewCategoria = async (payload) => {
    try {
        const data = await axios.post('/categoria', payload).then((res) => res.data);
        return data;
    } catch (error) {
        return error.response.data;
    }
};

//atualiza categoria
const updateCategoria = async (payload) => {
    try {
        const data = await axios.patch('/categoria', payload).then((res) => res.data);
        return data;
    } catch (error) {
        return error.response.data;
    }
};

//lista todas as categorias
const displayListCategoria = async () => {
    //mostra a tabela de categoria
    document.querySelector('.categorias-conteiner').style.display = 'block';
    document.querySelector('.produtos-conteiner').style.display = 'none';
    document.querySelector('.pedidos-conteiner').style.display = 'none';

    try {
        //chamada API pega lista de categorias
        const { data } = await getListaCategoria();

        //se não existe nenhuma categoria exibe menssagem
        if (data.status === 404) {
            return boxMessage(data.message, data.status);
        }

        //formatando e exibindo elementos da API na tabela
        const tbody = document.querySelector('.table tbody');
        tbody.innerHTML = '';
        data.forEach((obj) => {
            const tr = document.createElement('tr');

            for (let key in obj) {
                const td = document.createElement('td');
                td.textContent = obj[key];

                if (key === 'status') {
                    td.textContent = formataStatus(obj[key]);
                    td.className = formataCor(obj[key]);
                } else {
                    td.className = key;
                }
                tr.appendChild(td);
            }

            const tdAcoes = document.createElement('td');
            const btnAction = document.createElement('img');
            btnAction.src = './img/editSquare_categoria.png';
            btnAction.className = '.btn-edit';
            tdAcoes.appendChild(btnAction);
            tr.appendChild(tdAcoes);
            tbody.appendChild(tr);

            //btn que inicia a ação para atualizar categoria
            btnAction.addEventListener('click', () => {
                displayBoxUpdate(tr.children);
            });
        });
    } catch (error) {
        console.log(error);
    }
};

//exibe a tela de update
const displayBoxUpdate = (ulChildren) => {
    //pego informações da tabela
    const datahtml = [];
    for (let n of ulChildren) {
        datahtml.push(n.textContent);
    }

    //crio um obj para aramazena o conteúdo de datahtml
    const obj = {
        id_categoria: Number(datahtml[0]) || null,
        nome: datahtml[1] || null,
        status: datahtml[2] || null,
    };

    //exibo overlay de update categoria
    document.querySelector('#overlay-update-categoria').style.display = 'flex';

    //declaro algumas variáveis de elementos html (nome, status, checkbox, btnUpdate)
    const nameInput = document.querySelector('#nome-categoria-edit');
    const statusEdit = document.querySelector('#box-categoria-status');
    const checkedEdit = document.querySelector('#status-edit-check');
    const btnUpdade = document.querySelector('#btn-update-categoria');

    //resetando os botões/inputs para garantir que não fiquem acumulando
    //cloneNode cria uma cópia
    //replaceWith substitiu o elemento original
    checkedEdit.replaceWith(checkedEdit.cloneNode(true));
    btnUpdade.replaceWith(btnUpdade.cloneNode(true));

    //seleciona de novo
    const checkedEditNew = document.querySelector('#status-edit-check');
    const btnUpdadeNew = document.querySelector('#btn-update-categoria');

    //adiciona as informações de exibição na tela update categoria
    nameInput.textContent = obj.nome;
    statusEdit.textContent = `Status: ${obj.status}`;
    checkedEditNew.checked = obj.status === 'Visível' ? 1 : 0;
    obj.status = checkedEditNew.checked;

    //verifico o checkbox e atribuo a variável obj.status
    checkedEditNew.addEventListener('click', () => {
        if (checkedEditNew.checked) {
            statusEdit.textContent = `Status: Visível`;
            obj.status = checkedEditNew.checked;
        } else {
            statusEdit.textContent = `Status: Invisível`;
            obj.status = checkedEditNew.checked;
        }
    });

    //btn que envia para api a nova atualização
    btnUpdadeNew.addEventListener('click', () => {
        sendUpdateCategoria(obj);
    });
};

//envia nova atualização para API
const sendUpdateCategoria = async (payload) => {
    try {
        const data = await updateCategoria(payload);
        console.log(data);
        //tratativa de statu    s
        if (data.status === 200) {
            boxMessage(data.message, data.status);
            await displayListCategoria();
            exitBox();
            return;
        }
        if (data.status === 400) {
            boxMessage(data.message, data.status);
            exitBox();
            return;
        }

        if (data.status === 406) {
            boxMessage(data.message, data.status);
            exitBox();
            return;
        }
    } catch (error) {
        console.error(error);
    }
};

//exibe o overlay de criação da nova categoria
const displayNewCategoria = () => {
    document.querySelector('#overlay-create-categoria').style.display = 'flex';
    const checkStatus = document.querySelector('#box-status-check');
    const status = document.querySelector('#box-new-categoria-status');

    checkStatus.checked = false;
    status.textContent = `Status: ${formataStatus(checkStatus.checked)}`;
    checkStatus.addEventListener('click', () => {
        if (checkStatus.checked) {
            status.textContent = 'Status: Visível';
        } else {
            status.textContent = 'Status: Invisível';
        }
    });
};

//envia dados da nova categoria
const sendNewCategoria = async () => {
    //crio variáveis de elemento html (nome, status)
    const checkStatus = document.querySelector('#box-status-check');
    const inputName = document.querySelector('#input-nome');

    if (!inputName.value) {
        boxMessage('Digite um nome para a Categoria! ');
        inputName.style.border = '1px solid red';
        return;
    }
    console.log(checkStatus.checked);
    const payload = {
        nome: inputName.value,
        status: checkStatus.checked,
    };

    console.log(payload);

    const data = await createNewCategoria(payload);

    //tratativa de erro
    if (data.status === 400) {
        boxMessage(data.message, data.status);
        inputName.style.border = '1px solid red';
        return;
    }
    if (data.status === 406) {
        boxMessage(data.message, data.status);
        inputName.style.border = '1px solid red';
        inputName.value = '';
        return;
    }
    if (data.status === 201) {
        boxMessage(data.message, data.status);
        exitBox();
        await displayListCategoria();
        return;
    }
};
