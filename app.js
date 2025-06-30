const books = [
  {
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    category: "novel",
    status: "Tersedia",
    cover: "images/laskar.jpg"
  },
  {
    title: "Sejarah Indonesia",
    author: "M.C.Ricklefs",
    category: "sejarah",
    status: "Dipinjam",
    cover: "images/sejarah.jpg"
  },
  {
    title: "Belajar JavaScript",
    author: "Budi",
    category: "edukasi",
    status: "Tersedia",
    cover: "images/javascript.jpg"
  },
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    category: "novel",
    status: "Tersedia",
    cover: "images/harrypotter.jpg"
  },
  {
    title: "Matematika Dasar",
    author: "Dian",
    category: "edukasi",
    status: "Dipinjam",
    cover: "images/matematika.jpg"
  },
  {
    title: "Filsafat Yunani",
    author: "Aristoteles",
    category: "sejarah",
    status: "Tersedia",
    cover: "images/filsafat.jpg"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "novel",
    status: "Tersedia",
    cover: "images/alchemist.jpg"
  },
  {
    title: "Pemrograman Web",
    author: "Priyanto Hidayatullah",
    category: "edukasi",
    status: "Dipinjam",
    cover: "images/pemrograman.jpg"
  },
  {
    title: "Perang Dunia",
    author: "Max Hastings",
    category: "sejarah",
    status: "Tersedia",
    cover: "images/perang.jpg"
  }
];

const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');

function renderBooks() {
  const keyword = searchInput.value.toLowerCase();
  const filter = filterSelect.value;
  bookList.innerHTML = '';

  books
    .filter(b =>
      (b.title.toLowerCase().includes(keyword) || b.author.toLowerCase().includes(keyword)) &&
      (filter === '' || b.category === filter)
    )
    .forEach(b => {
      const div = document.createElement('div');
      div.className = 'book';
      div.innerHTML = `
        <img src="${b.cover}" alt="${b.title}" style="width:100%; height:180px; object-fit:cover; border-radius:6px 6px 0 0;">
        <div style="padding: 10px;">
          <h3>${b.title}</h3>
          <p><strong>Penulis:</strong> ${b.author}</p>
          <p><strong>Kategori:</strong> ${b.category}</p>
          <p><strong>Status:</strong> <span style="color:${b.status === 'Tersedia' ? 'green' : 'red'}">${b.status}</span></p>
        </div>
      `;
      bookList.appendChild(div);
    });
}

searchInput.addEventListener('input', renderBooks);
filterSelect.addEventListener('change', renderBooks);
renderBooks();

//  Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log('Service Worker registered');
  });
}

//  INSTALL APK
let deferredPrompt;
const installBtn = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`Install prompt result: ${outcome}`);

  deferredPrompt = null;
  installBtn.style.display = 'none';
});

//  DARK MODE FUNCTION
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}
