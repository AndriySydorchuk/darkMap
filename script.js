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
            toggleListItemStyle(loots.randomChest, lootsShown);
            toggleListItemStyle(loots.goldChest, lootsShown);

            setAllLootsMarkers();

        } else {
            removeMarkers('[class$="chest-marker"]');
            toggleListItemStyle(lootsTitle, lootsShown);
            toggleListItemStyle(loots.randomChest, lootsShown);
            toggleListItemStyle(loots.goldChest, lootsShown);
        }
    });

    const loots = {
        randomChest: document.querySelector("body > aside > nav > ul.loots-list > li:nth-child(1)"),
        goldChest: document.querySelector("body > aside > nav > ul.loots-list > li:nth-child(2)"),
    };

    handleAllLootsLabels();

    const shrines = {
        speed: document.querySelector("body > aside > nav > ul.shrines-list > li:nth-child(1)"),
        strength: document.querySelector("body > aside > nav > ul.shrines-list > li:nth-child(2)"),
        defense: document.querySelector("body > aside > nav > ul.shrines-list > li:nth-child(3)"),
        resurrection: document.querySelector("body > aside > nav > ul.shrines-list > li:nth-child(4)"),
        health: document.querySelector("body > aside > nav > ul.shrines-list > li:nth-child(5)"),
    };

    const shrinesTitle = document.querySelector('.shrines-title');
    let shrinesShown = false;
    shrinesTitle.addEventListener('click', () => {
        shrinesShown = !shrinesShown;

        if (shrinesShown) {
            toggleListItemStyle(shrinesTitle, shrinesShown);

            toggleListItemStyle(shrines.speed, shrinesShown);
            toggleListItemStyle(shrines.strength, shrinesShown);
            toggleListItemStyle(shrines.defense, shrinesShown);
            toggleListItemStyle(shrines.resurrection, shrinesShown);
            toggleListItemStyle(shrines.health, shrinesShown);


            setAllShrineMarkers();

        } else {
            removeMarkers('[class$="shrine-marker"]');

            toggleListItemStyle(shrinesTitle, shrinesShown);

            toggleListItemStyle(shrines.speed, shrinesShown);
            toggleListItemStyle(shrines.strength, shrinesShown);
            toggleListItemStyle(shrines.defense, shrinesShown);
            toggleListItemStyle(shrines.resurrection, shrinesShown);
            toggleListItemStyle(shrines.health, shrinesShown);
        }
    });

    handleAllShrinesLabels();

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

    function handleAllShrinesLabels() {
        const shrineConfigs = [
            ['speed', '.speedshrine-marker', setSpeedMarkers],
            ['strength', '.strengthshrine-marker', setStrengthMarkers],
            ['defense', '.defenseshrine-marker', setDefenseMarkers],
            ['resurrection', '.resurrectionshrine-marker', setResurrectionMarkers],
            ['health', '.healthshrine-marker', setHealthMarkers],
        ];

        for (const [key, selector, fn] of shrineConfigs) {
            handleMarkerDisplay(shrines[key], selector, fn);
        }
    }

    function handleAllLootsLabels() {
        const lootConfigs = [
            ['randomChest', '.randomchest-marker', setRandomChestMarkers],
            ['goldChest', '.goldchest-marker', setGoldChestMarkers],
        ];

        for (const [key, selector, fn] of lootConfigs) {
            handleMarkerDisplay(loots[key], selector, fn);
        }
    }

    function toggleListItemStyle(item, status) {
        if (status) {
            item.style.textDecoration = 'none';
            item.style.color = 'rgb(221, 221, 221)';
        } else {
            item.style.textDecoration = 'line-through';
            item.style.color = 'gray';
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
        const coordinates = [
            [60, 60],
            [167, 100],
            [243, 105],
            [297, 76],
            [360, 55],
            [173, 185],
            [421, 178],
            [108, 238],
            [119, 300],
            [405, 388],
            [247, 438],
            [312, 408],
            [316, 411],];

        for (const coord of coordinates) {
            addMarker(coord[0], coord[1], '◇', 'randomchest-marker');
        }
    }

    function setGoldChestMarkers() {
        const coordinates = [
            [120, 184],
            [177, 178],
            [46, 252],
            [185, 356],
            [179, 400],
            [428, 423],];

        for (const coord of coordinates) {
            addMarker(coord[0], coord[1], '☆', 'goldchest-marker');
        }
    }

    function setLocationMarkers() {
        const coordinates = [
            [355, 380, 'остров черепа'],
            [410, 295, 'канава'],
            [315, 295, 'долина морских звёзд'],
            [260, 420, 'подводная пещера А'],
            [190, 400, 'заброшенный корабль'],
            [160, 410, 'вулкан'],
            [30, 390, 'пиратская тюрьма'],
            [135, 350, 'коралловый лес'],
            [70, 295, 'двойные камеры'],
            [70, 240, 'туманный дозор'],
            [5, 240, 'затонувший корабль'],
            [70, 180, 'гробница русалок'],
            [45, 80, 'убежище блейдхэнда'],
            [140, 110, 'нерестилище'],
            [190, 50, 'перевёрнутый корабль'],
            [190, 110, 'пристанище кораблей'],
            [255, 80, 'плавающая деревня'],
            [320, 110, 'морская крепость А'],
            [355, 30, 'нависший корабль'],
            [385, 100, 'матросская гостиница'],
            [385, 160, 'круглый остров'],
            [325, 200, 'слоновий остров'],
            [200, 240, 'голубая дыра'],
            [135, 180, 'скалистый остров'],
        ];

        for (const [x, y, name] of coordinates) {
            addMarker(x, y, name);
        }
    }

    function setSpeedMarkers() {
        const coordinates = [
            [234, 130],
            [410, 122],
            [119, 178],
            [51, 375],];

        for (const coord of coordinates) {
            addMarker(coord[0], coord[1], '⬤', 'speedshrine-marker');
        }
    }

    function setStrengthMarkers() {
        const coordinates = [
            [359, 302],
            [437, 416],];

        for (const coord of coordinates) {
            addMarker(coord[0], coord[1], '⬤', 'strengthshrine-marker');
        }
    }

    function setDefenseMarkers() {
        const coordinates = [
            [59, 234],
            [111, 232],
            [54, 403],];

        for (const coord of coordinates) {
            addMarker(coord[0], coord[1], '⬤', 'defenseshrine-marker');
        }
    }

    function setResurrectionMarkers() {
        const coordinates = [
            [97, 108],
            [180, 180],
            [351, 176],
            [178, 419],
            [400, 416],
            [308, 423],];

        for (const coord of coordinates) {
            addMarker(coord[0], coord[1], '⬤', 'resurrectionshrine-marker');
        }
    }

    function setHealthMarkers() {
        const coordinates = [
            [54, 59],
            [297, 76],
            [122, 181],
            [178, 356],
            [408, 403],];

        for (const coord of coordinates) {
            addMarker(coord[0], coord[1], '⬤', 'healthshrine-marker');
        }
    }

    function setAllShrineMarkers() {
        const markerSetters = [
            setSpeedMarkers,
            setStrengthMarkers,
            setDefenseMarkers,
            setResurrectionMarkers,
            setHealthMarkers,
        ];

        markerSetters.forEach(func => func());
    }

    function setAllLootsMarkers() {
        const markerSetters = [
            setRandomChestMarkers,
            setGoldChestMarkers,
        ];

        markerSetters.forEach(func => func());
    }

    function removeMarkers(className) {
        document.querySelectorAll(className).forEach(marker => marker.remove());
    }

});


