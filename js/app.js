let works = [];
const gallery = document.getElementsByClassName("gallery");
const category = document.getElementsByClassName("category");


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

async function login(user){
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      body: JSON.stringify({ email: user.email, password : user.password }),
      
    });    if (!response.ok) {
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
  category[0].innerHTML = template;
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
showWorks();
showCategories();


