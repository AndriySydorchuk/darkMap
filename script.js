document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main');

    const mapContainer = document.querySelector('.map-container');
    const mapInner = document.querySelector('.map-inner');
    const mapImg = document.querySelector('.map-img');
    const mapGrid = document.querySelector('.map-grid');

    const locationsTitle = document.querySelector('.locations-title');
    
    let scale = 1;
    let markerScale = 1;
    let translateX = 0;
    let translateY = 0;
    
    let showingGrid = false;

    mapImg.addEventListener('dragstart', e => e.preventDefault());
    mapGrid.addEventListener('dragstart', e => e.preventDefault());

    locationsTitle.addEventListener('click', () => {
        showingGrid = !showingGrid;

        if (showingGrid) {
            mapImg.style.opacity = 0;
            mapGrid.style.opacity = 1;
            mapImg.style.display = 'none';
            mapGrid.style.display = 'inline-block';
            locationsTitle.style.textDecoration = 'line-through';
            locationsTitle.style.color = 'gray';

            addMarker(355, 380, 'остров черепа');
            addMarker(410, 295, 'канава');
            addMarker(315, 295, 'долина морских звёзд');
            addMarker(260, 420, 'подводная пещера А');
            addMarker(190, 400, 'заброшенный корабль');
            addMarker(160, 410, 'вулкан');
            addMarker(30, 390, 'пиратская тюрьма');
            addMarker(135, 350, 'коралловый лес');
            addMarker(70, 295, 'двойные камеры');
            addMarker(70, 240, 'туманный дозор');
            addMarker(5, 240, 'затонувший корабль');
            addMarker(70, 180, 'гробница русалок');
            addMarker(45, 80, 'убежище блейдхэнда');
            addMarker(140, 110, 'нерестилище');
            addMarker(190, 50, 'перевёрнутый корабль');
            addMarker(190, 110, 'пристанище кораблей');
            addMarker(255, 80, 'плавающая деревня');
            addMarker(320, 110, 'морская крепость А');
            addMarker(355, 30, 'нависший корабль');
            addMarker(385, 100, 'матросская гостиница');
            addMarker(385, 160, 'круглый остров');
            addMarker(325, 200, 'слоновий остров');
            addMarker(200, 240, 'голубая дыра');
            addMarker(135, 180, 'скалистый остров');


        } else {
            mapImg.style.opacity = 1;
            mapGrid.style.opacity = 0;
            mapImg.style.display = 'inline-block';
            mapGrid.style.display = 'none';
            locationsTitle.style.textDecoration = 'none';
            locationsTitle.style.color = 'rgb(221, 221, 221)';
            document.querySelectorAll('.map-marker').forEach(marker => marker.remove());
        }
    });

    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();

        const rect = mapInner.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const prevScale = scale;
        const zoomSpeed = 0.1;
        const zoomFactor = e.deltaY < 0 ? 1 + zoomSpeed : 1 - zoomSpeed;

        scale = Math.min(Math.max(scale * zoomFactor, 0.2), 10);

        const worldX = (mouseX - translateX) / prevScale;
        const worldY = (mouseY - translateY) / prevScale;

        translateX = mouseX - worldX * scale;
        translateY = mouseY - worldY * scale;

        markerScale = 1 / scale;
        markerScale = Math.min(Math.max(markerScale, 0.1), 10);

        updateTransform();
    });

    let isDragging = false;
    let startX, startY;

    mapContainer.addEventListener('mousedown', (e) => {
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
        mapInner.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

        document.querySelectorAll('.map-marker').forEach(marker => {
            marker.style.transform = `scale(${markerScale})`;
        });
    }

    function addMarker(x, y, text) {
        const span = document.createElement('span');
        span.classList.add('map-marker');
        span.style.left = x + 'px';
        span.style.top = y + 'px';
        span.textContent = text;
        mapInner.appendChild(span);
    };

    const sidebar = document.querySelector('.sidebar');
    const toggleSidebar = document.querySelector('.toggleSidebar');
    let toggledSidebar = false;

    toggleSidebar.addEventListener('click', () => {
        toggledSidebar = !toggledSidebar;
        
        if(toggledSidebar) {
            toggleSidebar.style.transform = 'scaleX(-1)';
            toggleSidebar.style.left = '0';
            sidebar.classList.add('collapsed');
        } else {
            toggleSidebar.style.transform = '';
            toggleSidebar.style.left = '442px';
            sidebar.classList.remove('collapsed');
        }
        
    });


});


