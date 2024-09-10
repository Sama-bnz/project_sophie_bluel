const gallery = document.getElementsByClassName("gallery");
console.log(gallery[0]);
gallery.innerHTML = "<h1>gdgdg</h1>";


async function loadWorks() {
    const url = "http://localhost:5678/api/works";
    
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

loadWorks();

function templateWork(workLabel, workImage) {
    return `<figure>
				<img src="assets/images/${workImage}" alt="${workLabel}">
				<figcaption>${workLabel}</figcaption>
			</figure>`;
}

async function showWorks() {
    const works = await loadWorks();
    let template = "";
    console.log(works);
    works.forEach((work) => {
        console.log(work.title);
        template+=templateWork(work.title,work.imageUrl)
      });
    console.log(template);
}
showWorks();