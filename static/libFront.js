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
};

const boxMessage = (message) => {
    const box = document.getElementById('sucessBox');
    box.classList.add('show');
    box.textContent = `${message}`;
    setTimeout(() => {
        box.classList.remove('show');
        setTimeout(() => {
            box.classList.remove();
        }, 1000);
    }, 3000);
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
    if (status === 1 || status === true) {
        return (status = 'Visível');
    }

    if (status === 0 || status === false) {
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

//Pega arquivo de imagem e exibe na tela e converte para envio de dados//
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
