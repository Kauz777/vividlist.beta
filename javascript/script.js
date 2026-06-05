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