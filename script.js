// CONFIGURACIÓN DE LA NUBE (Contenedor Público)
const BIN_ID = '6aef8cebac6210605a760ed9';
const API_KEY = '$2a$10$xHfX7upHfmUF69uILZpbqu5B.RSSjsnZj2goZ3GamhiOHLuKa/MUG';

let dbData = { songs: [], memories: [], media: [] };

// Cargar datos desde la nube (JSONBin v3 Público)
async function loadFromCloud() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY
            }
        });
        if (response.ok) {
            const result = await response.json();
            dbData = result.record || { songs: [], memories: [], media: [] };
            renderEverything();
        } else {
            console.error("Error al cargar la nube:", response.status);
        }
    } catch (e) {
        console.error("Error de red al cargar:", e);
    }
}

// Guardar datos en la nube de forma permanente
async function saveToCloud() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(dbData)
        });
        if (!response.ok) {
            console.error("Error al guardar en la nube:", response.status);
        }
    } catch (e) {
        console.error("Error de red al guardar:", e);
    }
}

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

// Reproductor de Música Embebido
function getMusicEmbedHtml(url) {
    if (!url) return '';
    let embedHtml = '';
    
    if (url.includes('spotify.com')) {
        const match = url.match(/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
        if (match) {
            embedHtml = `<iframe src="https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0" width="100%" height="80" style="border:0; border-radius:12px; margin-top:8px;" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
        }
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1]?.split('&')[0];
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        }
        if (videoId) {
            embedHtml = `<iframe width="100%" height="80" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" style="border:0; border-radius:12px; margin-top:8px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
    }

    return `
        ${embedHtml}
        <div style="margin-top: 8px; text-align: right;">
            <a href="${url}" target="_blank" class="music-btn"><i class="fa-solid fa-external-link-alt"></i> Abrir en App / Página Oficial</a>
        </div>
    `;
}

function renderEverything() {
    renderMusicModalList();
    renderTextsModalList();
    initDynamicMedia();
}

function renderMusicModalList() {
    const musicList = document.getElementById('musicModalList');
    if (!musicList) return;
    musicList.innerHTML = '';
    if (!dbData.songs || dbData.songs.length === 0) {
        musicList.innerHTML = '<p style="color: #a0a0b0; font-size: 0.85rem;">No hay canciones agregadas aún.</p>';
        return;
    }
    dbData.songs.forEach((song, index) => {
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

function renderTextsModalList() {
    const memList = document.getElementById('textsModalList');
    if (!memList) return;
    memList.innerHTML = '';
    if (!dbData.memories || dbData.memories.length === 0) {
        memList.innerHTML = '<p style="color: #a0a0b0; font-size: 0.85rem;">No hay textos agregados aún.</p>';
        return;
    }
    dbData.memories.forEach((mem, index) => {
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

function initDynamicMedia() {
    const slider = document.getElementById('mainSlider');
    if (!slider) return;
    slider.innerHTML = '';

    if (!dbData.media || dbData.media.length === 0) {
        slider.innerHTML = `<div class="slide active"><div class="empty-slide">Sube fotos o videos desde tu cel para verlos aquí 💗</div></div>`;
        slides = document.querySelectorAll('.slide');
        return;
    }

    dbData.media.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (index === 0) slide.classList.add('active');

        if (item.type === 'video' || (item.url && item.url.startsWith('data:video'))) {
            slide.innerHTML = `<video src="${item.url}" autoplay muted loop playsinline></video>`;
        } else {
            slide.innerHTML = `<img src="${item.url}" alt="Recuerdo">`;
        }
        slider.appendChild(slide);
    });
    slides = document.querySelectorAll('.slide');
}

// Carrusel Aleatorio
let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    if (slides.length <= 1) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = Math.floor(Math.random() * slides.length);
    slides[currentSlide].classList.add('active');
}
setInterval(nextSlide, 4500);

// Panel Admin (Hasta abajo)
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('hidden');
    panel.scrollIntoView({ behavior: 'smooth' });
}

// Subida local optimizada con ultra compresión automática (Adiós errores de red)
async function uploadMediaFile() {
    const fileInput = document.getElementById('mediaFileInput');
    const captionInput = document.getElementById('mediaCaption').value.trim();

    if (!fileInput.files || fileInput.files.length === 0) {
        return alert('Por favor selecciona una foto o video de tu galería.');
    }

    const file = fileInput.files[0];
    let type = 'image';
    if (file.type.startsWith('video') || file.name.match(/\.(mp4|webm|ogg)$/i)) {
        type = 'video';
    }

    alert('Procesando y guardando recuerdo... Un momento 💗');

    if (type === 'video') {
        const reader = new FileReader();
        reader.onload = async function(event) {
            await saveMediaToDb(event.target.result, type, captionInput, fileInput);
        };
        reader.readAsDataURL(file);
    } else {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = async function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxWidth = 600; // Ancho perfecto para mantener peso mínimo y calidad óptima

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Comprimir al 60% para que el archivo sea súper ligero
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.60);
                await saveMediaToDb(compressedDataUrl, 'image', captionInput, fileInput);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function saveMediaToDb(urlData, type, caption, fileInput) {
    if (!dbData.media) dbData.media = [];
    dbData.media.push({ 
        id: Date.now(), 
        url: urlData, 
        type: type, 
        caption: caption || 'Recuerdo especial 💗' 
    });
    
    await saveToCloud();
    renderEverything();

    fileInput.value = '';
    document.getElementById('mediaCaption').value = '';
    alert('¡Recuerdo guardado con éxito para siempre!');
}

async function addSong() {
    const title = document.getElementById('songTitle').value;
    const addedBy = document.getElementById('songAddedBy').value || 'Amor';
    const url = document.getElementById('songUrl').value;
    if (!title || !url) return alert('Llena el título y el enlace');
    
    if (!dbData.songs) dbData.songs = [];
    dbData.songs.push({ title, addedBy, url });
    
    await saveToCloud();
    renderMusicModalList();

    document.getElementById('songTitle').value = '';
    document.getElementById('songUrl').value = '';
    alert('¡Canción guardada con éxito!');
}

async function deleteSong(index) {
    if (confirm('¿Seguro que deseas eliminar esta canción?')) {
        dbData.songs.splice(index, 1);
        await saveToCloud();
        renderMusicModalList();
    }
}

async function addMemory() {
    const text = document.getElementById('memoryText').value;
    if (!text) return alert('Escribe un texto');
    
    if (!dbData.memories) dbData.memories = [];
    dbData.memories.push(text);
    
    await saveToCloud();
    renderTextsModalList();

    document.getElementById('memoryText').value = '';
    alert('¡Texto guardado con éxito!');
}

async function editMemory(index) {
    const newText = prompt('Edita el texto del momento:', dbData.memories[index]);
    if (newText !== null && newText.trim() !== '') {
        dbData.memories[index] = newText.trim();
        await saveToCloud();
        renderTextsModalList();
    }
}

async function deleteMemory(index) {
    if (confirm('¿Seguro que deseas eliminar este momento?')) {
        dbData.memories.splice(index, 1);
        await saveToCloud();
        renderTextsModalList();
    }
}

// Modales
function openMusicModal() {
    renderMusicModalList();
    document.getElementById('musicModal').classList.remove('hidden');
}
function closeMusicModal() {
    document.getElementById('musicModal').classList.add('hidden');
}

function openTextsModal() {
    renderTextsModalList();
    document.getElementById('textsModal').classList.remove('hidden');
}
function closeTextsModal() {
    document.getElementById('textsModal').classList.add('hidden');
}

let activeCustomIndex = null;

function openGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    if (!dbData.media || dbData.media.length === 0) {
        grid.innerHTML = '<p style="grid-column: span 2; color: #a0a0b0; font-size: 0.85rem;">No hay fotos o videos subidos todavía.</p>';
    } else {
        dbData.media.forEach((item, idx) => {
            let isVideo = item.type === 'video' || (item.url && item.url.startsWith('data:video'));
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
    }

    modal.classList.remove('hidden');
}

function closeGalleryModal() {
    document.getElementById('galleryModal').classList.add('hidden');
}

async function deleteCustomMedia(event, index) {
    event.stopPropagation();
    if (confirm('¿Deseas eliminar este archivo de la galería?')) {
        dbData.media.splice(index, 1);
        await saveToCloud();
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
    if (type === 'video' || (url && url.startsWith('data:video'))) {
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

async function enableEditCaption() {
    if (activeCustomIndex === null) return;
    const currentCap = dbData.media[activeCustomIndex].caption;
    const newCap = prompt('Editar texto de la foto/video:', currentCap);
    if (newCap !== null && newCap.trim() !== '') {
        dbData.media[activeCustomIndex].caption = newCap.trim();
        await saveToCloud();
        document.getElementById('viewerCaptionText').innerText = newCap.trim();
        openGalleryModal();
    }
}

// Cargar todo al abrir la página
loadFromCloud();
