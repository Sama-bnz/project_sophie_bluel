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
let formImageFieldIsOk = false;
let formTitleIsOk = false;
let formCategoryIsOk = false;

// Récupère les données JSON depuis une URL
async function fetchData (url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    // Gestion d'erreur pour les requêtes échouées
  }
} 
// Fonction qui charge les oeuvres depuis l'API et les renvoie
async function loadWorks() {
    const url = "http://localhost:5678/api/works";
    const result = await fetchData(url);
    return result;
}
// Fonction qui charge les catégories depuis l'API et les renvoie
async function loadCategory() {
  const url = "http://localhost:5678/api/categories";

  const result = await fetchData(url);
  return result;
}
// Génère le model HTML d'un oeuvre
function templateWork(workLabel, workImage) {
    return `<figure>
				<img src="${workImage}" alt="${workLabel}">
				<figcaption>${workLabel}</figcaption>
			</figure>`;
}
// Génère le modèle HTML d'une catégorie
function templateCategory(category) {
  return `<div onclick="loadWorkByCategory(event);" id="${category.id}" class="category_label">${category.name}</div>`;
}

// Affiche toutes les œuvres en les chargeant depuis l'API
async function showWorks() {
    works = await loadWorks();
    buildWorksTemplateList(works);
}
// Construit la liste des œuvres dans la galerie
function buildWorksTemplateList(worksFiltered) {
  let template = "";
    worksFiltered.forEach((work) => {
        template+=templateWork(work.title,work.imageUrl)
      });
    gallery[0].innerHTML = template;
}

// Affiche les catégories en les chargeant depuis l'API
async function showCategories() {
  const categories = await loadCategory();
  let template = `<div onclick="loadWorkByCategory(event);" id="0" class="category_label">Tous</div>`;
  categories.forEach((category) => {
      template+=templateCategory(category)
    });
  category[0].innerHTML = template;
}

// Filtre les œuvres par catégorie sélectionnée et les affiche
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
    buildWorksTemplateList(worksFiltered);
  }
}

// Initialise la zone d'authentification, affiche le bouton login ou logout selon le statut
function initAuthZone() {
  const token = localStorage.getItem("token");
  let template = `<a href="./login.html">login</a>`;
  if(token!=undefined && token != null && token != "") {
    template = `<a href="#" id="logout">logout</a>`
  }
  authentication.innerHTML = template;
  logout();
}

// Gère la déconnexion en supprimant le token et recharge la page
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

// Affiche la modale principale pour ajouter une image
function showModale(){
  const buttonModale = document.getElementById('showModale');
  buttonModale.addEventListener('click', async () => {
    await loadImageModal();
    favDialog.style.display = "flex";
    favDialog.showModal();
    showPictureModal();
    checkTitle();
    checkCategory();
    closeModal(closeModalWindow, favDialog, ()=>{
      favDialog.style.display = "none";
    });
  });
}

// Charge les images pour la première modale 
async function loadImageModal(){
 let template = '';
 const works = await loadWorks();
  works.forEach((work) => {
      template+=templateModalImage(work)
    });
  formDialog.innerHTML = template;
}

// Génère le modèle HTML pour une image avec un bouton de suppression
function templateModalImage(work){
  return `<div class="image-container">
			<img src="${work.imageUrl}"  alt="1">
			<i id="icon-${work.id}" onclick="deleteWork(${work.id})" class="fa-solid fa-trash-can trash-icon" ></i>
		  </div>`
}

// Supprime une œuvre avec confirmation utilisateur
async function deleteWork(id){
  if (confirm("Voulez-vous supprimer l'élement?")) {
    const response = await deleteApi(id);
    if(response.ok){
      loadImageModal();
    }
  }
}

// API pour supprimer une œuvre
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
  iconDelete.addEventListener('click',() =>{
  })
}
const addPictureButton = document.getElementById('validatePicture');

// Affiche la modale d'ajout de photo et initialise le formulaire
function showPictureModal() {
  const buttonModale = document.getElementById('addPictureDialog');
  buttonModale.addEventListener('click', () => {
    favImageDialog.showModal();
    document.getElementById('photoForm_modal').reset();
    formGroupImage.innerHTML = loadContentFormGroupImage();
    const preview = document.getElementById('photoPreview'); 
    const label = document.getElementById('photoLabel'); 
    label.style.display='block';
    closeModal(closePictureModal, favImageDialog, closeAllModal);
    closeModal(leftArrow, favImageDialog, backToFirstModal);
    fillSelectCategory();
    loadImage();
    addPictureButton.addEventListener('click', addPictureEvent);
  });
}

// Génère le contenu du groupe de champs pour le formulaire d'ajout d'image
function loadContentFormGroupImage(){
  return `
        <i class="fa-regular fa-image image_add" id="icone-photo"></i>
				<label for="photo" class="photo-btn" id="photoLabel">+ Ajouter photo </label>
				<input type="file" id="photo" name="photo" accept="image/*" style="display: none;">
				<p class="formatImage" id="text-photo">jpg, png : 4mo max</p>`
}

// Ferme toutes les modales et réinitialise le formulaire d'ajout de photo
function closeAllModal(){
  resetFormShowPictureModal();
  favDialog.style.display = "none";
  favDialog.close();
}

// Fonction pour revenir à la première modale sans fermer
function backToFirstModal(){
  resetFormShowPictureModal();
}

// Réinitialise le formulaire d'ajout de photo
function resetFormShowPictureModal(){
  document.getElementById('photoForm_modal').reset();
  const preview = document.getElementById('photoPreview'); 
  const label = document.getElementById('photoLabel'); 
  label.style.display='block';
}

// Ferme la modale d'ajout d'image quand on clique à l'extérieur
function closeFavImageDialogWhenBackgroundIsClick(){
  favImageDialog.addEventListener("click",(e)=>{
    if (e.target === e.currentTarget) {
      favImageDialog.close();
    }
  })
}
closeFavImageDialogWhenBackgroundIsClick();

// Ferme une modale spécifiée et exécute un rappel si fourni
function closeModal(buttonClose, dialog,callback){
  buttonClose.addEventListener('click',() => {
    dialog.close();
    if(callback){
      callback();
    }
  })
}
window.onclick = function(event) {
  if(event.target.id == "closePictureModal"){
    favDialog.close();
  }
}

// Remplit la liste déroulante des catégories dans le formulaire
async function fillSelectCategory() {
  const categories = await loadCategory();
  let template = `<option value=""></option>`
  categories.forEach((category) => {
    template+=templateOptionCategory(category)
  });
  categorySelectBox.innerHTML = template;
}

// Génère un modèle HTML pour la liste déroulante 2eme modale
function templateOptionCategory(category){
  return `<option value="${category.id}" class="category_label">${category.name}</option>`;
}
const pictureTitle = document.getElementById('title');
let photoData = null;

// Ajoute une œuvre à la collection en envoyant les données au backend
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
  const response = await postWork({
    title : title,
    image : photoData,
    category : category
  })
  if(response.ok){
    favImageDialog.close('ok');
  }
}

// Charge et prévisualise une image sélectionnée par l'utilisateur
function loadImage(){
  document.getElementById('photo').addEventListener('change', function(event) {
    const file = event.target.files[0]; 
    const photo = document.querySelector("#photo");
    if(photo.files.length == 0){
      alert("Vous devez sélectionner une photo");
      return;
    }
  photoData = photo.files[0];
    formGroupImage.innerHTML = `<div id="photoPreview" class="photo-preview"></div>`
    const preview = document.getElementById('photoPreview'); 
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.style.backgroundImage = `url(${e.target.result})`;
            
        }
        reader.readAsDataURL(file); 
        formImageFieldIsOk = true;
        changeButtonState();
    }
  });
}

// Envoie une nouvelle œuvre au backend via une requête POST en utilisant un FormData
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

// Recharge la modale de sélection d'images si l'ajout d'image a été confirmé
function reloadModal() {
  favImageDialog.addEventListener("close", async (e) => {
    if(favImageDialog.returnValue == 'ok'){
      await loadImageModal();
    }
  });
}

// Recharge la liste des œuvres lorsque la modale de gestion des œuvres est fermée
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

// Affiche le bouton de modification du portfolio si l'utilisateur est connecté
function showOrHideUpdateButton(){
  const token = localStorage.getItem("token");
  if(token!=undefined && token != null && token != "") {
    portfolioHeader[0].insertAdjacentHTML("beforeend",`<button class="portfolio_button" id="showModale"><i class="fa-regular fa-pen-to-square"></i>modifier</button>`); 
    showModale();
  }
}

// Vérifie si le champ de titre est valide, met à jour l'état du formulaire
function checkTitle() {
  const title = document.getElementById('title');
  title.addEventListener("keyup", (event) => {
    const titleValue = event.target.value;
    if(titleValue != '' && titleValue!= null && titleValue != undefined){
      formTitleIsOk = true;
    } else {
      formTitleIsOk = false;
    }
    changeButtonState();
  });
}

// Vérifie si une catégorie a été sélectionnée et met à jour l'état du formulaire
function checkCategory(){
  const category = document.getElementById('categorySelectBox')
  category.addEventListener("change",(event) =>{
  const categoryValue = event.target.value;
  if(categoryValue > 0 && categoryValue!= null && categoryValue != undefined){
      formCategoryIsOk = true;
  } else {
    formCategoryIsOk = false;
  }
  changeButtonState();
  })
}

// Change l'état du bouton de validation selon si tous les champs requis sont valides
function changeButtonState(){
  const validateFormButton = document.getElementById('validatePicture');
  if(formTitleIsOk && formCategoryIsOk && formImageFieldIsOk){
    validateFormButton.className = "validateButtonFormPicture";
  } else {
    validateFormButton.className = "invalidateButtonFormPicture";
  }
}

reloadWork();
reloadModal();
showWorks();
showOrHideUpdateButton();
showCategories();
initAuthZone();
showOrHideCategoryFilter();

