const startDate = new Date(2023, 0, 1); 

function updateCounter() {
  const now = new Date();
  const diff = now - startDate;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  
  const counterEl = document.getElementById('counter');
  if(counterEl) {
    counterEl.innerText = `${days} días, ${hours}h ${minutes}m ${seconds}s`;
  }
}
setInterval(updateCounter, 1000);
updateCounter();

let items = JSON.parse(localStorage.getItem('angela_items')) || [
  { id: 1, type: 'photo', title: 'Foto 1', url: 'img/foto1.jpg' },
  { id: 2, type: 'video', title: 'Video 1', url: 'video/video1.mp4' },
  { id: 3, type: 'music', title: 'Canción', url: 'audio/cancion.mp3' },
  { id: 4, type: 'note', title: 'Recuerdo', url: 'Te amo con todo mi corazón.' }
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

  if(!photosGrid) return;

  photosGrid.innerHTML = '';
  videosGrid.innerHTML = '';
  musicList.innerHTML = '';
  notesGrid.innerHTML = '';

  items.forEach(item => {
    if (item.type === 'photo') {
      photosGrid.innerHTML += `
        <div class="media-card">
          <button class="delete-btn" onclick="deleteItem(${item.id})">×</button>
          <img src="${item.url}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/1080x1920?text=Foto'">
        </div>`;
    } 
    else if (item.type === 'video') {
      videosGrid.innerHTML += `
        <div class="media-card">
          <button class="delete-btn" onclick="deleteItem(${item.id})">×</button>
          <video controls>
            <source src="${item.url}" type="video/mp4">
          </video>
        </div>`;
    } 
    else if (item.type === 'music') {
      musicList.innerHTML += `
        <div class="music-card">
          <span>🎵 ${item.title}</span>
          <audio controls src="${item.url}"></audio>
          <button class="delete-btn" style="position:static;" onclick="deleteItem(${item.id})">×</button>
        </div>`;
    } 
    else if (item.type === 'note') {
      notesGrid.innerHTML += `
        <div class="note-card">
          <button class="delete-btn" onclick="deleteItem(${item.id})">×</button>
          <h4>${item.title}</h4>
          <p>${item.url}</p>
        </div>`;
    }
  });
}

let currentType = 'photo';

function openModal(type) {
  currentType = type;
  document.getElementById('add-modal').style.display = 'flex';
  document.getElementById('item-title').value = '';
  document.getElementById('item-url').value = '';
}

function closeModal() {
  document.getElementById('add-modal').style.display = 'none';
}

document.getElementById('dynamic-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('item-title').value;
  const url = document.getElementById('item-url').value;

  items.push({ id: Date.now(), type: currentType, title, url });
  saveAndRender();
  closeModal();
});

renderItems();
