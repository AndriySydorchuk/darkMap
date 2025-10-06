document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main');
    const mapImg = document.querySelector('.map-img');
    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    mapImg.addEventListener('dragstart', e => e.preventDefault());

    main.addEventListener('wheel', (e) => {
        e.preventDefault();

        const rect = mapImg.getBoundingClientRect();
        const offsetX = e.clientX - rect.left; // позиція курсора на зображенні
        const offsetY = e.clientY - rect.top;

        const prevScale = scale;
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(scale, 0.5), 5);

        // Розрахунок нових зсувів (щоб zoom не “стрибав”)
        const zoomFactor = scale / prevScale;
        translateX -= (offsetX - translateX) * (zoomFactor - 1);
        translateY -= (offsetY - translateY) * (zoomFactor - 1);

        updateTransform();
    }, { passive: false });

    let isDragging = false;
    let startX, startY;

    main.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        main.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        main.style.cursor = 'grab';
    });

    function updateTransform() {
        mapImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        mapImg.style.transformOrigin = '0 0';
    }
});
