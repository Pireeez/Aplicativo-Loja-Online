const exitBox = () => {
    // Esconde os overlays
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".overlay-update").style.display = "none";
    document.querySelector(".overlay-create-produto").style.display = "none";
};

const boxMessage = (message) => {
    const box = document.getElementById("sucessBox");
    box.classList.add("show");
    box.textContent = `${message}`;
    setTimeout(() => {
        box.classList.remove("show");
        setTimeout(() => {
            box.classList.remove();
        }, 500);
    }, 3000);
};
