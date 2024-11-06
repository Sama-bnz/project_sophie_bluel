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
const categoryFilter = document.getElementById('category_filter');
const categoryLabel = document.getElementsByClassName('category_label');
const portfolioHeader = document.getElementsByClassName('portfolio_header');
const leftArrow = document.getElementById('left-arrow');
const formGroupImage = document.getElementById('form-group-image');


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
    buildWorksTemplateList(works);
}
function buildWorksTemplateList(worksFiltered) {
  let template = "";
    worksFiltered.forEach((work) => {
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
  // template += `<button id="showModale">Modifier</button>`
  category[0].innerHTML = template;
}

function loadWorkByCategory(element){
  let index = element.target.id;
  var current = document.getElementsByClassName("active");
  if (current.length > 0) { 
    current[0].className = current[0].className.replace(" active", "");
  }
  element.target.className += " active";
  if (index == 0){
    buildWorksTemplateList(works);
  }else{
    const worksFiltered = works.filter((work) => work.categoryId==index);
    console.log(worksFiltered);
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
    favDialog.style.display = "flex";
    favDialog.showModal();
    showPictureModal();
    closeModal(closeModalWindow, favDialog, ()=>{
      favDialog.style.display = "none";
    });
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
			<i id="icon-${work.id}" onclick="deleteWork(${work.id})" class="fa-solid fa-trash-can trash-icon" ></i>
		  </div>`
}
async function deleteWork(id){
  console.log(id);
  if (confirm("Voulez-vous supprimer l'élement?")) {
    const response = await deleteApi(id);
    if(response.ok){
      loadImageModal();
    }
  }
}

async function deleteApi(id){
  const token = localStorage.getItem("token");
  const headers = { 'Authorization': `Bearer ${token}`};

  const response = await fetch('http://localhost:5678/api/works/' + id, {
    method: 'DELETE',
    headers:headers
    
  })
  return response;
}
function onDelete(idElement){
  const iconDelete = document.getElementById(idElement);
  console.log(iconDelete);
  iconDelete.addEventListener('click',() =>{
    console.log('Hello world');
  })
}
const addPictureButton = document.getElementById('validatePicture');

//AFFICHER LE FORMULAIRE AJOUT DE PHOTO
function showPictureModal() {
  const buttonModale = document.getElementById('addPictureDialog');
  buttonModale.addEventListener('click', () => {
    favImageDialog.showModal();
    document.getElementById('photoForm_modal').reset();
    formGroupImage.innerHTML = loadContentFormGroupImage();
    const preview = document.getElementById('photoPreview'); 
    const label = document.getElementById('photoLabel'); 
    label.style.display='block';
    // preview.style.display= 'none';
    // preview.style.backgroundImage ="";
    // preview.innerHTML = "";
    // closeAllModal();
    closeModal(closePictureModal, favImageDialog, closeAllModal);
    closeModal(leftArrow, favImageDialog, backToFirstModal);
    fillSelectCategory();
    loadImage();
    addPictureButton.addEventListener('click', addPictureEvent);
  });
}
function loadContentFormGroupImage(){
  return `
        <i class="fa-regular fa-image image_add" id="icone-photo"></i>
				<label for="photo" class="photo-btn" id="photoLabel">+ Ajouter photo </label>
				<input type="file" id="photo" name="photo" accept="image/*" style="display: none;">
				<p class="formatImage" id="text-photo">jpg, png : 4mo max</p>`
}
function closeAllModal(){
  resetFormShowPictureModal();
  favDialog.style.display = "none";
  favDialog.close();
}
function backToFirstModal(){
  resetFormShowPictureModal();
}
function resetFormShowPictureModal(){
  document.getElementById('photoForm_modal').reset();
  const preview = document.getElementById('photoPreview'); 
  const label = document.getElementById('photoLabel'); 
  label.style.display='block';
  // preview.style.display= 'none';
  // preview.style.backgroundImage ="";
  // preview.innerHTML = "";
  
}

function closeFavImageDialogWhenBackgroundIsClick(){
  favImageDialog.addEventListener("click",(e)=>{
    if (e.target === e.currentTarget) {
      favImageDialog.close();
    }
  })
}
closeFavImageDialogWhenBackgroundIsClick();

function closeModal(buttonClose, dialog,callback){
  buttonClose.addEventListener('click',() => {
    dialog.close();
    if(callback){
      callback();
    }
  })
}
window.onclick = function(event) {
  console.log(event.target.id)
  if(event.target.id == "closePictureModal"){
    favDialog.close();
  }
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
let photoData = null;
async function addPictureEvent(event){
  event.preventDefault();
  const title = pictureTitle.value;
  const category = categorySelectBox.value;
  if(title == undefined || title == null || title == ''){
    alert ("Vous devez renseigner le titre ");
    return;
  }
  if(category == undefined || category == null || category == ''){
    alert("Vous devez renseigner la catégorie");
    return;
  }
  
  console.log(title);
  console.log(category);
  const response = await postWork({
    title : title,
    image : photoData,
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
    const photo = document.querySelector("#photo");
    console.log(photo.files);
    if(photo.files.length == 0){
      alert("Vous devez sélectionner une photo");
      return;
    }
  photoData = photo.files[0];
    formGroupImage.innerHTML = `<div id="photoPreview" class="photo-preview"></div>`
    // Sélectionne l'élément d'aperçu
    const preview = document.getElementById('photoPreview'); 
    // Le bouton d'ajout de photo
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Change le style de fond du conteneur d'aperçu
            preview.style.backgroundImage = `url(${e.target.result})`;
            
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
    if(favImageDialog.returnValue == 'ok'){
      await loadImageModal();
    }
  });
}

function reloadWork(){
  favDialog.addEventListener("close",async (e) => {
      await showWorks();
  });
}
// Afficher ou pas le filtre quand on est connecté
function showOrHideCategoryFilter(){
  const token = localStorage.getItem("token");
  if(token!=undefined && token != null && token != "") {
    categoryFilter.style.display = "none";
  } else {
    categoryFilter.style.display = "flex";
  }
}

function showOrHideUpdateButton(){
  const token = localStorage.getItem("token");
  if(token!=undefined && token != null && token != "") {
    portfolioHeader[0].insertAdjacentHTML("beforeend",`<button class="portfolio_button" id="showModale"><i class="fa-regular fa-pen-to-square"></i>modifier</button>`); 
    showModale();
  }
}


reloadWork();
reloadModal();
showWorks();
showOrHideUpdateButton();
showCategories();
initAuthZone();
showOrHideCategoryFilter();
