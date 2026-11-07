// CONFIGURACIÓN OFICIAL DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DATOS INICIALES RECUPERADOS (Canciones y nota especial)
const defaultData = {
    songs: [
        {
            title: "M.A.I ",
            addedBy: "Niño",
            url: "https://open.spotify.com/track/35ttE4t8lQZA2vuCYDg4G7?si=Jw2UOhB9Tx6jE1yuF3FhCw&utm_source=copy-link"
        },
        {
            title: "Enamorado tuyo",
            addedBy: "Niño",
            url: "https://open.spotify.com/track/35LdDKNMwvKftENaj1WIwF?si=FFVhpwSzTXG-jPfCoY93hg&utm_source=copy-link "
        },
        {
            title: "Por ti",
            addedBy: "Niño",
            url: "https://open.spotify.com/track/3lnaMCNOqHZHzUYdHP6TxA?si=UrZZBqMCSZOLHde_2gaGOA&utm_source=copy-link"
        },
        {
            title: "Vamonos a marte ",
            addedBy: "Niño ",
            url: "https://open.spotify.com/track/1qBdJHxR2qY0dFad0ZI8sj?si=aoUBCJ6mRPGyut4228HbjQ&utm_source=copy-link"
        },
        {
            title: "Querer querernos ",
            addedBy: "Niño ",
            url: "https://open.spotify.com/track/1pzmfNz1I4kgkcKZTPbKGE?si=q92UtGJFROepYjp8tXqPow&utm_source=copy-link "
        }
    ],
    memories: [
        "Mami, siempfe te amare, me doy cuenta que te amo cada día, en cada momento del día pienso en ti, duermo y sueño contigo, te necesito musho, eres mi lugar seguro, eres mi mami, quien cura mi corazón, grachas por tu amor, grachas x amarme cada día mami, eres y seras siempre lo mejor que me ha pasado en esta vida mami, eres hermosha, me encantan tus cachetitos, me encanta y enamora que seas tikitita, amo como te ves enojada, cuando me haces caritas, es lo mejor, me hace feliz eso de ti, con tu amor y estando a mi lado puedes transformarme, me haces feliz, cada parte de ti me ayuda a mejorar, sin ti no sería lo que soy, no lograría der mejor, me ayudas musho mami, eres lo mejor de este mundo, tu niño hemosho sabe muy bien eso, estoy loco x ti de amor, te amo musho pero musho mamii🥺💗"
    ],
    media: []
};

let dbData = defaultData;
const DOC_ID = "mainData";

// Sincronización en Tiempo Real con Firestore
function initRealtimeSync() {
    onSnapshot(doc(db, "appData", DOC_ID), (docSnap) => {
        if (docSnap.exists()) {
            dbData = docSnap.data();
            renderEverything();
        } else {
            saveToCloud();
        }
    }, (error) => {
        console.error("Error en tiempo real:", error);
    });
}

// Guardar datos en Firestore
async function saveToCloud() {
    try {
        await setDoc(doc(db, "appData", DOC_ID), dbData);
        renderEverything();
    } catch (e) {
        console.error("Error guardando en la nube:", e);
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
                    <button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </div>
                <div style="width: 100%;">
                    ${getMusicEmbedHtml(song.url)}
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.music-card .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.currentTarget.getAttribute('data-index');
            deleteSong(parseInt(idx));
        });
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
                    <button class="edit-btn" data-index="${index}" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn" data-index="${index}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.memory-item .edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.currentTarget.getAttribute('data-index');
            editMemory(parseInt(idx));
        });
    });

    document.querySelectorAll('.memory-item .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.currentTarget.getAttribute('data-index');
            deleteMemory(parseInt(idx));
        });
    });
}

function initDynamicMedia() {
    const slider = document.getElementById('mainSlider');
    if (!slider) return;
    slider.innerHTML = '';

    if (!dbData.media || dbData.media.length === 0) {
        slider.innerHTML = `<div class="slide active"><div class="empty-slide">Sube fotos desde tu cel para verlas aquí 💗</div></div>`;
        slides = document.querySelectorAll('.slide');
        return;
    }

    dbData.media.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (index === 0) slide.classList.add('active');

        slide.innerHTML = `<img src="${item.url}" alt="Recuerdo">`;
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

// Panel Admin
window.toggleAdminPanel = function() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('hidden');
    panel.scrollIntoView({ behavior: 'smooth' });
};

// Subida a Firestore optimizada con compresión inteligente
window.uploadMediaFile = async function() {
    const fileInput = document.getElementById('mediaFileInput');
    const captionInput = document.getElementById('mediaCaption').value.trim();

    if (!fileInput.files || fileInput.files.length === 0) {
        return alert('Por favor selecciona una foto de tu galería.');
    }

    const file = fileInput.files[0];
    if (file.type.startsWith('video')) {
        alert('Por el momento los videos pesan demasiado para este espacio gratuito. Te recomendamos usar fotos hermosas.');
        return;
    }

    alert('Optimizando foto y sincronizando... Un momento 💗');

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
};

window.addSong = async function() {
    const title = document.getElementById('songTitle').value;
    const addedBy = document.getElementById('songAddedBy').value || 'Amor';
    const url = document.getElementById('songUrl').value;
    if (!title || !url) return alert('Llena el título y el enlace');
    
    if (!dbData.songs) dbData.songs = [];
    dbData.songs.push({ title, addedBy, url });
    
    await saveToCloud();
    document.getElementById('songTitle').value = '';
    document.getElementById('songUrl').value = '';
    alert('¡Canción guardada con éxito!');
};

async function deleteSong(index) {
    if (confirm('¿Seguro que deseas eliminar esta canción?')) {
        dbData.songs.splice(index, 1);
        await saveToCloud();
    }
}

window.addMemory = async function() {
    const text = document.getElementById('memoryText').value;
    if (!text) return alert('Escribe un texto');
    
    if (!dbData.memories) dbData.memories = [];
    dbData.memories.push(text);
    
    await saveToCloud();
    document.getElementById('memoryText').value = '';
    alert('¡Texto guardado con éxito!');
};

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
window.openMusicModal = function() {
    renderMusicModalList();
    document.getElementById('musicModal').classList.remove('hidden');
};
window.closeMusicModal = function() {
    document.getElementById('musicModal').classList.add('hidden');
};

window.openTextsModal = function() {
    renderTextsModalList();
    document.getElementById('textsModal').classList.remove('hidden');
};
window.closeTextsModal = function() {
    document.getElementById('textsModal').classList.add('hidden');
};

let activeCustomIndex = null;

window.openGalleryModal = function() {
    const modal = document.getElementById('galleryModal');
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    if (!dbData.media || dbData.media.length === 0) {
        grid.innerHTML = '<p style="grid-column: span 2; color: #a0a0b0; font-size: 0.85rem;">No hay fotos subidas todavía.</p>';
    } else {
        dbData.media.forEach((item, idx) => {
            grid.innerHTML += `
                <div class="gallery-card">
                    <button class="gallery-delete-btn" data-index="${idx}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                    <div class="gallery-item-click" data-url="${item.url}" data-caption="${item.caption}" data-index="${idx}">
                        <img src="${item.url}" class="gallery-thumb" alt="Subida">
                        <div class="gallery-caption">${item.caption}</div>
                    </div>
                </div>
            `;
        });
    }

    document.querySelectorAll('.gallery-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = e.currentTarget.getAttribute('data-index');
            deleteCustomMedia(parseInt(idx));
        });
    });

    document.querySelectorAll('.gallery-item-click').forEach(item => {
        item.addEventListener('click', (e) => {
            const url = e.currentTarget.getAttribute('data-url');
            const caption = e.currentTarget.getAttribute('data-caption');
            const idx = e.currentTarget.getAttribute('data-index');
            openViewer(url, 'image', caption, parseInt(idx));
        });
    });

    modal.classList.remove('hidden');
};

window.closeGalleryModal = function() {
    document.getElementById('galleryModal').classList.add('hidden');
};

async function deleteCustomMedia(index) {
    if (confirm('¿Deseas eliminar esta foto de la galería?')) {
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
    
    container.innerHTML = `<img src="${url}" alt="Ampliada">`;
    captionEl.innerText = caption;
    viewerModal.classList.remove('hidden');
}

window.closeViewerModal = function() {
    document.getElementById('viewerModal').classList.add('hidden');
};

window.enableEditCaption = async function() {
    if (activeCustomIndex === null) return;
    const currentCap = dbData.media[activeCustomIndex].caption;
    const newCap = prompt('Editar texto de la foto:', currentCap);
    if (newCap !== null && newCap.trim() !== '') {
        dbData.media[activeCustomIndex].caption = newCap.trim();
        await saveToCloud();
        document.getElementById('viewerCaptionText').innerText = newCap.trim();
        openGalleryModal();
    }
};

// Iniciar sincronización en tiempo real
initRealtimeSync();
