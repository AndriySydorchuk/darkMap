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

    function centerMap() {
        const containerRect = mapContainer.getBoundingClientRect();
        const mapWidth = 500 * scale;
        const mapHeight = 500 * scale;
        translateX = (containerRect.width - mapWidth) / 2;
        translateY = (containerRect.height - mapHeight) / 2;
        updateTransform();
    }

    setTimeout(centerMap, 0);

    mapImg.addEventListener('dragstart', e => e.preventDefault());
    mapGrid.addEventListener('dragstart', e => e.preventDefault());

    locationsTitle.addEventListener('click', () => {
        showingGrid = !showingGrid;

        if (showingGrid) {
            toggleMapStyle(showingGrid);
            toggleListItemStyle(locationsTitle, showingGrid);

            setLocationMarkers();
        } else {
            toggleMapStyle(showingGrid);
            toggleListItemStyle(locationsTitle, showingGrid);

            removeMarkers('.map-marker');
        }
    });

    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();

        const rect = mapContainer.getBoundingClientRect();
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

        document.querySelectorAll('[class$="-marker"]').forEach(marker => {
            marker.style.transform = `scale(${markerScale})`;
        });
    }

    function addMarker(x, y, text, className = 'map-marker') {
        const span = document.createElement('span');
        span.classList.add(className);
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

        if (toggledSidebar) {
            toggleSidebar.style.transform = 'scaleX(-1)';
            toggleSidebar.style.left = '0';
            sidebar.classList.add('collapsed');
        } else {
            toggleSidebar.style.transform = '';
            toggleSidebar.style.left = '442px';
            sidebar.classList.remove('collapsed');
        }

    });

    const lootsTitle = document.querySelector('.loots-title');
    let lootsShown = false;
    lootsTitle.addEventListener('click', () => {
        lootsShown = !lootsShown;

        if (lootsShown) {
            toggleListItemStyle(lootsTitle, lootsShown);

            setRandomChestMarkers();
            setGoldChestMarkers();

        } else {
            removeMarkers('[class$="chest-marker"]');
            toggleListItemStyle(lootsTitle, lootsShown);
            toggleListItemStyle(randomChest, lootsShown);
        }
    });

    const randomChest = document.querySelector("body > aside > nav > ul.loots-list > li:nth-child(1)");
    handleMarkerDisplay(randomChest, '.randomchest-marker', setRandomChestMarkers);

    const goldChest = document.querySelector("body > aside > nav > ul.loots-list > li:nth-child(2)");
    handleMarkerDisplay(goldChest, '.goldchest-marker', setGoldChestMarkers);

    function handleMarkerDisplay(itemToDisplay, markerClass, setMarkersFunction) {
        let markerShown = false;
        itemToDisplay.addEventListener('click', () => {
            markerShown = !markerShown;

            if (markerShown) {
                toggleListItemStyle(itemToDisplay, markerShown);
                setMarkersFunction();
            } else {
                removeMarkers(markerClass);
                toggleListItemStyle(itemToDisplay, markerShown);
            }

        });
    }

    function removeMarkers(className) {
        document.querySelectorAll(className).forEach(marker => marker.remove());
    }

    function toggleListItemStyle(item, status) {
        if (status) {
            item.style.textDecoration = 'line-through';
            item.style.color = 'gray';
        } else {
            item.style.textDecoration = 'none';
            item.style.color = 'rgb(221, 221, 221)';
        }
    }

    function toggleMapStyle(status) {
        if (status) {
            mapImg.style.opacity = 0;
            mapGrid.style.opacity = 1;
            mapImg.style.display = 'none';
            mapGrid.style.display = 'inline-block';
        } else {
            mapImg.style.opacity = 1;
            mapGrid.style.opacity = 0;
            mapImg.style.display = 'inline-block';
            mapGrid.style.display = 'none';
        }
    }

    function setRandomChestMarkers() {
        addMarker(60, 60, '◇', 'randomchest-marker');
        addMarker(167, 100, '◇', 'randomchest-marker');
        addMarker(243, 105, '◇', 'randomchest-marker');
        addMarker(297, 76, '◇', 'randomchest-marker');
        addMarker(360, 55, '◇', 'randomchest-marker');
        addMarker(173, 185, '◇', 'randomchest-marker');
        addMarker(421, 178, '◇', 'randomchest-marker');
        addMarker(108, 238, '◇', 'randomchest-marker');
        addMarker(119, 300, '◇', 'randomchest-marker');
        addMarker(405, 388, '◇', 'randomchest-marker');
        addMarker(405, 388, '◇', 'randomchest-marker');
        addMarker(247, 438, '◇', 'randomchest-marker');
        addMarker(312, 408, '◇', 'randomchest-marker');
        addMarker(316, 411, '◇', 'randomchest-marker');
    }

    function setGoldChestMarkers() {
        addMarker(120, 184, '☆', 'goldchest-marker');
        addMarker(177, 178, '☆', 'goldchest-marker');
        addMarker(46, 252, '☆', 'goldchest-marker');
        addMarker(46, 252, '☆', 'goldchest-marker');
        addMarker(185, 356, '☆', 'goldchest-marker');
        addMarker(179, 400, '☆', 'goldchest-marker');
        addMarker(428, 423, '☆', 'goldchest-marker');
    }

    function setLocationMarkers() {
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
    }


});


