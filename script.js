const fotos = document.querySelectorAll('.gallery div');

// =========================================================
// MODAL DAS FOTOS
// =========================================================

fotos.forEach(foto => {
    foto.addEventListener('click', () => {
        const src = foto.querySelector('img').getAttribute('src');

        const modal = document.createElement('div');
        modal.classList.add('modal');

        modal.innerHTML = `<img src="${src}" alt="Foto ampliada">`;

        document.body.appendChild(modal);
        modal.classList.add('show');

        foto.querySelector('img').style.transform = 'scale(1.2)';

        modal.addEventListener('click', () => {
            modal.classList.remove('show');

            setTimeout(() => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }

                foto.querySelector('img').style.transform = 'scale(1)';
            }, 300);
        });
    });
});


// =========================================================
// TROCA ALEATÓRIA DAS FOTOS
// =========================================================
//
// A posição dos blocos da galeria continua exatamente igual.
// O que muda é a foto dentro de cada bloco.
//
// Isso é importante porque o CSS usa nth-child() para definir
// o tamanho e a posição de cada espaço da galeria.
//

const imagens = Array.from(document.querySelectorAll('.gallery div img'));

const INTERVALO_TROCA = 4500; // 4,5 segundos
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

    const indiceA = escolherFotoAleatoria();
    const indiceB = escolherFotoAleatoria(indiceA);

    // Evita repetir exatamente o mesmo par da troca anterior.
    if (indiceA === ultimaFotoA && indiceB === ultimaFotoB) {
        return trocarFotos();
    }

    ultimaFotoA = indiceA;
    ultimaFotoB = indiceB;

    const fotoA = imagens[indiceA];
    const fotoB = imagens[indiceB];

    const srcA = fotoA.src;
    const altA = fotoA.alt;

    // Inicia a animação de saída.
    fotoA.classList.add('foto-trocando');
    fotoB.classList.add('foto-trocando');

    setTimeout(() => {
        // Troca somente as imagens.
        // Os blocos permanecem nos mesmos lugares.
        fotoA.src = fotoB.src;
        fotoA.alt = fotoB.alt;

        fotoB.src = srcA;
        fotoB.alt = altA;

        // Reinicia a animação para a entrada.
        fotoA.classList.remove('foto-trocando');
        fotoB.classList.remove('foto-trocando');

        void fotoA.offsetWidth;
        void fotoB.offsetWidth;

        fotoA.classList.add('foto-trocando');
        fotoB.classList.add('foto-trocando');

        setTimeout(() => {
            fotoA.classList.remove('foto-trocando');
            fotoB.classList.remove('foto-trocando');
        }, 700);
    }, 350);
}

window.addEventListener('load', () => {
    if (imagens.length > 1) {
        setInterval(trocarFotos, INTERVALO_TROCA);
    }
});
