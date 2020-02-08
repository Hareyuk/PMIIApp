var listObjs=
[{
    alt: "g_volt",
    id: 00,
    found: 0
},
{
    alt:"s_lefara",
    id: 01,
    found: 0
},
{
    alt:"h_kylian",
    id: 02,
    found: 0
},
{
    alt:"n_moskana",
    id: 03,
    found: 0
},
{
    alt:"g_nina",
    id: 04,
    found: 0
},
{
    alt:"n_krono",
    id: 05,
    found: 0
},
{
    alt:"m_camile",
    id: 06,
    found: 0
},
{
    alt:"b_aimal",
    id: 07,
    found: 0
},
{
    alt:"g_lianna",
    id: 08,
    found: 0
},
{
    alt:"h_aliza",
    id: 09,
    found: 0
},
{
    alt:"m_hannah",
    id: 10,
    found: 0
},
{
    alt:"s_abatharus_krozers",
    id: 11,
    found: 0
},
{
    alt:"g_zerner",
    id: 12,
    found: 0
},
{
    alt:"s_johan",
    id: 13,
    found: 0
},
{
    alt:"b_harushu",
    id: 14,
    found: 0
},
{
    alt:"m_gob",
    id: 15,
    found: 0
},
{
    alt:"h_erick",
    id: 16,
    found: 0
},
{
    alt:"s_xiana",
    id: 17,
    found: 0
},
{
    alt:"monster",
    id: 18,
    found: 0
}];
var dataGame;
var matrixGame = [];
var canClick = true;
var players = [];
var turn;
var size;
var finishingPair = 0;
var theme = document.getElementById("theme");
theme.volume = 0.4;

// elements that form the table
var table = document.getElementById('memo');
var tbody = document.createElement("tbody");
//var rows = document.createElement("tr");
//var row = document.createElement("tr");
//var rows = [];
//var finishedCard;
var cardAux = null;
var characterAux = null;
var posAuxI = null;
var posAuxJ = null;

// swaped0 and swaped1 are the cards that are curently swaped. Swaped is a value to change between positions. Swaped1 es el equivalente de character aux
var swap = 0;
var character0 = null;
var card0 = null;
var character1 = null;
var card1 = null;

function loadData()
{
    dataGame = localStorage.getItem('dataMT');
    dataGame = JSON.parse(dataGame);
    players = localStorage.getItem('players');
    players = JSON.parse(players);
    if(dataGame.dataSaved == true)
    {
        getData();
    }
    if (finishingPair < size*size-1)
    {
        buildTable();   
        document.getElementById('rowsAndCols').disabled = true;
    }
}

function getData()
{
    matrixGame = dataGame.matrix;
    size = dataGame.size;
    finishingPair = dataGame.pairsFound;
    turn = dataGame.turn;
}

function saveData()
{
    dataGame.dataSaved = true;
    dataGame.matrix = matrixGame;
    dataGame.pairsFound = finishingPair;
    dataGame.size = size;
    dataGame.turn = turn;
    localStorage.setItem('dataMT', JSON.stringify(dataGame))
    localStorage.setItem('players', JSON.stringify(players))
}

function showPoints(){
    document.getElementById("info").classList.remove("hidden");
    document.getElementById("turnos").innerHTML = "Es el turno del jugador " + players[(turn-1)].nick;
    document.getElementById("point1").innerHTML = players[0].nick + ": " + players[0].pointMT;
    document.getElementById("point2").innerHTML = players[1].nick + ": " + players[1].pointMT;
}

function selectTable()
{
    dataGame.dataSaved = false;
    localStorage.setItem('dataMT', JSON.stringify(dataGame));
    players[0].pointMT = 0;
    players[1].pointMT = 0;
    finishingPair = 0;
    var select = document.getElementById('rowsAndCols');
    size = select.value;
    select.disabled = true;
    select.value = "Seleccionar";
    size = parseInt(size);
    var arrayTwice = fillArrayTwice((size*size), listObjs);
    buildMatrix(arrayTwice);
    buildTable();
}

function setPlayer() {
    return genRandom(1,3);
}

function buildMatrix(arrayElements)
{   
    //Restart values
    matrixGame = [];
    //Finished restarting
    //Create Rows
    for(i=0; i<size; i++)
    {
        matrixGame.push([]);
        //Create columns
        for(j=0; j<size; j++)
        {
            matrixGame[i].push([]);
            //Put a character random in matrix
            var posRandom = genRandom(0,arrayElements.length);
            matrixGame[i][j] = arrayElements[posRandom];
            arrayElements.splice(posRandom, 1);
            //finishedCard.appendChild();
        }
    }
}

function buildTable()
{
    document.getElementById("restart").disabled = false;
    turn = setPlayer();
    table.innerHTML = "";
    for(i=0;i<size;i++)
    {
        var fRow = document.createElement("tr");
        for(j=0;j<size;j++)
        {
            var dataCard = createCards(i,j,matrixGame[i][j]);
            fRow.appendChild(dataCard);
        }
        table.appendChild(fRow);
    }
    showPoints();
}

function createCards(a,b,objectArray) {
    var cols = document.createElement("td");
    var card = document.createElement("div");
    //This will have this class only wasn't found
    if(matrixGame[a][b].found == 0) card.setAttribute("class","theCard reverse");
    else card.setAttribute("style","transform: rotateY(180deg);");
    
    if (matrixGame[a][b].found == 1) card.setAttribute("class", "theCard find1");
    else if(matrixGame[a][b].found == 2) card.setAttribute("class", "theCard find2");
    //card.setAttribute("id", ""+array.id+"");
    var front = document.createElement("div");
    front.setAttribute("class","theFront");
    var back = document.createElement("div");
    back.setAttribute("class","theBack");

    //set image
    var img = document.createElement("img");

    img.setAttribute("src","assets/images/"+objectArray.alt+".png");
    img.setAttribute("id", ""+objectArray.id);
    img.setAttribute("alt", "reverse");

    //for the onion card:
    if (img.id == "18") back.setAttribute("style", "background-color:black")

    card.setAttribute("onclick", "swapIt("+a+","+b+",this)");

    cols.insertAdjacentElement("beforeend", card);
    card.insertAdjacentElement("beforeend", front);
    card.insertAdjacentElement("beforeend", back);
    back.insertAdjacentElement("beforeend", img);
    //al parecer esto es más rápido que appendChild owo? : https://jsperf.com/insertadjacenthtml-vs-innerhtml-vs-appendchild https://stackoverflow.com/questions/16126960/what-is-the-difference-between-appendchild-insertadjacenthtml-and-innerhtml

    return cols;
}


function swapIt(pos1,pos2,card) {
    var clase = card.classList;
    if (canClick == true) {
        if(clase == "theCard reverse"){
            turnCard(card,false);
            console.log("the card was not swapped and now is");
            // console.log(rotated);

            card.classList.remove("reverse");

            var character = matrixGame[pos1][pos2];

            //guardar la carta
            if (cardAux == null) {
                cardAux = card;
                characterAux = character;
                //saving positions from selected first card
                posAuxI = pos1;
                posAuxJ = pos2;

                console.log("card saved");
                //console.log(rotated);
            }
            //ya fue guardada
            else{
                console.log("a card was already swapped, this is the secong one to be selected");

                //If are pair, let images how are they and set cardAux to null
                if(characterAux.id == character.id){
                    var classAdd;
                    var points;
                    if (characterAux.id == 07 || characterAux.id == 02 || characterAux.id == 06){
                        points = 250 * size;
                    }else{
                        points = 100 * size;
                    }
                    if (turn ==  1) {
                        players[0].pointMT += points;
                        classAdd = "find1";
                    }else{
                        players[1].pointMT += points;
                        classAdd = "find2";
                    }
                    matrixGame[pos1][pos2].found = turn;
                    matrixGame[posAuxI][posAuxJ].found = turn;

                    //estilo
                    card.classList.add(classAdd);
                    cardAux.classList.add(classAdd);

                    //resetar propiedades
                    cardAux=null;
                    characterAux=null;
                    posAuxI = null;
                    posAuxJ = null;
                    showPoints();
                    //Validar que terminó el juego
                    endGame();
                }
                //si no son pares
                else{
                    console.log("both cards should turn back now");
                    canClick = false;
                    setTimeout(function() {
                        turnCard(card, true);
                        turnCard(cardAux, true);
                        //console.log(rotated);
                        //Monster?
                        if (characterAux.id == 18 || character.id == 18){
                            console.log("onion spoted! -750 points to current player")
                            if (turn == 1) {
                                players[0].pointMT -= 750;
                            }else{
                                players[1].pointMT -= 750;
                            }
                        }
                        card.classList.add("reverse");
                        cardAux.classList.add("reverse");
                        canClick = true; 
                        changeTurn();
                        showPoints();
                        cardAux = null;
                        characterAux=null;
                        posAuxI = null;
                        posAuxJ = null;
                    }, 700)
                }
            }
            //Save the state game
            saveData();
        }
        else{
            console.log("this card is already swapped");
        }
    }
}

function changeTurn(){
    if(turn==1){
        turn=2;
        console.log("le toca al jugador 2")
    }else{
        turn=1;
        console.log("le toca al jugador 1")
    }
}

//var rotated = false;

function turnCard(card,rotated) {
    if(rotated == false){
        card.setAttribute("style","transform: rotateY(180deg);");
    }
    if(rotated == true){
        card.setAttribute("style","transform: rotateY(0deg);");
    }
    
}

function endGame() {
    finishingPair += 2;

    if (finishingPair >= size*size-1)
    {
        winPlayer();
        var select = document.getElementById('rowsAndCols');
        select.disabled = false;
    }
}

function winPlayer()
{
    document.getElementById("restart").disabled = true;
    var div = document.getElementById("winBackground");
    var link = "url(";
    var p = document.getElementById("pWinner");
    if(players[0].pointMT > players[1].pointMT)
    {
        link += "'assets/images/win1.png')";
        p.innerHTML = "¡El jugador " + players[0].nick + " ha ganado!";
    }
    else if(players[1].pointMT > players[0].pointMT)
    {
        link += "'assets/images/win2.png')";
        p.innerHTML = "¡El jugador " + players[1].nick + " ha ganado!";
    }
    else
    {
        link += "'assets/images/tie.png')";
        p.innerHTML = "¡" + players[0].nick + " y " + players[1].nick + " han empatado!";
    }
    div.style.backgroundImage = link;
    showMessageBox("messageWinner");
}

function genRandom(min, max)
{
    return Math.floor(Math.random() * (max-min) + min);
}

function fillArrayTwice(cant, list){
    var listCharacters = JSON.parse(JSON.stringify(list));
    var myNewArray = [];
    for(i=0; i<2; i++){
        //cant divided by two because we want half of the var arr
        for(j=0; j<(Math.floor(cant/2)); j++){
            var item = listCharacters[j];
            myNewArray.push(item);
        }
    }
    
    if(cant == 25)
    {
        var onion = listCharacters[listCharacters.length-1];
        myNewArray.push(onion);
    }
    return myNewArray;
}

function showMessageBox(id)
{
    document.getElementById(id).classList.remove("hidden");
}

function closeMsgBox(id)
{
    document.getElementById(id).classList.add('hidden');
}

function restartGame()
{
    document.getElementById("msgBox").classList.add("hidden");
    document.getElementById("restart").disabled = true;
    var select = document.getElementById('rowsAndCols');
    select.disabled = false;
    select.value = "none";
    table.innerHTML = "";
    hideInfo();
}

function hideInfo()
{
    document.getElementById("info").classList.add("hidden");
}