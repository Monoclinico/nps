

const nomecpfID = "14VokMI9naR-pcZZMVkNyOhLhS4LQW6JyvdhnbaHApEs";
const urlNomeCPF = `https://docs.google.com/spreadsheets/d/${nomecpfID}/gviz/tq?tqx=out:json&tq&gid=1925747377`;

const spreadsheetID = '1pORUAqUrp-8Kj6k1-C8u2KdOCIZ5LN9NsqyjaC3EZiI';
const urldados = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=1914081637`;

const ATIVADO = true;

let dadosAcura = {};

let objColunas = {};

let dadosCPF = {};

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



function pesquisarNome(pesquisaCPF){
    let carregando = document.getElementById("carregando");
    carregando.style = "display: block;";

    obterDados(urlNomeCPF).then(
        value => {

            let CPF = removerPontosEHifens(pesquisaCPF.toString().toLowerCase().trim());
            
            if (validarCPF(CPF)) {

                let tabela = value.table.rows;
                let colunas1 = value.table.cols;

                let filtro = tabela.map((k) =>{
                    return k['c'];
                });

                let listaC = colunas1.map((coluna) => {
                    return coluna.label;
                });

                let objColunas1 = criarObjetoDeLista(listaC);

                let iCPF = parseInt(encontrarChavePorValor(objColunas1, "CPF"));
                let iNome1 = parseInt(encontrarChavePorValor(objColunas1, "NOME1"));
                let iNome2 = parseInt(encontrarChavePorValor(objColunas1, "NOME2"));

                let filtro2 = filtro.filter((k) =>{
                    let r1 = false;
                    let r2 = false;
                    if(k[iCPF] != null) {
                        if (k[iCPF].v != null){
                            r1 = preencherZerosCPF(k[iCPF].v.toString()).includes(CPF);
                        }
                        if (k[iCPF].f != null) {
                            r2 = preencherZerosCPF(k[iCPF].f.toString()).includes(CPF);
                        }

                    }
                    return (r1 || r2);
                });


                let nome1 = "";
                let nome2 = "";
                if(filtro2.length > 0) {
                    for (const valor of filtro2) {
                        if (valor[iNome1] != null){
                            if (valor[iNome1].v !=null) {
                                nome1 = valor[iNome1].v.toString().trim().toUpperCase();
                            }
                        }
                        if (valor[iNome2] != null){
                            if (valor[iNome2].v !=null) {
                                nome2 = valor[iNome2].v.toString().trim().toUpperCase();
                            }
                        }
                    }
                }

                dadosCPF = {
                    n1: nome1, 
                    n2: nome2
                }
                pesquisar(dadosCPF);

            }else{
                resultadoIncorreto("Nenhum registro foi encontrado");
                carregando.style = "display: none;";
            }
            
        }
    ).catch(
        value => {
            //console.log(value);
            resultadoIncorreto("Erro Interno");
            carregando.style = "display: none;";
        }
    )
}


function pesquisar(dadosNomes){
    let carregando = document.getElementById("carregando");
    carregando.style = "display: block;";

    obterDados(urldados).then(
        value => {

            if (validarNome(dadosNomes)) {

                let tabela = value.table.rows;
                let colunas1 = value.table.cols;

                let filtro = tabela.map((k) =>{
                    return k['c'];
                });

                let listaC = colunas1.map((coluna) => {
                    return coluna.label;
                });

                objColunas = criarObjetoDeLista(listaC);;

                let iProprietario = parseInt(encontrarChavePorValor(objColunas, "PROPRIETÁRIO"));
               
                let filtro2 = filtro.filter((k) =>{
                    let r1 = false;
                    let r2 = false;
                    let r3 = false;
                    let r4 = false;
  
                    if (k[iProprietario ] != null) {
                        if (k[iProprietario].v != null) {
                            if (dadosNomes["n1"].length > 0){
                                r1 = k[iProprietario].v.toString().trim().toUpperCase().includes(dadosNomes["n1"]);
                            }
                            if (dadosNomes["n2"].length > 0){
                                r2 = k[iProprietario].v.toString().trim().toUpperCase().includes(dadosNomes["n2"]);
                            }
                        }
                        if (k[iProprietario].f != null) {
                            if (dadosNomes["n1"].length > 0){
                                r3 = k[iProprietario].f.toString().trim().toUpperCase().includes(dadosNomes["n1"]);
                            }
                            if (dadosNomes["n2"].length > 0){
                                r4 = k[iProprietario].f.toString().trim().toUpperCase().includes(dadosNomes["n2"]);
                            }
                        }

                    }
                    return (r1 || r2 || r3 || r4);
                });

                dadosAcura = filtro2;
                criarTabelaHTML();
                
            }else{
                resultadoIncorreto("Nenhum registro foi encontrado");
            }

           carregando.style = "display: none;";
            
        }
    ).catch(
        value => {
            //console.log(value);
            resultadoIncorreto("Erro Interno");
            carregando.style = "display: none;";
        }
    )
}

function criarTabelaHTML() {

    let iData = parseInt(encontrarChavePorValor(objColunas, "CRIAÇÃO"));

    let divResultados = document.getElementById("resultados");
    divResultados.textContent = '';

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var trCabecalho = document.createElement("tr");


    for (const chave in objColunas) {
        if (objColunas[chave] != ""){
            let th = document.createElement("th");
            th.textContent = objColunas[chave];
            trCabecalho.appendChild(th);
        }
    }

    thead.appendChild(trCabecalho);

    if (dadosAcura.length > 0){
       
        let tabela = document.createElement("table");
        tabela.setAttribute("id","tabela");

        tabela.appendChild(thead);
        
        let keys = Object.keys(objColunas);
        
        for (let y = 0; y < dadosAcura.length;y++) {

            let linhaTabela = tbody.insertRow();

            for (let x = 0; x < keys.length; x++) {
                
                if(objColunas[keys[x]] != ""){

                    var celulaTabela = linhaTabela.insertCell();
                    let valor;
                    if (x == iData){

                        if(dadosAcura[y][x] == null ) {
                            valor = "";
                        }else{
                            valor = dadosAcura[y][x].f != null ? dadosAcura[y][x].f : "";
                        }

                    }else{
                        if(dadosAcura[y][x] == null ) {
                            valor = "";
                        }else{
                            valor = dadosAcura[y][x].v != null ? dadosAcura[y][x].v : "";
                        }
                    }


                    if (valor == null) {
                        valor = "";
                    }else{
                        valor = valor.toString();
                    }

                    celulaTabela.textContent = valor;

                }
            }

        }


        tabela.appendChild(tbody);
        divResultados.appendChild(tabela);
        divResultados.style = "display: flex;";

    }else{
        resultadoIncorreto("Nenhum registro foi encontrado");
    }
    
}

function resultadoIncorreto(mensagem){
    let divResultados = document.getElementById("resultados");
    let frase = document.createElement("p");

    frase.innerHTML = mensagem.toString();
    frase.classList.add("mensagem_erro");
    divResultados.textContent = '';
    divResultados.appendChild(frase);
    divResultados.style = "display: flex;";


}

function moverResultado(){
    const resultadosDiv = document.getElementById('resultados');
    
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    resultadosDiv.addEventListener('mousedown', (e) => {
        isDragging = true;
        resultadosDiv.classList.add('active');
        startX = e.pageX - resultadosDiv.offsetLeft;
        startY = e.pageY - resultadosDiv.offsetTop;
        scrollLeft = resultadosDiv.scrollLeft;
        scrollTop = resultadosDiv.scrollTop;
    });

    resultadosDiv.addEventListener('mouseleave', () => {
        isDragging = false;
        resultadosDiv.classList.remove('active');
    });

    resultadosDiv.addEventListener('mouseup', () => {
        isDragging = false;
        resultadosDiv.classList.remove('active');
    });

    resultadosDiv.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - resultadosDiv.offsetLeft;
        const y = e.pageY - resultadosDiv.offsetTop;
        const walkX = (x - startX) * 1.5; // Ajuste a sensibilidade do scroll
        const walkY = (y - startY) * 1.5; // Ajuste a sensibilidade do scroll
        resultadosDiv.scrollLeft = scrollLeft - walkX;
        resultadosDiv.scrollTop = scrollTop - walkY;
    });
}



function inserirPesquisa() {

    let pesquisaBotao = document.getElementById("pesquisa");
    let pesquisaCPF = document.getElementById("input_cpf");
    pesquisaBotao.addEventListener("click", function () {
        pesquisarNome(pesquisaCPF.value);
    })
}

function insirirConteudo(){
    inserirPesquisa();
    inserirBotoesMenu();
    moverResultado();
}

startSite(ATIVADO);

