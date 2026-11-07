// Fecha de inicio (Ajusta año, mes [0-11], día)
const startDate = new Date(2023, 0, 1); 

// Contador de tiempo
function updateCounter() {
  const now = new Date();
  const diff = now - startDate;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  
  document.getElementById('counter').innerText = 
    `${days} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos`;
}
setInterval(updateCounter, 1000);

// Base de Datos en LocalStorage
let items = JSON.parse(localStorage.getItem('angela_items')) || [
  { id: 1, type: 'photo', title: 'Nuestra Foto', url: 'img/foto1.jpg' },
  { id: 2, type: 'video', title: 'Recuerdo en Video', url: 'video/video1.mp4' },
  { id: 3, type: 'music', title: 'Nuestra Canción', url: 'audio/cancion.mp3' },
  { id: 4, type: 'note', title: 'Carta', url: 'Eres lo mejor que me ha pasado ❤️' }
];

function saveAndRender() {
  localStorage.setItem('angela_items', JSON.stringify(items));
  renderItems();
}

function deleteItem(id) {
  items = items.filter(item => item.id !== id);
  saveAndRender();
}

function renderItems() {
  const photosGrid = document.getElementById('photos-grid');
  const videosGrid = document.getElementById('videos-grid');
  const musicList = document.getElementById('music-list');
  const notesGrid = document.getElementById('notes-grid');

  photosGrid.innerHTML = '';
  videosGrid.innerHTML = '';
  musicList.innerHTML = '';
  notesGrid.innerHTML = '';

  items.forEach(item => {
    if (item.type === 'photo') {
      photosGrid.innerHTML += `
        <div class="card">
          <button class="btn-delete" onclick="deleteItem(${item.id})">✕</button>
          <img src="${item.url}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/1080x1920?text=Imagen+no+encontrada'">
        </div>`;
    } 
    else if (item.type === 'video') {
      videosGrid.innerHTML += `
        <div class="card">
          <button class="btn-delete" onclick="deleteItem(${item.id})">✕</button>
          <video controls>
            <source src="${item.url}" type="video/mp4">
            Tu navegador no soporta videos.
          </video>
        </div>`;
    } 
    else if (item.type === 'music') {
      musicList.innerHTML += `
        <div class="audio-card">
          <span>🎵 ${item.title}</span>
          <audio controls src="${item.url}"></audio>
          <button class="btn-delete" style="position:static" onclick="deleteItem(${item.id})">✕</button>
        </div>`;
    } 
    else if (item.type === 'note') {
      notesGrid.innerHTML += `
        <div class="note-card">
          <button class="btn-delete" onclick="deleteItem(${item.id})">✕</button>
          <h3>${item.title}</h3>
          <p>${item.url}</p>
        </div>`;
    }
  });
}

// Formulario para Añadir Contenido
document.getElementById('add-media-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const type = document.getElementById('media-type').value;
  const title = document.getElementById('media-title').value;
  const url = document.getElementById('media-url').value;

  items.push({ id: Date.now(), type, title, url });
  saveAndRender();

  document.getElementById('add-media-form').reset();
});

// Carga Inicial
renderItems();
updateCounter();
