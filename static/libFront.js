//exitBox apaga todas as informações dos campos do overlay e fecha
const exitBox = () => {
    // Esconde os overlays

    document.querySelector('#overlay-create-categoria').style.display = 'none';
    document.querySelector('#overlay-update-categoria').style.display = 'none';
    document.querySelector('#overlay-create-produto').style.display = 'none';
    document.querySelector('#overlay-update-produto').style.display = 'none';

    // Limpa todos os inputs, textareas e selects dentro dos overlays
    document
        .querySelectorAll(
            '.overlay input, .overlay textarea, .overlay select, ' +
                '.overlay-update input, .overlay-update textarea, .overlay-update select, ' +
                '.overlay-create-produto input, .overlay-create-produto textarea, .overlay-create-produto select'
        )
        .forEach((el) => {
            if (el.type === 'checkbox') {
                el.checked = false; // desmarca
            } else {
                el.value = ''; // limpa valor
            }
        });
    const preview = document.querySelector('#preview');
    if (preview) preview.src = '';
    //removo toda borda vermelha de input, textarea...
    document.querySelectorAll('input, textarea, select').forEach((el) => {
        el.style.border = '';
    });
};

const exitBoxMessage = () => {
    const box = document.getElementById('sucessBox');
    box.classList.remove('show');
    box.classList.remove();
};

//boxMessage exibe mensagem de status
const boxMessage = (message, status) => {
    const box = document.getElementById('sucessBox');
    const msg = document.getElementById('exibe-message');

    if (status === 201 || status === 200) {
        box.classList.add('sucess');
        msg.textContent = `${message}`;
        setTimeout(() => {
            box.classList.remove('sucess');
        }, 3000);
    } else {
        box.classList.add('error');
        msg.textContent = `${message}`;
        setTimeout(() => {
            box.classList.remove('error');
        }, 3000);
    }
};

//limitaCaracter
const limitaCaracter = (text) => {
    if (text.length > 20) {
        return (text = `${text.substring(0, 20)}...`);
    }
    return text;
};

//formata preço para REAL
const formataPreco = (preco) => {
    preco = preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return preco;
};

//formata Status para visível ou invisível
const formataStatus = (status) => {
    if (status === 1 || status === true) {
        return (status = 'Visível');
    }

    if (status === 0 || status === false) {
        return (status = 'Invisível');
    }
};

//formata cor de visível = green / invisível = red pela classname
const formataCor = (statusCor) => {
    if (statusCor === 'Visível') {
        return 'status-color-green';
    }

    if (statusCor === 'Invisível') {
        return 'status-color-red';
    }
};

//pega arquivo de imagem e exibe na tela e converte para envio de dados
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileElem');

///clicar na área abre o input
dropArea.addEventListener('click', () => fileInput.click());

//seleção via input
fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

//srrastar sobre a área
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('hover');
});

//sair da área sem soltar
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover');
});

//soltar arquivos
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('hover');
    handleFiles(e.dataTransfer.files);
});

//função interna para processar arquivo
function handleFiles(files) {
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        // Cria URL temporária para mostrar a imagem
        const preview = document.getElementById('preview');
        const imageURL = URL.createObjectURL(file);
        preview.src = imageURL;
    }
}
