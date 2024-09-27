const USUARIO = "avon";
const SENHA = "avon@2024";

function validarCPF(cpf) {
    if (cpf != null){
        let c = cpf.toString();
        return ((c.length == 11) && (/^\d+$/.test(c)) && (c != "00000000000"));
    }
    return false
}

function validarNome(nomes) {
    let teste = false;
    
    for (const v in nomes){
        if (nomes[v] != ""){
            teste = true;
        }
    }
    return teste;
}

function removerPontosEHifens(texto) {
    if (texto != null ){
        let t = texto.toString();
        let t2 = t.toString().replace(/\./g, '').replace(/-/g, '');
        return t2.trim();
    }
    return "";
}

function inserirBotoesMenu(){
    let extremidade = "/"; // colocar / se for local host e /nps/ se for github
    let host = window.location.hostname;
    if (host.toString().includes("github")){
        extremidade = "/nps/";
    }

    let caminho_nps = "index.html";
    let caminho_indicadores = "indicadores.html";
    let caminho_acuracidade = "acuracidade.html";
    let caminho_chat = "chat.html";

    let urlBase = `http://${window.location.hostname}:${window.location.port}${extremidade}`;

    let botao_sair = document.getElementById("sair");
    let botao_nps = document.getElementById("pagina_nps");
    let botao_indicadores = document.getElementById("pagina_indicadores");
    let botao_acuracidade = document.getElementById("pagina_acuracidade");
    let botao_chat = document.getElementById("pagina_chat");

    botao_nps.addEventListener("click", function () {
        let url = `${urlBase}${caminho_nps}`; 
        window.open(url.toString(), "_self");
    });
    botao_indicadores.addEventListener("click", function () {
        let url = `${urlBase}${caminho_indicadores}`; 
        window.open(url.toString(), "_self");
    });
    botao_acuracidade.addEventListener("click", function () {
        let url = `${urlBase}${caminho_acuracidade}`; 
        window.open(url.toString(), "_self");
    });
    botao_chat.addEventListener("click", function () {
        let url = `${urlBase}${caminho_chat}`; 
        window.open(url.toString(), "_self");
    });

    botao_sair.addEventListener("click", function () {
        sessionStorage.clear();
        startSite(true);
        location.reload();
        console.clear();
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
        input_usuario.value =  u;
        input_senha.value =  s;
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
        let x = setTimeout(function () { console.clear();}, 3000);
    }else{
        document.getElementById("fora").style.display = "block";

    }

}

function criarObjetoDeLista(lista) {
    const objeto = {};
    for (let indice = 0; indice < lista.length; indice++) {
        objeto[String(indice)] = lista[indice];
    }
    return objeto;
}

function encontrarChavePorValor(objeto, valor) {
    for (const chave in objeto) {
        if (objeto[chave].toString().toUpperCase() === valor.toString().toUpperCase()) {
            return chave;
        }
    }
    return null; // Retorna null se o valor não for encontrado em nenhuma chave
}

function encontrarChavePorValor2(objeto, valor) {
    //{6: {t: "TMA (VOZ) (403)", v: "403"}}
    for (const chave in objeto) {
        if (objeto[chave]["t"].toString().toUpperCase().includes( valor.toString().toUpperCase())) {
            return chave;
        }
    }
    return null; // Retorna null se o valor não for encontrado em nenhuma chave
}

function preencherZerosCPF(cpfp) {
    const cpfPadrao = "00000000000";

    let cpf = limparString(cpfp.toString().trim());

    if (cpf.length < 11) {
        const zerosFaltantes = 11 - cpf.length;
        cpf = cpfPadrao.substring(0, zerosFaltantes) + cpf;
    }

    return cpf;
}


function limparString(string) {
    return string.replace(/[.\-\s]/g, '');
}

function validarNumero(n) {
    let numberPattern = /^[0-9]+(?:[,\.][0-9]+)?$/;
    return numberPattern.test(n);
}

function removerPercentagem(string) {
    return string.replace(/%/g, '');
}

function formatarPorcentagem(v1, v2) {
    let valor1 = v1.toString();
    let valor2 = v2.toString();



    if (valor1.includes('%')) {
        return valor1.replace('%', '');
    } else if (valor2.includes('%')) {
        return valor2.replace('%', '');
    } else {
        return valor1;
    }
}

function transformarObjeto(objeto) {
    const novoObjeto = {};
    for (const chave in objeto) {
        let m1 = objeto[chave];
        m1 = m1.replaceAll(")(", ') (').trim();
        let l1 =  m1.split(" ");

        let valor = "";
        for (let x=0 ;x < l1.length ;x++) {
          let n1 = /\d/.test(l1[x]);  
          if (n1) {
            valor = l1[x].replaceAll("(", '').replaceAll(")", '').replaceAll("%", '').trim();
          }
        }

        novoObjeto[chave] = {
            t: m1.toString(),
            v: valor.toString()
        };
    }

    return novoObjeto;
}

function pegarHorarioAtual() {
    const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

function hasNonEmptyLabel(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (obj[key].label !== '') {
                return true;
            }
        }
    }
    return false;
}