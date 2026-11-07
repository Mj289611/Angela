// 1. Contador de tiempo exacto
const startDate = new Date('2026-04-18T00:00:00');

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    if (diff < 0) return;

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const daysTotal = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(daysTotal / 365);
    const months = Math.floor((daysTotal % 365) / 30);
    const days = Math.floor((daysTotal % 365) % 30);

    document.getElementById('years').innerText = years;
    document.getElementById('months').innerText = months;
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('minutes').innerText = minutes;
    document.getElementById('seconds').innerText = seconds;
}
setInterval(updateCounter, 1000);
updateCounter();

// 2. Corazones flotantes
function createHeart() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerText = '💗';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}
setInterval(createHeart, 400);

// 3. DATOS Y LOCALSTORAGE (100% Dinámicos, sin carpetas fijas)
let songs = JSON.parse(localStorage.getItem('user_songs')) || [];
let memories = JSON.parse(localStorage.getItem('user_memories')) || [];
let customMedia = JSON.parse(localStorage.getItem('user_media')) || [];

// Convertir links de Spotify o YouTube a reproductor embebido + botón oficial
function getMusicEmbedHtml(url) {
    if (!url) return '';
    let embedHtml = '';
    
    // Spotify
    if (url.includes('spotify.com')) {
        const match = url.match(/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
        if (match) {
            embedHtml = `<iframe src="https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="border-radius:12px; margin-top:8px;"></iframe>`;
        }
    }
    // YouTube
    else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1]?.split('&')[0];
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        }
        if (videoId) {
            embedHtml = `<iframe width="100%" height="80" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:12px; margin-top:8px;"></iframe>`;
        }
    }

    return `
        ${embedHtml}
        <div style="margin-top: 8px; text-align: right;">
            <a href="${url}" target="_blank" class="music-btn"><i class="fa-solid fa-external-link-alt"></i> Abrir en App / Página Oficial</a>
        </div>
    `;
}

function renderSections() {
    // Música
    const musicList = document.getElementById('musicListContainer');
    if (musicList) {
        musicList.innerHTML = '';
        if (songs.length === 0) {
            musicList.innerHTML = '<p style="color: #a0a0b0; font-size: 0.85rem;">No hay canciones agregadas aún.</p>';
        } else {
            songs.forEach((song, index) => {
                musicList.innerHTML += `
                    <div class="music-card">
                        <div class="music-info">
                            <div>
                                <b>${song.title}</b>
                                <span style="display: block; font-size: 0.75rem; color: #ffb3c1;">Agregado por: ${song.addedBy}</span>
                            </div>
                            <button class="delete-btn" onclick="deleteSong(${index})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <div style="width: 100%;">
                            ${getMusicEmbedHtml(song.url)}
                        </div>
                    </div>
                `;
            });
        }
    }

    // Textos / Memorias
    const memList = document.getElementById('memoriesListContainer');
    if (memList) {
        memList.innerHTML = '';
        if (memories.length === 0) {
            memList.innerHTML = '<p style="color: #a0a0b0; font-size: 0.85rem;">No hay textos agregados aún.</p>';
        } else {
            memories.forEach((mem, index) => {
                memList.innerHTML += `
                    <div class="memory-item">
                        <span style="width: 80%; text-align: left;">${mem}</span>
                        <div>
                            <button class="delete-btn" onclick="editMemory(${index})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                            <button class="delete-btn" onclick="deleteMemory(${index})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });
        }
    }
}

function initDynamicMedia() {
    const slider = document.getElementById('mainSlider');
    if (!slider) return;
    slider.innerHTML = '';

    if (customMedia.length === 0) {
        slider.innerHTML = `<div class="slide active"><div class="empty-slide">Sube fotos o videos para verlos aquí 💗</div></div>`;
        slides = document.querySelectorAll('.slide');
        return;
    }

    customMedia.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (index === 0) slide.classList.add('active');

        if (item.type && item.type.startsWith('video')) {
            slide.innerHTML = `<video src="${item.url}" autoplay muted loop playsinline></video>`;
        } else {
            slide.innerHTML = `<img src="${item.url}" alt="Recuerdo">`;
        }
        slider.appendChild(slide);
    });
    slides = document.querySelectorAll('.slide');
}

// 4. CARRUSEL ALEATORIO
let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    if (slides.length <= 1) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = Math.floor(Math.random() * slides.length);
    slides[currentSlide].classList.add('active');
}
setInterval(nextSlide, 4500);

// 5. ADMINISTRACIÓN
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('hidden');
    panel.scrollIntoView({ behavior: 'smooth' });
}

function uploadMediaFile() {
    const fileInput = document.getElementById('mediaInput');
    const captionInput = document.getElementById('mediaCaption');
    const file = fileInput.files[0];
    if (!file) return alert('Selecciona un archivo');

    const reader = new FileReader();
    reader.onload = function(e) {
        const mediaData = { 
            id: Date.now(),
            url: e.target.result, 
            type: file.type, 
            caption: captionInput.value || 'Recuerdo especial 💗' 
        };
        customMedia.push(mediaData);
        localStorage.setItem('user_media', JSON.stringify(customMedia));
        
        initDynamicMedia();
        fileInput.value = '';
        captionInput.value = '';
        alert('¡Guardado con éxito!');
    };
    reader.readAsDataURL(file);
}

function addSong() {
    const title = document.getElementById('songTitle').value;
    const addedBy = document.getElementById('songAddedBy').value || 'Amor';
    const url = document.getElementById('songUrl').value;
    if (!title || !url) return alert('Llena el título y el enlace');
    
    songs.push({ title, addedBy, url });
    localStorage.setItem('user_songs', JSON.stringify(songs));
    renderSections();
    document.getElementById('songTitle').value = '';
    document.getElementById('songUrl').value = '';
    alert('¡Canción guardada con éxito!');
}

function deleteSong(index) {
    if (confirm('¿Seguro que deseas eliminar esta canción?')) {
        songs.splice(index, 1);
        localStorage.setItem('user_songs', JSON.stringify(songs));
        renderSections();
    }
}

function addMemory() {
    const text = document.getElementById('memoryText').value;
    if (!text) return alert('Escribe un texto');
    memories.push(text);
    localStorage.setItem('user_memories', JSON.stringify(memories));
    renderSections();
    document.getElementById('memoryText').value = '';
    alert('¡Texto guardado con éxito!');
}

function editMemory(index) {
    const newText = prompt('Edita el texto del momento:', memories[index]);
    if (newText !== null && newText.trim() !== '') {
        memories[index] = newText.trim();
        localStorage.setItem('user_memories', JSON.stringify(memories));
        renderSections();
    }
}

function deleteMemory(index) {
    if (confirm('¿Seguro que deseas eliminar este momento?')) {
        memories.splice(index, 1);
        localStorage.setItem('user_memories', JSON.stringify(memories));
        renderSections();
    }
}

// 6. MODAL DE GALERÍA COMPLETA
let activeCustomIndex = null;

function openGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    if (customMedia.length === 0) {
        grid.innerHTML = '<p style="grid-column: span 2; color: #a0a0b0; font-size: 0.85rem;">No hay fotos o videos subidos todavía.</p>';
    }

    customMedia.forEach((item, idx) => {
        let isVideo = item.type && item.type.startsWith('video');
        let thumbHtml = isVideo 
            ? `<video src="${item.url}" class="gallery-thumb"></video>` 
            : `<img src="${item.url}" class="gallery-thumb" alt="Subida">`;
        
        grid.innerHTML += `
            <div class="gallery-card">
                <button class="gallery-delete-btn" onclick="deleteCustomMedia(event, ${idx})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                <div onclick="openViewer('${item.url}', '${item.type || 'image'}', '${item.caption}', ${idx})">
                    ${thumbHtml}
                    <div class="gallery-caption">${item.caption}</div>
                </div>
            </div>
        `;
    });

    modal.classList.remove('hidden');
}

function closeGalleryModal() {
    document.getElementById('galleryModal').classList.add('hidden');
}

function deleteCustomMedia(event, index) {
    event.stopPropagation();
    if (confirm('¿Deseas eliminar este archivo de la galería?')) {
        customMedia.splice(index, 1);
        localStorage.setItem('user_media', JSON.stringify(customMedia));
        initDynamicMedia();
        openGalleryModal();
    }
}

function openViewer(url, type, caption, customIndex) {
    activeCustomIndex = customIndex;
    const viewerModal = document.getElementById('viewerModal');
    const container = document.getElementById('viewerContainer');
    const captionEl = document.getElementById('viewerCaptionText');
    
    container.innerHTML = '';
    if (type && (type.startsWith('video') || type === 'video')) {
        container.innerHTML = `<video src="${url}" controls autoplay></video>`;
    } else {
        container.innerHTML = `<img src="${url}" alt="Ampliada">`;
    }
    captionEl.innerText = caption;
    viewerModal.classList.remove('hidden');
}

function closeViewerModal() {
    document.getElementById('viewerModal').classList.add('hidden');
}

function enableEditCaption() {
    if (activeCustomIndex === null) return;
    const currentCap = customMedia[activeCustomIndex].caption;
    const newCap = prompt('Editar texto de la foto/video:', currentCap);
    if (newCap !== null && newCap.trim() !== '') {
        customMedia[activeCustomIndex].caption = newCap.trim();
        localStorage.setItem('user_media', JSON.stringify(customMedia));
        document.getElementById('viewerCaptionText').innerText = newCap.trim();
        openGalleryModal();
    }
}

// Inicialización
initDynamicMedia();
renderSections();
