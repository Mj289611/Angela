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

// 3. DATOS Y LOCALSTORAGE
let songs = JSON.parse(localStorage.getItem('user_songs')) || [
    { title: "M.A.I - Milo J", addedBy: "Su Niño 👦", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
];

let memories = JSON.parse(localStorage.getItem('user_memories')) || [
    "💗 Tu lugar seguro: Saber que soy tu niño y tú mi mami cura cualquier momento.",
    "✨ Tus caritas: Amo cuando te ves enojada y cómo me haces muecas.",
    "🌸 Tikitita: Me enamora lo tierna que eres en cada detalle."
];

let customMedia = JSON.parse(localStorage.getItem('user_media')) || [];

function renderSections() {
    // Música
    const musicList = document.getElementById('musicListContainer');
    musicList.innerHTML = '';
    songs.forEach((song, index) => {
        musicList.innerHTML += `
            <div class="music-card">
                <div>
                    <b>${song.title}</b>
                    <span style="display: block; font-size: 0.75rem; color: #ffb3c1;">Agregado por: ${song.addedBy}</span>
                </div>
                <div>
                    <a href="${song.url}" target="_blank" class="music-btn">Escuchar</a>
                    <button class="delete-btn" onclick="deleteSong(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    // Memorias / Textos (Con opción de editar directamente)
    const memList = document.getElementById('memoriesListContainer');
    memList.innerHTML = '';
    memories.forEach((mem, index) => {
        memList.innerHTML += `
            <div class="memory-item">
                <span>${mem}</span>
                <div>
                    <button class="delete-btn" onclick="editMemory(${index})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn" onclick="deleteMemory(${index})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function initDynamicMedia() {
    const slider = document.getElementById('mainSlider');
    customMedia.forEach(item => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (item.type && item.type.startsWith('video')) {
            slide.innerHTML = `<video src="${item.url}" autoplay muted loop playsinline></video>`;
        } else {
            slide.innerHTML = `<img src="${item.url}" alt="Recuerdo">`;
        }
        slider.appendChild(slide);
    });
}

// 4. CARRUSEL ALEATORIO
let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = Math.floor(Math.random() * slides.length);
    slides[currentSlide].classList.add('active');
}
setInterval(nextSlide, 4500);

// 5. ADMINISTRACIÓN Y ACCIONES
function toggleAdminPanel() {
    document.getElementById('adminPanel').classList.toggle('hidden');
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
        
        const slider = document.getElementById('mainSlider');
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (file.type.startsWith('video')) {
            slide.innerHTML = `<video src="${e.target.result}" autoplay muted loop playsinline></video>`;
        } else {
            slide.innerHTML = `<img src="${e.target.result}" alt="Foto">`;
        }
        slider.appendChild(slide);
        slides = document.querySelectorAll('.slide');
        
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

// 6. MODALES DE GALERÍA Y VISOR (Con soporte de borrado de archivos subidos y edición de texto)
let activeCustomIndex = null;

function openGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    // Fotos base de la carpeta img/ (Estas no se borran por ser fijas del proyecto)
    const defaultPhotos = [
        { url: 'img/foto.jpg', cap: 'Foto inicial' },
        { url: 'img/foto2.jpg', cap: 'Recuerdo 2' },
        { url: 'img/foto3.jpg', cap: 'Recuerdo 3' },
        { url: 'img/foto4.jpg', cap: 'Recuerdo 4' },
        { url: 'img/foto5.jpg', cap: 'Recuerdo 5' },
        { url: 'img/foto6.jpg', cap: 'Recuerdo 6' },
        { url: 'img/foto7.jpg', cap: 'Recuerdo 7' },
        { url: 'img/foto8.jpg', cap: 'Recuerdo 8' }
    ];

    defaultPhotos.forEach(p => {
        grid.innerHTML += `
            <div class="gallery-card" onclick="openViewer('${p.url}', 'image', '${p.cap}', null)">
                <img src="${p.url}" class="gallery-thumb" alt="Foto">
                <div class="gallery-caption">${p.cap}</div>
            </div>
        `;
    });

    customMedia.forEach((item, idx) => {
        let thumbHtml = (item.type && item.type.startsWith('video')) 
            ? `<video src="${item.url}" class="gallery-thumb"></video>` 
            : `<img src="${item.url}" class="gallery-thumb" alt="Subida">`;
        
        grid.innerHTML += `
            <div class="gallery-card">
                <button class="gallery-delete-btn" onclick="deleteCustomMedia(event, ${idx})" title="Eliminar foto/video"><i class="fa-solid fa-trash"></i></button>
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
        openGalleryModal(); // Recargar modal
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
    if (activeCustomIndex === null) {
        alert('Solo se pueden editar los textos de las fotos/videos subidos por ustedes.');
        return;
    }
    const currentCap = customMedia[activeCustomIndex].caption;
    const newCap = prompt('Editar texto de la foto/video:', currentCap);
    if (newCap !== null && newCap.trim() !== '') {
        customMedia[activeCustomIndex].caption = newCap.trim();
        localStorage.setItem('user_media', JSON.stringify(customMedia));
        document.getElementById('viewerCaptionText').innerText = newCap.trim();
        openGalleryModal(); // Actualizar galería de fondo
    }
}

// Inicializar
initDynamicMedia();
renderSections();
slides = document.querySelectorAll('.slide');
