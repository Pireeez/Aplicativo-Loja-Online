const getProdutos = async () => {
    try {
        const data = await axios.get("/produto").then((res) => res.data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const displayListProduto = async () => {
    document.querySelector(".categorias-conteiner").style.display = "none";
    document.querySelector(".pedidos-conteiner").style.display = "none";
    document.querySelector(".produtos-conteiner").style.display = "block";
    try {
        const data = await getProdutos();
        const tbody = document.querySelector(".table tbody"); // seleciona o tbody real
        tbody.innerHTML = "";

        data.forEach((item) => {
            const tr = document.createElement("tr");

            for (key in item) {
                if (key === "imagem") continue;

                const td = document.createElement("td");

                if (key === "nome" || key === "descricao") {
                    td.textContent = limitaCaracter(item[key]);
                } else if (key === "preco") {
                    td.textContent = formataPreco(item[key]);
                } else if (key === "status") {
                    td.textContent = formataStatus(item[key]);
                    td.className = formataCor(td.textContent);
                } else {
                    td.textContent = item[key];
                }
                tr.appendChild(td);
            }

            // coluna com botão de ação
            const tdAcoes = document.createElement("td");
            const btnAction = document.createElement("img");
            btnAction.src = "./img/editSquare_categoria.png";
            tdAcoes.appendChild(btnAction);
            tr.appendChild(tdAcoes);
            tbody.appendChild(tr);

            btnAction.addEventListener("click", () => {});
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
    preco = preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return preco;
};

const formataStatus = (status) => {
    if (status === 1) {
        return (status = "Visível");
    }

    if (status === 0) {
        return (status = "Invisível");
    }
};

const formataCor = (statusCor) => {
    if (statusCor === "Visível") {
        return "status-color-green";
    }

    if (statusCor === "Invisível") {
        return "status-color-red";
    }
};
