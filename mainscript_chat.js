const USUARIO = "avon";
const SENHA = "avon@chat";
const ATIVADO = true;


async function obterDados(link){

    let data = await fetch(link);
    let texto1 = await data.text()
    let texto2 = texto1.replaceAll(
        "/*O_o*/\ngoogle.visualization.Query.setResponse(",
        ""
    );    
    let texto3 = texto2.replace(
        ");",
        ""
    );

    return JSON.parse(texto3);
}


function resizeDiv() {
    let bloco = document.getElementById('chat_arti');
    let largura = window.innerWidth;
    if (largura > 730){
        largura = 730;
    }
    let altura = window.innerHeight;
    bloco.style.width = `${largura}px`;
    bloco.style.height = `${altura}px`;
}

function inserirChatArti() {
    resizeDiv();
    !function(t,e){
        t.artibotApi={l:[],t:[],on:function(){this.l.push(arguments)},trigger:function(){this.t.push(arguments)}};
        var a=!1,i=e.createElement("script");
        i.async=!0,i.type="text/javascript",i.src="https://app.artibot.ai/loader.js",e.getElementsByTagName("head").item(0).appendChild(i),i.onreadystatechange=i.onload=function(){if(!(a||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState)){new window.ArtiBot({i:"c362606f-74c9-4d3f-b456-56776eee4c80",em:{id:'1710130803791',w:'',h:'',sh:true,tb:true}});
        a=!0}}
    }(window,document);

}

function login() {
    let bloco_login = document.getElementById("id_bloco_login");
    let input_usuario = document.getElementById("usuario");
    let input_senha = document.getElementById("senha");

    let bloco_principal_menu = document.getElementById("bloco_principal_menu");

    let u = sessionStorage.getItem("usuario_chat");
    let s = sessionStorage.getItem("senha_chat");

    if((u == USUARIO) && (s == SENHA)){
        input_usuario.value =  sessionStorage.getItem("usuario_chat");
        input_senha.value = sessionStorage.getItem("senha_chat");
    }
    
    if ((SENHA == input_senha.value.toString()) && (USUARIO == input_usuario.value.toString())){
        bloco_login.style = "display: none;";
        bloco_principal_menu.style = "display: flex;";


        sessionStorage.setItem("usuario_chat", USUARIO);
        sessionStorage.setItem("senha_chat", SENHA);
        inserirChatArti();

        botoesMenu();

    }else {
       let acesso = document.getElementById("acesso");
       acesso.style = " display: block;";
    }
    

}


function botoesMenu(){
    let extremidade = "/nps/"; // colocar / se for local host e /nps/ se for github
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

window.addEventListener('resize', resizeDiv);

let botao_logar = document.getElementById("btn_logar");

if (ATIVADO){
    botao_logar.addEventListener("click",login);
    let u = sessionStorage.getItem("usuario_chat");
    let s = sessionStorage.getItem("senha_chat");

    if((u == USUARIO) && (s == SENHA)){
        login();
    }

}else{
    document.getElementById("fora").style.display = "block";

}