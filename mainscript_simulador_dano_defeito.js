
const spreadsheetID = '1qBM1j3cTvq3_xgHp-g9goMGppUoCW-Py-FjZ_tm7S7Y';

const urldados = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=684535765`;


const ATIVADO = true;

let objColunas = {};

let dadosFiltro;

let objResultado = {
    0: "",
    1: "",
    2: "",
    3: "",

};

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

function inserirSimulador() {


    obterDados(urldados).then(
        value => {

            let tabela = value.table.rows;

            let filtro = tabela.map((k) =>{
                return k['c'];
            });

            if(filtro[0].length > 0){
                let lista = [];
                for (let i = 0; i < filtro[0].length;i++){
                    lista.push(filtro[0][i].v);
                }
                objColunas = criarObjetoDeLista(lista);
            } 
        
            //remover o item 0
            filtro.shift();

            let cardContainer = document.getElementsByClassName("quiz-container");
            for (let key in objColunas) {
                if (objColunas.hasOwnProperty(key)) {
                    
                    let keyInt = parseInt(key);

                    let card = document.createElement("div");
                    card.classList.add('quiz-card');
                    card.id = `card-${keyInt+1}`;

                    if ((keyInt+1) == 1) {
                        card.classList.add('active');

                    }

                    let cabecalho = document.createElement("p");
                    cabecalho.innerHTML = `${objColunas[keyInt]}`
                    cabecalho.classList.add('cl_p_cabecalho');
                    card.appendChild(cabecalho);


                    let select = document.createElement("select");
                    select.id = `id_select_simulador_${keyInt}`;
                    select.classList.add('cl_select_simulador');

                    card.appendChild(select);

                    let aviso = document.createElement("p");
                    aviso.classList.add('cl_p_selectAviso');
                    aviso.innerHTML = "";
                    card.appendChild(aviso);

                    let blocoBotoes = document.createElement("div");
                    blocoBotoes.classList.add('cl_div_cardBotoes');

                    if(keyInt != 0) {
                        let botao1 = document.createElement("button");
                        botao1.innerHTML = "Anterior";
                        botao1.classList.add('cl_button_cardAnterior');
                        botao1.addEventListener("click", function () {
                            previousCard(keyInt+1);
                        });

                        blocoBotoes.appendChild(botao1);
                    }

                    
                    if(keyInt < ((Object.keys(objColunas).length)-1)) {
                        let botao2 = document.createElement("button");
                        botao2.innerHTML = "Próximo";
                        botao2.classList.add('cl_button_cardProximo');
                        botao2.addEventListener("click", function () {
                            nextCard(keyInt+1);
                        });

                        blocoBotoes.appendChild(botao2);
                    }else{
                        let botao2 = document.createElement("button");
                        botao2.innerHTML = "Finalizar";
                        botao2.classList.add('cl_button_cardProximo');
                        botao2.addEventListener("click", function () {
                        
                            mostrarResultado();
                        });

                        blocoBotoes.appendChild(botao2);
                    }
                    
                    card.appendChild(blocoBotoes);

                    cardContainer[0].appendChild(card);
                }

            }

            dadosFiltro = filtro;

            inserirOptions1();
            
            
        }
    ).catch(
        value => {
            console.log(value);
            
        }
    )

}

function inserirOptions1(){

    let lista_selects = document.getElementsByClassName("cl_select_simulador");
           
    lista_selects[0].innerHTML = '';

    let lista_opcoes = [];

    const option_padrao = document.createElement("option");
    option_padrao.value = "";
    option_padrao.text = "";

    lista_selects[0].appendChild(option_padrao);

    for (let i = 0; i < dadosFiltro.length; i++) {

        const option1 = document.createElement("option");

        let valor = dadosFiltro[i][0].v.toString();

        if (!lista_opcoes.includes(valor.toLocaleLowerCase())) {
            lista_opcoes.push(valor.toLocaleLowerCase());
            option1.value = valor;
            option1.text = valor;
            lista_selects[0].appendChild(option1);
        }

    }

    inserirOptions2();
    lista_selects[0].addEventListener("change", inserirOptions2);
    lista_selects[0].addEventListener("change", function () {
        objResultado[0] = lista_selects[0].value.toString();
    });
   
    cardVisivel("card-1");
    lista_selects[0].addEventListener("change", function () {
        cardVisivel("card-1");
    });
    
}


function inserirOptions2(){

    let lista_selects = document.getElementsByClassName("cl_select_simulador");

    lista_selects[1].innerHTML = '';
           
    let lista_opcoes = [];

    let valor_anteiror = lista_selects[0].value.toString();

    const option_padrao = document.createElement("option");
    option_padrao.value = "";
    option_padrao.text = "";

    lista_selects[1].appendChild(option_padrao);

    for (let i = 0; i < dadosFiltro.length; i++) {

        const option1 = document.createElement("option");

        let valor = dadosFiltro[i][1].v.toString();

        if ((!lista_opcoes.includes(valor.toLocaleLowerCase())) && (dadosFiltro[i][0].v.toString().toLocaleLowerCase() == valor_anteiror.toLocaleLowerCase())) {
            lista_opcoes.push(valor.toLocaleLowerCase());
            option1.value = valor;
            option1.text = valor;
            lista_selects[1].appendChild(option1);
        }


    }

    inserirOptions3();
    lista_selects[1].addEventListener("change", inserirOptions3);
    lista_selects[1].addEventListener("change", function () {
        objResultado[1] = lista_selects[1].value.toString();
    });

    cardVisivel("card-2");
    lista_selects[1].addEventListener("change", function () {
        cardVisivel("card-2");
    });

}


function inserirOptions3(){

    let lista_selects = document.getElementsByClassName("cl_select_simulador");

    lista_selects[2].innerHTML = '';
           
    let lista_opcoes = [];

    let valor_anteiror = lista_selects[1].value.toString();

    const option_padrao = document.createElement("option");
    option_padrao.value = "";
    option_padrao.text = "";

    lista_selects[2].appendChild(option_padrao);

    for (let i = 0; i < dadosFiltro.length; i++) {

        const option1 = document.createElement("option");

        let valor = dadosFiltro[i][2].v.toString();

        if ((!lista_opcoes.includes(valor.toLocaleLowerCase())) && (dadosFiltro[i][1].v.toString().toLocaleLowerCase() == valor_anteiror.toLocaleLowerCase())) {
            lista_opcoes.push(valor.toLocaleLowerCase());
            option1.value = valor;
            option1.text = valor;
            lista_selects[2].appendChild(option1);
        }

        

    }

    inserirOptions4();
    lista_selects[2].addEventListener("change", inserirOptions4);
    lista_selects[2].addEventListener("change", function () {
        objResultado[2] = lista_selects[2].value.toString();
    });

    cardVisivel("card-3");
    lista_selects[2].addEventListener("change", function () {
        cardVisivel("card-3");
    });
}

function inserirOptions4(){

    let lista_selects = document.getElementsByClassName("cl_select_simulador");

    lista_selects[3].innerHTML = '';
           
    let lista_opcoes = [];

    let valor_anteiror = lista_selects[2].value.toString();

    const option_padrao = document.createElement("option");
    option_padrao.value = "";
    option_padrao.text = "";

    lista_selects[3].appendChild(option_padrao);

    for (let i = 0; i < dadosFiltro.length; i++) {

        const option1 = document.createElement("option");

        let valor = dadosFiltro[i][3].v.toString();

        if ((!lista_opcoes.includes(valor.toLocaleLowerCase())) && (dadosFiltro[i][2].v.toString().toLocaleLowerCase() == valor_anteiror.toLocaleLowerCase())) {
            lista_opcoes.push(valor.toLocaleLowerCase());
            option1.value = valor;
            option1.text = valor;
            lista_selects[3].appendChild(option1);
        }

       

    }

    lista_selects[3].addEventListener("change", function () {
        objResultado[3] = lista_selects[3].value.toString();
    });

    cardVisivel("card-4");
    lista_selects[3].addEventListener("change", function () {
        cardVisivel("card-4");
    });
}

function insirirConteudo(){
    inserirBotoesMenu();
    inserirSimulador();
}



function nextCard(currentCardIndex) {
    const currentCard = document.getElementById(`card-${currentCardIndex}`);
    const nextCard = document.getElementById(`card-${currentCardIndex + 1}`);
  
    let select = currentCard.querySelector(".cl_select_simulador");

    if(!(select.value.toString().trim() == "")) {
        

        // Adiciona a classe para fazer o card atual sair da tela
        currentCard.classList.add('exit-left');
    
        // Remove a classe 'active' do card atual
        setTimeout(() => {

            while (currentCard.classList.contains('active')) {
                currentCard.classList.remove('active');
            }

            currentCard.classList.remove('exit-left'); // Reset

        }, 180); // Tempo de transição
    
        // Adiciona a classe 'active' ao próximo card
        if (nextCard) {
        nextCard.classList.add('active');
        cardVisivel(nextCard.id.toString());
        }
    }
  }

function previousCard(currentCardIndex) {
    const currentCard = document.getElementById(`card-${currentCardIndex}`);
    const previousCard = document.getElementById(`card-${currentCardIndex - 1}`);

    // Adiciona a classe para fazer o card atual sair da tela
    currentCard.classList.add('exit-right');

    // Remove a classe 'active' do card atual
    setTimeout(() => {
        while (currentCard.classList.contains('active')) {
            currentCard.classList.remove('active');
          }

        currentCard.classList.remove('exit-right'); // Reset

    }, 180); // Tempo de transição

    // Adiciona a classe 'active' ao próximo card
    if (previousCard) {
        previousCard.classList.add('active');
        cardVisivel(previousCard.id.toString());
    }
}

function cardVisivel(id) {
    let card = document.getElementById(`${id}`);
    let texto = card.querySelector(".cl_p_selectAviso");
    let select = card.querySelector(".cl_select_simulador");
    

    if(select.value.toString().trim() == "") {
        texto.innerHTML = "selecione uma opção";
    }else {
        texto.innerHTML = "";
    }

  }

function mostrarResultado(){

    let cardContainer = document.getElementsByClassName("quiz-container");
    const currentCard = document.getElementById("card-4");

    let select = currentCard.querySelector(".cl_select_simulador");

    if(!(select.value.toString().trim() == "")) {

        let card = document.createElement("div");
        card.classList.add('quiz-card');
        card.id = "card-5";

        let cabecalho = document.createElement("p");
        cabecalho.innerHTML = "Resultado";
        cabecalho.classList.add('cl_p_cabecalho');

        card.appendChild(cabecalho);

        for (let key in objColunas){
            let texto_resultado = document.createElement("p");
            texto_resultado.innerHTML = `${objColunas[key]}: ${objResultado[key]}`;
            texto_resultado.classList.add('cl_p_textoResultado');
            if(key == 3) {
                texto_resultado.classList.add('cl_p_textoResultadoManifestacao');
            }
            card.appendChild(texto_resultado);
        }

        let botao = document.createElement("button");
        botao.innerHTML = "Reiniciar Simulador";
        botao.classList.add('cl_button_reiniciar');
        botao.addEventListener("click", function () {
            location.reload(true);
        });

        card.appendChild(botao);
        cardContainer[0].appendChild(card);


        currentCard.classList.add('exit-left');
    
        // Remove a classe 'active' do card atual
        setTimeout(() => {

            while (currentCard.classList.contains('active')) {
                currentCard.classList.remove('active');
            }

            currentCard.classList.remove('exit-left'); // Reset

        }, 180); // Tempo de transição
    
        // Adiciona a classe 'active' ao próximo card
        if (card) {
            card.classList.add('active');
        
        }
    }

}

startSite(ATIVADO);

