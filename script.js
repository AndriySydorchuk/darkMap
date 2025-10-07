document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main');
    const mapImg = document.querySelector('.map-img');
    const mapGrid = document.querySelector('.map-grid');
    const locationsTitle = document.querySelector('.locations-title');
    let scale = 1;
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
        } else {
            mapImg.style.opacity = 1;
            mapGrid.style.opacity = 0;
            mapImg.style.display = 'inline-block';
            mapGrid.style.display = 'none';
        }

        showingGrid ? locationsTitle.style.textDecoration = 'line-through' : locationsTitle.style.textDecoration = 'none';
        showingGrid ? locationsTitle.style.color = 'gray' : locationsTitle.style.color = 'rgb(221, 221, 221)';
    });

    main.addEventListener('wheel', (e) => {
        e.preventDefault();

        const rect = mapImg.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const prevScale = scale;
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(scale, 0.5), 5);

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
        const transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        mapImg.style.transform = transform;
        mapGrid.style.transform = transform;
        mapImg.style.transformOrigin = '0 0';
        mapGrid.style.transformOrigin = '0 0';
    }

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
