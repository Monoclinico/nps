let spreadsheetID_indicadores = "1pORUAqUrp-8Kj6k1-C8u2KdOCIZ5LN9NsqyjaC3EZiI";

let urldados = `https://docs.google.com/spreadsheets/d/${spreadsheetID_indicadores}/gviz/tq?tqx=out:json&tq&gid=0`;


let urlmeta = `https://docs.google.com/spreadsheets/d/${spreadsheetID_indicadores}/gviz/tq?tqx=out:json&tq&gid=75941007`;


const ATIVADO = true;

let objColunas = {};
let CPF = "";
let dadosIndicadores = {};

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



function pesquisar(pesquisaCPF){
    let carregando = document.getElementById("carregando");
    carregando.style = "display: block;";

    obterDados(urldados).then(
        value => {

            CPF = removerPontosEHifens(pesquisaCPF.toString().toLowerCase().trim());

            if (validarCPF(CPF)) {
           
                let tabela = value.table.rows;

                let dadosIndicadoresCabecalho = value.table.cols;

                let filtro = tabela.map((k) =>{
                    return k['c'];
                });
                
                let listaC = dadosIndicadoresCabecalho.map((coluna) => {
                    return coluna.label;
                });

                objColunas = transformarObjeto(criarObjetoDeLista(listaC));

                dadosParametros = filtro[0];

                let iCPF = parseInt(encontrarChavePorValor2(objColunas, "CPF"));

                let filtro2 = filtro.filter((k) =>{
                    let r1 = -1;
                    let r2 = -1;

                    if(k[iCPF] != null) {
                        if (k[iCPF].v != null){
                            r1 = preencherZerosCPF(k[iCPF].v.toString().trim()).search(CPF);
                        }
                        if (k[iCPF].f != null) {
                            r2 = preencherZerosCPF(k[iCPF].f.toString().trim()).search(CPF);
                        }
                    }
                    return ((r1 > -1) ||( r2 > -1) );
                });

                dadosIndicadores = filtro2;
                criarTabelaHTML();

            }else{
                resultadoIncorreto("Nenhum registro foi encontrado");
            }

           carregando.style = "display: none;";
            
        }
    ).catch(
        value => {
            resultadoIncorreto("Erro Interno");
            //console.log(value);
            carregando.style = "display: none;";
        }
    )
}

function criarTabelaHTML() {

    let divResultados = document.getElementById("resultados");
    divResultados.textContent = '';

    let tamanhoObjeto = Object.keys(objColunas).length;

    if ((dadosIndicadores.length > 0) && (tamanhoObjeto > 0 )){


        for (let lin = 0; lin < dadosIndicadores.length; lin++){

            let linha = document.createElement("div");
            linha.classList.add("resultados_linha");

            let linha_quebra_1 = document.createElement("div");
            linha_quebra_1.classList.add("resultados_quebra_linha");

            let linha_quebra_2 = document.createElement("div");
            linha_quebra_2.classList.add("resultados_quebra_linha");

            let linha_atual = 1;
           
            for (const chave in objColunas) {
               // {6: {t: "TMA (VOZ) (403%)", v: "403"}}

                let valor1 = "";
                let param1 = objColunas[chave]["v"];
                let cabec1 = objColunas[chave]["t"];
                if (dadosIndicadores[lin] != null){
                    if(dadosIndicadores[lin][chave] != null){
                        let v1 = dadosIndicadores[lin][chave].v != null ? dadosIndicadores[lin][chave].v : "";
                        let v2 = dadosIndicadores[lin][chave].f != null ? dadosIndicadores[lin][chave].f : "";
                        valor1 = formatarPorcentagem(v1.toString(), v2.toString());
                    }
                }


                let indicador = document.createElement("div");
                indicador.classList.add("resultados_filhos");

                let p_label = document.createElement("p");
                p_label.classList.add("label_cabecalho");

                let p_valor = document.createElement("p");
                p_valor.classList.add("label_valor");

                p_label.innerHTML = cabec1;

                let e_num = 0.0;
                let p_num = 0.0;
                let vali_num = validarNumero(valor1);
                let vali_num_p = validarNumero(param1);

                if (vali_num){
                    e_num = parseFloat(valor1);
                }

                if (vali_num_p){
                    p_num = parseFloat(param1);
                }


                switch (true){

                    case (cabec1.includes("CPF")):
                        p_valor.innerHTML = preencherZerosCPF(valor1.toString().trim());
                        break;

                    case (cabec1.includes("ABS")):
    
                        if (vali_num && vali_num_p){
                            if (e_num <= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }
    
                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    case (cabec1.includes("ADERÊNCIA")):

                        if (vali_num && vali_num_p){
                            if (e_num >= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }
    
                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}%`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    case (cabec1.includes("QUALIDADE")):

                        if (vali_num && vali_num_p){
                            if (e_num >= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}%`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;
                    
                    case (cabec1.includes("TMA (VOZ)")):

                        if (vali_num && vali_num_p){
                            if (e_num <= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;
                    case (cabec1.includes("TMA (CHAT)")):

                        if (vali_num && vali_num_p){
                            if (e_num <= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;
                    case (cabec1.includes("TABULAÇÃO")):

                        if (vali_num && vali_num_p){
                            if (e_num >= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}%`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    case (cabec1.includes("NCG")):

                        if (vali_num && vali_num_p){
                            if (e_num <= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    case (cabec1.includes("ACURACIDADE")):
                    
                        if (vali_num && vali_num_p){
                            if (e_num >= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}%`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    default:
                        p_valor.innerHTML = `${valor1}`;

                }

                
                if (cabec1.includes("ABS")){
                    linha_atual = 2;
                }

                indicador.appendChild(p_label);
                indicador.appendChild(p_valor);

                if (linha_atual == 1){
                    linha_quebra_1.appendChild(indicador);
                }else{
                    linha_quebra_2.appendChild(indicador);
                }


            }
            linha.appendChild(linha_quebra_1);
            linha.appendChild(linha_quebra_2);
            divResultados.appendChild(linha);
            divResultados.style = "display: flex;";
        }

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

function inserirAtualizacao(){
    let data_inicio = document.getElementById("data_atualizacao_inicio");

    let data_fim = document.getElementById("data_atualizacao_fim");

    obterDados(urlmeta).then(
        value => {
            let tabela = value.table.rows;
         
            data_inicio.innerHTML = (tabela['1']['c'][0].v);
            data_fim.innerHTML = (tabela['1']['c'][1].v);
            
        }
    ).catch(
        value => {
           
            data_inicio.innerHTML = "---";
            data_fim.innerHTML = "---";
        }
    )
}

function inserirPesquisa() {

    let pesquisaBotao = document.getElementById("pesquisa");
    let pesquisaCPF = document.getElementById("input_cpf");
    pesquisaBotao.addEventListener("click", function () {
        pesquisar(pesquisaCPF.value);
        
    })
}


function insirirConteudo(){
    inserirPesquisa();
    inserirAtualizacao();
    inserirBotoesMenu();
}

startSite(ATIVADO);
