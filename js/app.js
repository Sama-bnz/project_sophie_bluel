let works = [];
const gallery = document.getElementsByClassName("gallery");
const category = document.getElementsByClassName("category");
const authentication = document.getElementById("authentication");
const favDialog = document.getElementById('favDialog');

async function fetchData (url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
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
    buildWorksTemplateList(works);
}
function buildWorksTemplateList(works) {
  let template = "";
    console.log(works);
    works.forEach((work) => {
        console.log(work.title);
        template+=templateWork(work.title,work.imageUrl)
      });
    console.log(template);
    gallery[0].innerHTML = template;
}

async function showCategories() {
  const categories = await loadCategory();
  let template = `<div onclick="loadWorkByCategory(event);" id="0" class="category_label">Tous</div>`;
  console.log(categories);
  categories.forEach((category) => {
      console.log(category.id);
      template+=templateCategory(category)
    });
  console.log(template);
  template += `<button id="showModale">Modifier</button>`
  category[0].innerHTML = template;
  showModale();

}
function loadWorkByCategory(element){
  console.log(element.target.id);
  let index = element.target.id;
  console.log(works);
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
  console.log(token)
  let template = `<a href="./login.html">login</a>`;
  if(token!=undefined && token != null && token != "") {
    template = `<a href="#" id="logout">logout</a>`
  }
  authentication.innerHTML = template;
  console.log(template);
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
  buttonModale.addEventListener('click', () => {
    favDialog.showModal();
  });
}

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
showWorks();
showCategories();
initAuthZone();


