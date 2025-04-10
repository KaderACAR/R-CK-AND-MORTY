const container = document.getElementById("characterContainer");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");

let currentPage = 1;
let isFetching = false;
let searchQuery = "";

const fetchCharacters = async (page = 1, name = "") => {
  isFetching = true;
  loading.style.display = "block";

  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${page}&name=${name}`
    );
    const data = await response.json();
    console.log(data);
    data.results.forEach(createCharacterCard);
  } catch (error) {
    console.error("Hata: ", error);
  }

  loading.style.display = "none";
  isFetching = false;
};

const createCharacterCard = (character) => {
  const col = document.createElement("div");
  col.className = "col-md-4 col-lg-3";

  col.innerHTML = `
  <div class="mainCard card ">
  <img src="${character.image}" class="card-img" alt="...">
  <div class="card-body d-flex flex-column">
  <h5 class="card-title">${character.name}</h5>
   <button class="btn btn-success open-modal" data-character='${JSON.stringify(character)}'>Details</button>
  </div>
  </div>
  `;

  col.querySelector('.open-modal').addEventListener('click', (e) => {
    e.preventDefault();
    const characterData = JSON.parse(e.target.dataset.character);
    openModal(characterData);
  });

  container.appendChild(col);
};

function openModal(character) {
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modal = new bootstrap.Modal(document.getElementById('characterModal'));

  modalTitle.textContent = character.name;
  modalBody.innerHTML = `
    <img src="${character.image}" class="img-fluid mb-3">
    <p>Status: ${character.status}</p>
    <p>Species: ${character.species}</p>
    <p>Origin: ${character.origin.name}</p>
    <p>Episodes: ${character.episode.length}</p>
  `;

  applyEasterEggs(character, modalBody, modal._element);
  
  modal.show();
}


function applyEasterEggs(character, modalBody, modalElement) {
  modalElement.querySelector('.modal-content').classList.add('alien-glow');

  if (character.episode.length > 10) {
    modalBody.innerHTML += `<div class="badge bg-danger mt-2">🏆 Multiverse Veteran</div>`;
  }

  if ([8, 18, 28].includes(character.id)) {
    modalBody.innerHTML += `<p class="text-warning">🔥 Gizli bir karakter keşfettin! Bu bir Easter Egg!</p>`;
    new Audio('https://www.soundjay.com/buttons/sounds/button-35.mp3').play();
  }
}


const debounce = (searchDebounce, delay = 500) =>{    
  let timerId; // bunu ekledim çünkü zamanlayıcıyı saklamam gereken bir değişkene ihtiyacım vardı.
  return (...args) => {
    clearTimeout(timerId); // zamanlayıcıyı clearle cnmm.
    timerId = setTimeout(() =>  // new zamanlayıcı ayarla ve searchDebounce fonksiyonunu çağır.
    searchDebounce(...args), delay);
  }
}

searchInput.addEventListener("input", debounce(() => {
  container.innerHTML = "";
  searchQuery = searchInput.value;
  currentPage = 1;
  fetchCharacters(currentPage, searchQuery);
}));


window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isFetching
  ) {
    currentPage++;
    fetchCharacters(currentPage, searchQuery);
  }
});

fetchCharacters();



// 1. Debounce 500ms - 300ms okeyydir.!
// 2. Karakter ayrıntıları için modal açılmalı. okeyyy
// 3. CSS olarak güzelleştirilmesi. Inputa animasyon eklenmesi okeyyy