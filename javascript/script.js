const textEl = document.querySelector('.p-interativo');
const originalText = textEl.innerText;
textEl.innerHTML = '';

originalText.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char === ' ' ? '\u00A0' : char; 
    textEl.appendChild(span);
});

const spans = textEl.querySelectorAll('span');

textEl.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    spans.forEach(span => {
        const rect = span.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const distX = mouseX - charX;
        const distY = mouseY - charY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 70) { // Raio de aproximação do mouse
            const force = (70 - distance) / 70;
            const moveX = (distX / distance) * force * -30; // Empurra horizontalmente
            const moveY = (distY / distance) * force * -30; // Empurra verticalmente

            span.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.3) rotate(${moveX * 0.6}deg)`;
            span.style.color = '#38b2ac';
            span.style.textShadow = '0 0 12px #38b2ac';
        }
    });
});

textEl.addEventListener('mouseleave', () => {
    spans.forEach(span => {
        span.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
        span.style.color = '';
        span.style.textShadow = '';
    });
});

// ==========================================
// CONTROLE DO CARROSSEL DA SEÇÃO SOBRE
// ==========================================
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));


// ==========================================
// SISTEMA DE TRANSIÇÃO CINEASTA ENTRE SEÇÕES
// ==========================================
const sections = document.querySelectorAll('.section-page');
const menuLinks = document.querySelectorAll('.hotbar a');
let activeSectionIndex = 0;
let isTransitioning = false;

// Função principal que muda a tela aplicando a animação
function changePage(targetIndex) {
    if (targetIndex < 0 || targetIndex >= sections.length || isTransitioning) return;
    
    isTransitioning = true;
    
    // Tira o foco/visibilidade da seção antiga
    sections[activeSectionIndex].classList.remove('active');
    
    activeSectionIndex = targetIndex;
    
    // Aplica o efeito elegante e foca na nova página
    setTimeout(() => {
        sections[activeSectionIndex].classList.add('active');
        window.scrollTo({ top: 0 });
        isTransitioning = false;
    }, 150); // Delay suave para sincronizar o efeito de encolhimento
}

// 1. Escutando cliques nos links do menu superior (Hotbar)
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetIndex = Array.from(sections).findIndex(s => `#${s.id}` === targetId);
            if (targetIndex !== -1) changePage(targetIndex);
        }
    });
});

// 2. Escutando o scroll (roda do mouse) para PCs
window.addEventListener('wheel', (e) => {
    if (isTransitioning) return;
    if (e.deltaY > 50) {
        changePage(activeSectionIndex + 1); // Rola para baixo
    } else if (e.deltaY < -50) {
        changePage(activeSectionIndex - 1); // Rola para cima
    }
}, { passive: true });

// 3. Escutando gestos de arrastar em Celulares/Touchscreens
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
    if (isTransitioning) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;

    if (diffY > 80) {
        changePage(activeSectionIndex + 1); // Arrastou para cima -> Próxima página
    } else if (diffY < -80) {
        changePage(activeSectionIndex - 1); // Arrastou para baixo -> Página anterior
    }
}, { passive: true });

