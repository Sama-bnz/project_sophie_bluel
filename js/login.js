const submit_form = document.getElementById("submit_form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorDiv = document.getElementById("error");

// Fonction asynchrone de connexion de l'utilisateur
async function login(user){

    // Création de l'en-tête HTTP avec le type de contenu JSON
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Envoi de la requête HTTP POST à l'API de connexion avec l'email et le mot de passe
    const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST", headers: myHeaders, body: JSON.stringify({ "email": user.email, "password" : user.password }),
    });
    // Si la réponse n'est pas OK (erreur HTTP), lancer une erreur
    if (!response.ok) {
        throw new Error("L'utilisateur n'existe pas");
    }
    // Si la réponse est OK, parse le JSON reçu en réponse
    const json = await response.json();
    return json;     
}
// Fonction de gestion de l'événement de connexion, appelée lors de la soumission du formulaire
async function loginEvent(event) {
    event.preventDefault();
    // Récupération des valeurs d'email et de mot de passe des champs de formulaire
    const emailValue = email.value;
    const passwordValue = password.value

    // Création de l'objet utilisateur avec les valeurs récupérées
    const user = {
        email : emailValue,
        password : passwordValue
    }
    try {
        // Appel de la fonction login pour envoyer la requête de connexion
        const response = await login(user);
        // Stockage du token reçu dans le localStorage pour persistance de la session
        localStorage.setItem("token", response.token);
        // Redirection vers la page principale une fois connecté
        window.location.href = "http://localhost:5500";
    } catch(error) {
        errorDiv.innerHTML = error.message;
    }
    
}
// Fonction pour vérifier si un token est déjà présent dans le localStorage lors du chargement de la page
function initCheckToken() {
    const token = localStorage.getItem("token");
    console.log(token)
    // Template de lien vers la page de connexion, au cas où il n'y aurait pas de token
    let template = `<a href="./login.html">login</a>`;
    // Si le token est défini (non null et non vide), redirige directement vers la page principale
    if(token!=undefined && token != null && token != "") {
        window.location.href = "http://localhost:5500";
    }
}
// Appel de la fonction initCheckToken pour vérifier le token lors du chargement de la page
initCheckToken();
// Ajout d'un event listener sur le bouton de soumission du formulaire pour lancer loginEvent
submit_form.addEventListener("click", loginEvent);