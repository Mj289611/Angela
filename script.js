// Configuración oficial de tu Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCMuz81GDT4EJKrGHYIfNQAz0y58xtauuQ",
    authDomain: "fotos-7897e.firebaseapp.com",
    projectId: "fotos-7897e",
    storageBucket: "fotos-7897e.appspot.com",
    messagingSenderId: "652419052512",
    appId: "1:652419052512:web:84201d2bdd6c274b097185",
    measurementId: "G-T0PJ06J291"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Tus datos recuperados (Canciones, nota especial y multimedia vacía para empezar)
let dbData = {
    songs: [
        { title: "M.A.I", addedBy: "Niño", url: "https://open.spotify.com/track/35ttE4t8lQZA2vuCYDg4G7?si=Jw2UOhB9Tx6jE1yuF3FhCw&utm_source=copy-link" },
        { title: "Enamorado tuyo", addedBy: "Niño", url: "https://open.spotify.com/track/35LdDKNMwvKftENaj1WIwF?si=FFVhpwSzTXG-jPfCoY93hg&utm_source=copy-link" },
        { title: "Por ti", addedBy: "Niño", url: "https://open.spotify.com/track/3lnaMCNOqHZHzUYdHP6TxA?si=UrZZBqMCSZOLHde_2gaGOA&utm_source=copy-link" },
        { title: "Vamonos a marte", addedBy: "Niño", url: "https://open.spotify.com/track/1qBdJHxR2qY0dFad0ZI8sj?si=aoUBCJ6mRPGyut4228HbjQ&utm_source=copy-link" },
        { title: "Querer querernos", addedBy: "Niño", url: "https://open.spotify.com/track/1pzmfNz1I4kgkcKZTPbKGE?si=q92UtGJFROepYjp8tXqPow&utm_source=copy-link" }
    ],
    memories: [
        "Mami, siempfe te amare, me doy cuenta que te amo cada día, en cada momento del día pienso en ti, duermo y sueño contigo, te necesito musho, eres mi lugar seguro, eres mi mami, quien cura mi corazón, grachas por tu amor, grachas x amarme cada día mami, eres y seras siempre lo mejor que me ha pasado en esta vida mami, eres hermosha, me encantan tus cachetitos, me encanta y enamora que seas tikitita, amo como te ves enojada, cuando me haces caritas, es lo mejor, me hace feliz eso de ti, con tu amor y estando a mi lado puedes transformarme, me haces feliz, cada parte de ti me ayuda a mejorar, sin ti no sería lo que soy, no lograría der mejor, me ayudas musho mami, eres lo mejor de este mundo, tu niño hemosho sabe muy bien eso, estoy loco x ti de amor, te amo musho pero musho mamii🥺💗"
    ],
    media: []
};

const DOC_ID = "mainData";

// Sincronización en tiempo real con Firestore
function initRealtimeSync() {
    db.collection("appData").doc(DOC_ID).onSnapshot((docSnap) => {
        if (docSnap.exists) {
            dbData = docSnap.data();
            renderEverything();
        } else {
            saveToCloud();
        }
    }, (error) => {
        console.error("Error sincronizando:", error);
    });
}

async function saveToCloud() {
    try {
        await db.collection("appData").doc(DOC_ID).set(dbData);
        renderEverything();
    } catch (e) {
        console.error("Error guardando:", e);
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

    const elYears = document.getElementById('years');
    const elMonths = document.getElementById('months');
    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');

    if (elYears) elYears.innerText = years;
    if (elMonths) elMonths.innerText = months;
    if (elDays) elDays.innerText = days;
    if (elHours) elHours.innerText = hours;
    if (elMinutes) elMinutes.innerText = minutes;
    if (elSeconds) elSeconds.innerText = seconds;
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
            <div class="music-card" style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; margin-bottom: 10px;">
                <div class="music-info" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <b style="color: #fff;">${song.title}</b>
                        <span style="display: block; font-size: 0.75rem; color: #ffb3c1;">Agregado por: ${song.addedBy}</span>
                    </div>
                    <button onclick="deleteSong(${index})" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: 1rem;"><i class="fa-solid fa-trash"></i></button>
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
            <div class="memory-item" style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <span style="width: 80%; text-align: left; color: #fff; font-size: 0.9rem;">${mem}</span>
                <div>
                    <button onclick="editMemory(${index})" title="Editar" style="background: transparent; border: none; color: #ffd166; cursor: pointer; margin-right: 8px;"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteMemory(${index})" title="Eliminar" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
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
        slider.innerHTML = `<div class="slide active"><div class="empty-slide">Sube fotos o videos para verlos aquí 💗</div></div>`;
        slides = document.querySelectorAll('.slide');
        return;
    }

    dbData.media.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (index === 0) slide.classList.add('active');

        if (item.type === 'video') {
            slide.innerHTML = `<video src="${item.url}" autoplay muted loop playsinline style="width:100%; height:100%; object-fit:cover;"></video>`;
        } else {
            slide.innerHTML = `<img src="${item.url}" alt="Recuerdo" style="width:100%; height:100%; object-fit:cover;">`;
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
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    currentSlide = Math.floor(Math.random() * slides.length);
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
}
setInterval(nextSlide, 4500);

// Panel Admin
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        panel.classList.toggle('hidden');
        panel.scrollIntoView({ behavior: 'smooth' });
    }
}

// Subida de Multimedia con compresión optimizada para Firestore
async function uploadMediaFile() {
    const fileInput = document.getElementById('mediaFileInput');
    const captionInput = document.getElementById('mediaCaption').value.trim();

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        return alert('Por favor selecciona una foto o video de tu galería.');
    }

    const file = fileInput.files[0];
    alert('Optimizando recuerdo y sincronizando con la nube... 💗');

    if (file.type.startsWith('video')) {
        const reader = new FileReader();
        reader.onload = async function(event) {
            if (!dbData.media) dbData.media = [];
            dbData.media.push({
                id: Date.now(),
                url: event.target.result,
                type: 'video',
                caption: captionInput || 'Recuerdo especial 💗'
            });
            await saveToCloud();
            fileInput.value = '';
            document.getElementById('mediaCaption').value = '';
            alert('¡Video subido y sincronizado con éxito!');
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
                const maxWidth = 450;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.50);

                if (!dbData.media) dbData.media = [];
                dbData.media.push({ 
                    id: Date.now(), 
                    url: compressedDataUrl, 
                    type: 'image', 
                    caption: captionInput || 'Recuerdo especial 💗' 
                });
                
                await saveToCloud();

                fileInput.value = '';
                document.getElementById('mediaCaption').value = '';
                alert('¡Foto guardada y sincronizada con éxito!');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function addSong() {
    const title = document.getElementById('songTitle').value;
    const addedBy = document.getElementById('songAddedBy').value || 'Su Niño';
    const url = document.getElementById('songUrl').value;
    if (!title || !url) return alert('Llena el título y el enlace');
    
    if (!dbData.songs) dbData.songs = [];
    dbData.songs.push({ title, addedBy, url });
    
    await saveToCloud();
    document.getElementById('songTitle').value = '';
    document.getElementById('songUrl').value = '';
    alert('¡Canción guardada con éxito!');
}

async function deleteSong(index) {
    if (confirm('¿Seguro que deseas eliminar esta canción?')) {
        dbData.songs.splice(index, 1);
        await saveToCloud();
    }
}

async function addMemory() {
    const text = document.getElementById('memoryText').value;
    if (!text) return alert('Escribe un texto');
    
    if (!dbData.memories) dbData.memories = [];
    dbData.memories.push(text);
    
    await saveToCloud();
    document.getElementById('memoryText').value = '';
    alert('¡Texto guardado con éxito!');
}

async function editMemory(index) {
    const newText = prompt('Edita el texto del momento:', dbData.memories[index]);
    if (newText !== null && newText.trim() !== '') {
        dbData.memories[index] = newText.trim();
        await saveToCloud();
    }
}

async function deleteMemory(index) {
    if (confirm('¿Seguro que deseas eliminar este momento?')) {
        dbData.memories.splice(index, 1);
        await saveToCloud();
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
    if (!grid) return;
    grid.innerHTML = '';

    if (!dbData.media || dbData.media.length === 0) {
        grid.innerHTML = '<p style="grid-column: span 2; color: #a0a0b0; font-size: 0.85rem;">No hay fotos o videos subidos todavía.</p>';
    } else {
        dbData.media.forEach((item, idx) => {
            let thumbContent = item.type === 'video' 
                ? `<video src="${item.url}" style="width:100%; height:120px; object-fit:cover; border-radius:8px;"></video>` 
                : `<img src="${item.url}" class="gallery-thumb" alt="Subida" style="width:100%; height:120px; object-fit:cover; border-radius:8px;">`;
            
            grid.innerHTML += `
                <div class="gallery-card" style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 10px; position: relative;">
                    <button onclick="deleteCustomMedia(event, ${idx})" title="Eliminar" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); border: none; color: #ff6b6b; padding: 6px; border-radius: 50%; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                    <div onclick="openViewer('${item.url}', '${item.type || 'image'}', '${item.caption}', ${idx})" style="cursor: pointer;">
                        ${thumbContent}
                        <div class="gallery-caption" style="font-size: 0.8rem; margin-top: 6px; color: #fff; text-align: center;">${item.caption}</div>
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
    if (event) event.stopPropagation();
    if (confirm('¿Deseas eliminar este recuerdo de la galería?')) {
        dbData.media.splice(index, 1);
        await saveToCloud();
        openGalleryModal();
    }
}

function openViewer(url, type, caption, customIndex) {
    activeCustomIndex = customIndex;
    const viewerModal = document.getElementById('viewerModal');
    const container = document.getElementById('viewerContainer');
    const captionEl = document.getElementById('viewerCaptionText');
    
    container.innerHTML = '';
    if (type === 'video') {
        container.innerHTML = `<video src="${url}" controls autoplay style="width:100%; max-height:60vh; border-radius:10px;"></video>`;
    } else {
        container.innerHTML = `<img src="${url}" alt="Ampliada" style="width:100%; max-height:60vh; object-fit:contain; border-radius:10px;">`;
    }
    if (captionEl) captionEl.innerText = caption;
    viewerModal.classList.remove('hidden');
}

function closeViewerModal() {
    document.getElementById('viewerModal').classList.add('hidden');
}

async function enableEditCaption() {
    if (activeCustomIndex === null) return;
    const currentCap = dbData.media[activeCustomIndex].caption;
    const newCap = prompt('Editar texto del recuerdo:', currentCap);
    if (newCap !== null && newCap.trim() !== '') {
        dbData.media[activeCustomIndex].caption = newCap.trim();
        await saveToCloud();
        const captionEl = document.getElementById('viewerCaptionText');
        if (captionEl) captionEl.innerText = newCap.trim();
        openGalleryModal();
    }
}

// Iniciar sincronización al cargar
initRealtimeSync();
