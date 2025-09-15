const conteinerCategoria = document.querySelector('.categorias-conteiner');

const getListaCategoria = async () => {
    try {
        const data = await axios.get('/categoria').then((res) => res.data);
        return data;
    } catch (error) {
        return error.response.data;
    }
};

const createNewCategoria = async (payload) => {
    try {
        const data = await axios.post('/categoria', payload).then((res) => res.data);
        return data;
    } catch (error) {
        return error.response.data;
    }
};

const updateCategoria = async (payload) => {
    try {
        const data = await axios.patch('/categoria', payload).then((res) => res.data);
        return data;
    } catch (error) {
        return error.response.data;
    }
};

const displayListCategoria = async () => {
    // Mostra o container
    conteinerCategoria.style.display = 'block';
    document.querySelector('.produtos-conteiner').style.display = 'none';
    document.querySelector('.pedidos-conteiner').style.display = 'none';

    // Pega os dados da API
    const data = await getListaCategoria();

    if (data.status === 404) {
        return boxMessage(data.message);
    }

    const divDataCategoria = document.querySelector('.data');
    // Limpa o container para não acumular dados
    divDataCategoria.innerHTML = '';

    // Remove duplicados baseado no id_categoria
    const uniqueData = data.filter(
        (item, index, self) => index === self.findIndex((t) => t.id_categoria === item.id_categoria)
    );

    uniqueData.forEach((obj) => {
        const ul = document.createElement('ul');

        // Cria li para cada chave do objeto
        for (let key in obj) {
            const li = document.createElement('li');
            li.textContent = obj[key];

            // Ajuste de status
            if (key === 'status') {
                if (obj[key] === true || obj[key] === '1' || obj[key] === 1) {
                    li.className = 'status-visivel';
                    li.textContent = 'Visível';
                } else {
                    li.className = 'status-invisivel';
                    li.textContent = 'Invisível';
                }
            } else {
                li.className = key;
            }

            ul.appendChild(li);
        }

        // Cria li apenas para o botão
        const liAction = document.createElement('li');
        const btnAction = document.createElement('img');
        btnAction.src = './img/editSquare_categoria.png';
        btnAction.className = 'btn-editCategoria';

        btnAction.addEventListener('click', () => {
            displayBoxUpdate(ul.children);
        });

        liAction.appendChild(btnAction);
        ul.appendChild(liAction);

        // Adiciona o ul no container
        divDataCategoria.appendChild(ul);
    });
};

const displayBoxUpdate = (ulChildren) => {
    const datahtml = [];
    for (let n of ulChildren) {
        datahtml.push(n.textContent);
    }
    const obj = {
        id_categoria: Number(datahtml[0]) || null,
        nome: datahtml[1] || null,
        status: datahtml[2] || null,
    };
    document.querySelector('.overlay-update').style.display = 'flex';
    const nameInput = document.querySelector('#nome-categoria-edit');
    const statusEdit = document.querySelector('#box-categoria-status');
    const checkedEdit = document.querySelector('#status-edit-check');
    const btnUpdade = document.querySelector('#btn-update-categoria');

    // Remove listeners antigos
    checkedEdit.replaceWith(checkedEdit.cloneNode(true));
    btnUpdade.replaceWith(btnUpdade.cloneNode(true));

    // Seleciona de novo
    const checkedEditNew = document.querySelector('#status-edit-check');
    const btnUpdadeNew = document.querySelector('#btn-update-categoria');

    nameInput.textContent = obj.nome;
    statusEdit.textContent = `Status: ${obj.status}`;
    checkedEditNew.checked = obj.status === 'Visível' ? 1 : 0;
    obj.status = checkedEditNew.checked;

    checkedEditNew.addEventListener('click', () => {
        if (checkedEditNew.checked) {
            statusEdit.textContent = `Status: Visível`;
            obj.status = checkedEditNew.checked;
        } else {
            statusEdit.textContent = `Status: Invisível`;
            obj.status = checkedEditNew.checked;
        }
    });

    btnUpdadeNew.addEventListener('click', () => {
        sendUpdateCategoria(obj);
    });
};

const sendUpdateCategoria = async (payload) => {
    try {
        const data = await updateCategoria(payload);
        if (data.status === 200) {
            boxMessage(data.message);
            await displayListCategoria();
            exitBox();
            return;
        }
        if (data.status === 400) {
            boxMessage(data.message);
            exitBox();
            return;
        }

        if (data.status === 406) {
            boxMessage(data.message);
            exitBox();
            return;
        }
    } catch (error) {
        console.error(error);
    }
};

const displayNewCategoria = () => {
    document.querySelector('.overlay').style.display = 'flex';
    const checkStatus = document.querySelector('#box-status-check');
    const status = document.querySelector('#box-new-categoria-status');

    checkStatus.addEventListener('click', () => {
        if (checkStatus.checked) {
            status.textContent = 'Status: Visível';
        } else {
            status.textContent = 'Status: Invisível';
        }
    });
};

const sendNewCategoria = async () => {
    const checkStatus = document.querySelector('#box-status-check');
    const inputName = document.querySelector('#input-nome');
    if (!inputName.value) {
        boxMessage('Digite um nome para a Categoria! ');
        inputName.style.border = '1px solid red';
        return;
    }
    const payload = {
        nome: inputName.value,
        status: checkStatus.checked,
    };

    const data = await createNewCategoria(payload);
    if (data.status === 400) {
        boxMessage(data.message);
        inputName.style.border = '1px solid red';
        return;
    }
    if (data.status === 406) {
        boxMessage(data.message);
        inputName.style.border = '1px solid red';
        inputName.value = '';
    }
    if (data.status === 201) {
        boxMessage(data.message);
        exitBox();
        await displayListCategoria();
    }
};
