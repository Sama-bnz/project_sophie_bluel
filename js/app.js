let works = [];
const gallery = document.getElementsByClassName("gallery");
const category = document.getElementsByClassName("category");
const authentication = document.getElementById("authentication");
const favDialog = document.getElementById('favDialog');
const favImageDialog = document.getElementById('favImageDialog');
const closeModalWindow = document.getElementById('closeModal');
const closePictureModal = document.getElementById('closePictureModal');
const categorySelectBox = document.getElementById('categorySelectBox');
const formDialog = document.getElementById('formDialog');


async function fetchData (url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
} 

async function loadWorks() {
    const url = "http://localhost:5678/api/works";
    const result = await fetchData(url);
    return result;
}

async function loadCategory() {
  const url = "http://localhost:5678/api/categories";

  const result = await fetchData(url);
  return result;
}
loadWorks();

function templateWork(workLabel, workImage) {
    return `<figure>
				<img src="${workImage}" alt="${workLabel}">
				<figcaption>${workLabel}</figcaption>
			</figure>`;
}

function templateCategory(category) {
  return `<div onclick="loadWorkByCategory(event);" id="${category.id}" class="category_label">${category.name}</div>`;
}

async function showWorks() {
    works = await loadWorks();
    buildWorksTemplateList();
}
function buildWorksTemplateList() {
  let template = "";
    works.forEach((work) => {
        template+=templateWork(work.title,work.imageUrl)
      });
    gallery[0].innerHTML = template;
}

async function showCategories() {
  const categories = await loadCategory();
  let template = `<div onclick="loadWorkByCategory(event);" id="0" class="category_label">Tous</div>`;
  categories.forEach((category) => {
      template+=templateCategory(category)
    });
  template += `<button id="showModale">Modifier</button>`
  category[0].innerHTML = template;
  showModale();

}
function loadWorkByCategory(element){
  let index = element.target.id;
  if (index == 0){
    buildWorksTemplateList(works);
  }else{
    const worksFiltered = works.filter((work) => work.categoryId==index);
    buildWorksTemplateList(worksFiltered);
  }
  
}
function initAuthZone() {
  const token = localStorage.getItem("token");
  let template = `<a href="./login.html">login</a>`;
  if(token!=undefined && token != null && token != "") {
    template = `<a href="#" id="logout">logout</a>`
  }
  authentication.innerHTML = template;
  logout();
}
function logout() {
  const logout = document.getElementById("logout");
  const token = localStorage.getItem("token");
  if(logout!=null && logout != undefined){
    logout.addEventListener("click", function(){
      if(token!=undefined && token != null && token != "") {
        localStorage.removeItem("token");
        window.location.reload();
      }
    });
  }
  
}
function showModale(){
  const buttonModale = document.getElementById('showModale');
  buttonModale.addEventListener('click', async () => {
    await loadImageModal();
    favDialog.showModal();
    showPictureModal();
    closeModal(closeModalWindow, favDialog);
    });
}
async function loadImageModal(){
 let template = '';
 const works = await loadWorks();
  works.forEach((work) => {
      template+=templateModalImage(work)
    });
  formDialog.innerHTML = template;
}
function templateModalImage(work){
  return `<div class="image-container">
			<img src="${work.imageUrl}"  alt="1">
			<i class="fa-solid fa-trash-can trash-icon" ></i>
		  </div>`
}
const addPictureButton = document.getElementById('validatePicture');

function showPictureModal() {
  const buttonModale = document.getElementById('addPictureDialog');
  buttonModale.addEventListener('click', () => {
    favImageDialog.showModal();
    closeModal(closePictureModal, favImageDialog);
    fillSelectCategory();
    loadImage();
    addPictureButton.addEventListener('click', addPictureEvent);
  });
}

function closeModal(buttonClose, dialog){
  buttonClose.addEventListener('click',() => {
    dialog.close();
  })
}
async function fillSelectCategory() {
  const categories = await loadCategory();
  let template = `<option value=""></option>`
  categories.forEach((category) => {
    template+=templateOptionCategory(category)
  });
  categorySelectBox.innerHTML = template;
}

function templateOptionCategory(category){
  return `<option value="${category.id}" class="category_label">${category.name}</option>`;
}
const pictureTitle = document.getElementById('title');// titre modale photo

async function addPictureEvent(event){
  event.preventDefault();
  const title = pictureTitle.value;
  const category = categorySelectBox.value;
  const photo = document.querySelector("#photo");
  console.log(photo.files[0]);
  console.log(title);
  console.log(category);
  const response = await postWork({
    title : title,
    image : photo.files[0],
    category : category
  })
  console.log(response);
  if(response.ok){
    favImageDialog.close('ok');
  }
}

function loadImage(){
  document.getElementById('photo').addEventListener('change', function(event) {
    // Récupère le fichier sélectionné
    const file = event.target.files[0]; 
    // Sélectionne l'élément d'aperçu
    const preview = document.getElementById('photoPreview'); 
    // Le bouton d'ajout de photo
    const label = document.getElementById('photoLabel'); 
  
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Change le style de fond du conteneur d'aperçu
            preview.style.backgroundImage = `url(${e.target.result})`;
            // Montre l'aperçu
            preview.style.display = 'block'; 
            // Cache le bouton d'ajout de photo
            label.style.display = 'none'; 
        }
        // Lit l'image comme une URL data
        reader.readAsDataURL(file); 
    }
  });
}

async function postWork(work){
  const formData = new FormData();
  const token = localStorage.getItem("token");
  const headers = { 'Authorization': `Bearer ${token}`};
  formData.append("title", work.title);
  formData.append("category", work.category);
  formData.append("image", work.image);
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers:headers
  });
  return response;
}
function reloadModal() {
  favImageDialog.addEventListener("close", async (e) => {
    console.log(favImageDialog.returnValue);
    if(favImageDialog.returnValue == 'ok'){
      await loadImageModal();
      favDialog.returnValue = 'ok';
    }
  });
}

function reloadWork(){
  favDialog.addEventListener("close",async (e) => {
    console.log("bonjour");
    console.log(favDialog.returnValue);
    if(favDialog.returnValue == 'ok'){
      await showWorks();
      // favDialog.returnValue = 'ok';
    }
  });
}
reloadWork();
reloadModal();
showWorks();
showCategories();
initAuthZone();


