const fotos = document.querySelectorAll('.gallery div');
const imagens = Array.from(document.querySelectorAll('.gallery div img'));

let modal = null;
let modalImg = null;
let indiceAtual = 0;

function criarModal() {
    if (modal) return;

    modal = document.createElement('div');
    modal.className = 'modal-galeria';

    modal.innerHTML = `
        <button class="modal-fechar" aria-label="Fechar">&times;</button>
        <button class="modal-nav modal-anterior" aria-label="Foto anterior">&#10094;</button>
        <div class="modal-imagem-area">
            <img class="modal-imagem" src="" alt="Foto ampliada">
            <span class="modal-contador"></span>
        </div>
        <button class="modal-nav modal-proxima" aria-label="Próxima foto">&#10095;</button>
    `;

    document.body.appendChild(modal);
    modalImg = modal.querySelector('.modal-imagem');

    modal.querySelector('.modal-fechar').addEventListener('click', fecharModal);

    modal.querySelector('.modal-anterior').addEventListener('click', (e) => {
        e.stopPropagation();
        mudarFoto(-1);
    });

    modal.querySelector('.modal-proxima').addEventListener('click', (e) => {
        e.stopPropagation();
        mudarFoto(1);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-imagem-area')) {
            fecharModal();
        }
    });
}

function abrirModal(indice) {
    criarModal();
    indiceAtual = indice;
    atualizarModal();
    modal.classList.add('ativo');
    document.body.classList.add('modal-aberto');
}

function atualizarModal(direcao = 0) {
    const foto = imagens[indiceAtual];
    if (!foto || !modalImg) return;

    modalImg.classList.remove('troca-modal');

    if (direcao !== 0) {
        void modalImg.offsetWidth;
        modalImg.classList.add('troca-modal');
    }

    modalImg.src = foto.src;
    modalImg.alt = foto.alt || 'Foto ampliada';

    const contador = modal.querySelector('.modal-contador');
    if (contador) contador.textContent = `${indiceAtual + 1} / ${imagens.length}`;
}

function mudarFoto(direcao) {
    if (!imagens.length) return;

    indiceAtual += direcao;

    if (indiceAtual >= imagens.length) indiceAtual = 0;
    if (indiceAtual < 0) indiceAtual = imagens.length - 1;

    atualizarModal(direcao);
}

function fecharModal() {
    if (!modal) return;
    modal.classList.remove('ativo');
    document.body.classList.remove('modal-aberto');
}

fotos.forEach((foto, indice) => {
    foto.addEventListener('click', () => abrirModal(indice));
});

document.addEventListener('keydown', (event) => {
    if (!modal || !modal.classList.contains('ativo')) return;

    if (event.key === 'Escape') fecharModal();
    if (event.key === 'ArrowRight') mudarFoto(1);
    if (event.key === 'ArrowLeft') mudarFoto(-1);
});


// TROCA ALEATÓRIA DAS FOTOS
const INTERVALO_TROCA = 3000;
let ultimaFotoA = -1;
let ultimaFotoB = -1;

function escolherFotoAleatoria(excluir = -1) {
    let indice;
    do {
        indice = Math.floor(Math.random() * imagens.length);
    } while (indice === excluir && imagens.length > 1);
    return indice;
}

function trocarFotos() {
    if (imagens.length < 2) return;

    let indiceA = escolherFotoAleatoria();
    let indiceB = escolherFotoAleatoria(indiceA);

    if (indiceA === ultimaFotoA && indiceB === ultimaFotoB) return;

    ultimaFotoA = indiceA;
    ultimaFotoB = indiceB;

    const fotoA = imagens[indiceA];
    const fotoB = imagens[indiceB];

    const srcA = fotoA.src;
    const altA = fotoA.alt;

    fotoA.classList.add('foto-trocando');
    fotoB.classList.add('foto-trocando');

    setTimeout(() => {
        fotoA.src = fotoB.src;
        fotoA.alt = fotoB.alt;
        fotoB.src = srcA;
        fotoB.alt = altA;

        setTimeout(() => {
            fotoA.classList.remove('foto-trocando');
            fotoB.classList.remove('foto-trocando');
        }, 350);
    }, 350);
}

window.addEventListener('load', () => {
    if (imagens.length > 1) setInterval(trocarFotos, INTERVALO_TROCA);
});


// SWIPE NO CELULAR
let toqueInicialX = 0;

document.addEventListener('touchstart', (event) => {
    if (!modal || !modal.classList.contains('ativo')) return;
    toqueInicialX = event.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (event) => {
    if (!modal || !modal.classList.contains('ativo')) return;

    const toqueFinalX = event.changedTouches[0].screenX;
    const distancia = toqueFinalX - toqueInicialX;

    if (Math.abs(distancia) < 50) return;

    mudarFoto(distancia < 0 ? 1 : -1);
}, { passive: true });

