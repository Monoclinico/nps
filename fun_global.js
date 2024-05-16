const USUARIO = "avon";
const SENHA = "avon@2024";

function validarCPF(cpf) {
    if (cpf != null){
        let c = cpf.toString();
        return ((c.length == 11) && (/^\d+$/.test(c)) && (c != "00000000000"));
    }
    return false
}

function removerPontosEHifens(texto) {
    if (texto != null ){
        let t = texto.toString();
        let t2 = t.toString().replace(/\./g, '').replace(/-/g, '');
        return t2;
    }
    return "";
}

function inserirBotoesMenu(){
    let extremidade = "/"; // colocar / se for local host e /nps/ se for github
    let caminho_nps = "index.html";
    let caminho_indicadores = "indicadores.html";
    let caminho_chat = "chat.html";

    let urlBase = `http://${window.location.hostname}:${window.location.port}${extremidade}`;

    let botao_sair = document.getElementById("sair");
    let botao_nps = document.getElementById("pagina_nps");
    let botao_indicadores = document.getElementById("pagina_indicadores");
    let botao_chat = document.getElementById("pagina_chat");

    botao_nps.addEventListener("click", function () {
        let url = `${urlBase}${caminho_nps}`; 
        window.open(url.toString(), "_self");
    });
    botao_indicadores.addEventListener("click", function () {
        let url = `${urlBase}${caminho_indicadores}`; 
        window.open(url.toString(), "_self");
    });
    botao_chat.addEventListener("click", function () {
        let url = `${urlBase}${caminho_chat}`; 
        window.open(url.toString(), "_self");
    });

    botao_sair.addEventListener("click", function () {
        sessionStorage.clear();
        location.reload();
    });

}


function login() {
    let mascara_login = document.getElementById("mascara_login");
    let mascara_conteudo = document.getElementById("mascara_conteudo");

    let input_usuario = document.getElementById("usuario");
    let input_senha = document.getElementById("senha");

    let u = sessionStorage.getItem("usuario");
    let s = sessionStorage.getItem("senha");

    if((u == USUARIO) && (s == SENHA)){
        input_usuario.value =  sessionStorage.getItem("usuario");
        input_senha.value = sessionStorage.getItem("senha");
    }
    
    if ((SENHA == input_senha.value.toString()) && (USUARIO == input_usuario.value.toString())){

        mascara_login.style = "display: none;";
        mascara_conteudo.style = "display: block;";

        sessionStorage.setItem("usuario", USUARIO);
        sessionStorage.setItem("senha", SENHA);
        insirirConteudo();

    }else {
       let acesso = document.getElementById("acesso");
       mascara_login.style = "display: block;";
       mascara_conteudo.style = "display: none;";
       acesso.style = " display: block;";
    }
    
}

function startSite(estado){

    if (estado){
        let botao_logar = document.getElementById("btn_logar");
        botao_logar.addEventListener("click",login);
        let u = sessionStorage.getItem("usuario");
        let s = sessionStorage.getItem("senha");

        if((u == USUARIO) && (s == SENHA)){
            login();
        }

    }else{
        document.getElementById("fora").style.display = "block";

    }

}