const submit_form = document.getElementById("submit_form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorDiv = document.getElementById("error");

async function login(user){

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST", headers: myHeaders, body: JSON.stringify({ "email": user.email, "password" : user.password }),
        
        });    if (!response.ok) {
            throw new Error("L'utilisateur n'existe pas");
        }
    
        const json = await response.json();
        console.log(json);
        return json;
        
    
}
async function loginEvent(event) {
    event.preventDefault();
    const emailValue = email.value;
    const passwordValue = password.value 
    const user = {
        email : emailValue,
        password : passwordValue
    }
    try {
        const response = await login(user);
        console.log(response);
        localStorage.setItem("token", response.token);
        window.location.href = "http://localhost:5500";
    } catch(error) {
        // alert(error);
        console.log(error.message);
        errorDiv.innerHTML = error.message;
    }
    
}
function initCheckToken() {
    const token = localStorage.getItem("token");
    console.log(token)
    let template = `<a href="./login.html">login</a>`;
    if(token!=undefined && token != null && token != "") {
        window.location.href = "http://localhost:5500";
    }
}
initCheckToken();

submit_form.addEventListener("click", loginEvent);