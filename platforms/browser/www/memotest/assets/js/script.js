var listObjs=
[{
    alt: "apple",
    id: 00,
    found: 0
},
{
    alt:"aubergine",
    id: 01,
    found: 0
},
{
    alt:"banana",
    id: 02,
    found: 0
},
{
    alt:"avocado",
    id: 03,
    found: 0
},
{
    alt:"grapes",
    id: 04,
    found: 0
},
{
    alt:"carrot",
    id: 05,
    found: 0
},
{
    alt:"cherries",
    id: 06,
    found: 0
},
{
    alt:"lemon",
    id: 07,
    found: 0
},
{
    alt:"lime",
    id: 08,
    found: 0
},
{
    alt:"peach",
    id: 09,
    found: 0
},
{
    alt:"pear",
    id: 10,
    found: 0
},
{
    alt:"pepper",
    id: 11,
    found: 0
},
{
    alt:"pineapple",
    id: 12,
    found: 0
},
{
    alt:"pumpkin",
    id: 13,
    found: 0
},
{
    alt:"raspberry",
    id: 14,
    found: 0
},
{
    alt:"strawberry",
    id: 15,
    found: 0
},
{
    alt:"tomato",
    id: 16,
    found: 0
},
{
    alt:"watermelon",
    id: 17,
    found: 0
},
{
    alt:"onion",
    id: 18,
    found: 0
}];
var dataGame = [
    {
        
    }
]
var matrixGame = [];
var canClick = true;
var player1 = {points: 0};
var player2 = {points: 0};
var turn;
var size;
var finishingPair = 0;

// elements that form the table
var table = document.getElementById('memo');
var tbody = document.createElement("tbody");
//var rows = document.createElement("tr");
//var row = document.createElement("tr");
//var rows = [];
//var finishedCard;
var cardAux = null;
var fruitAux = null;
var posAuxI = null;
var posAuxJ = null;

// swaped0 and swaped1 are the cards that are curently swaped. Swaped is a value to change between positions. Swaped1 es el equivalente de fruit aux
var swap = 0;
var fruit0 = null;
var card0 = null;
var fruit1 = null;
var card1 = null;

function loadData()
{
    getData();
    if (finishingPair < size*size-1)
    {
        buildTable();   
        document.getElementById('rowsAndCols').disabled = true;
    }
}

function getData()
{
    matrixGame = localStorage.getItem('matrixData');
    matrixGame = JSON.parse(matrixGame);
    size = localStorage.getItem('sizeTable');
    size = parseInt(size);
    player1 = localStorage.getItem('player1');
    player1 = JSON.parse(player1);
    player2 = localStorage.getItem('player2');
    player2 = JSON.parse(player2);
    turn = localStorage.getItem('dataTurn');
    turn = parseInt(turn);
    finishingPair = localStorage.getItem("pairsFound");
    finishingPair = parseInt(finishingPair);
    size = localStorage.getItem("size");
    size = parseInt(size);
}

function saveData()
{
    localStorage.setItem('matrixData', JSON.stringify(matrixGame));
    localStorage.setItem('sizeTable', size);
    localStorage.setItem('player1', JSON.stringify(player1));
    localStorage.setItem('player2', JSON.stringify(player2));
    localStorage.setItem('dataTurn', turn);
    localStorage.setItem('pairsFound', finishingPair);
    localStorage.setItem('size',size);
}

function removeData()
{
    localStorage.clear();
}

function showPoints(){
    document.getElementById("turnos").innerHTML = "Es el turno del jugador " + turn;
    document.getElementById("point1").innerHTML = "Jugador 1: " + player1.points;
    document.getElementById("point2").innerHTML = "Jugador 2: " + player2.points;
}

function selectTable()
{
    removeData();
    player1.points = 0;
    player2.points = 0;
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
            //Put a fruit random in matrix
            var posRandom = genRandom(0,arrayElements.length);
            matrixGame[i][j] = arrayElements[posRandom];
            arrayElements.splice(posRandom, 1);
            //finishedCard.appendChild();
        }
    }
}

function buildTable()
{
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

    img.setAttribute("src","assets/images/"+objectArray.alt+".svg");
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
        //the card is not swapped
        if(clase == "theCard reverse"){
            turnCard(card,false);
            console.log("the card was not swapped and now is");
            // console.log(rotated);

            card.classList.remove("reverse");

            var fruit = matrixGame[pos1][pos2];

            //guardar la carta
            if (cardAux == null) {
                cardAux = card;
                fruitAux = fruit;
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
                if(fruitAux.id == fruit.id){
                    var classAdd;
                    var points;
                    if (fruitAux.id == 07 || fruitAux.id == 02 || fruitAux.id == 06){
                        points = 250 * size;
                    }else{
                        points = 100 * size;
                    }
                    if (turn ==  1) {
                        player1.points += points;
                        classAdd = "find1";
                    }else{
                        player2.points += points;
                        classAdd = "find2";
                    }
                    matrixGame[pos1][pos2].found = turn;
                    matrixGame[posAuxI][posAuxJ].found = turn;

                    //estilo
                    card.classList.add(classAdd);
                    cardAux.classList.add(classAdd);

                    //resetar propiedades
                    cardAux=null;
                    fruitAux=null;
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
                        //Onion?
                        if (fruitAux.id == 18 || fruit.id == 18){
                            console.log("onion spoted! -750 points to current player")
                            if (turn == 1) {
                                player1.points -= 750;
                            }else{
                                player2.points -= 750;
                            }
                        }
                        card.classList.add("reverse");
                        cardAux.classList.add("reverse");
                        showPoints();
                        canClick = true; 
                        changeTurn();
                        cardAux = null;
                        fruitAux=null;
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
        turn++;
        console.log("le toca al jugador 1")
    }else{
        turn--;
        console.log("le toca al jugador 2")
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
    if(player1.points > player2.points)
    {
        alert('Ganó el jugador 1');
    }
    else if(player2.points > player1.points)
    {
        alert('Ganó el jugador 2');
    }
    else
    {
        alert('Empate');
    }
}

function genRandom(min, max)
{
    return Math.floor(Math.random() * (max-min) + min);
}

function fillArrayTwice(cant, list){
    var listFruits = JSON.parse(JSON.stringify(list));
    var myNewArray = [];
    for(i=0; i<2; i++){
        //cant divided by two because we want half of the var arr
        for(j=0; j<(Math.floor(cant/2)); j++){
            var item = listFruits[j];
            myNewArray.push(item);
        }
    }
    
    if(cant == 25)
    {
        var onion = listFruits[listFruits.length-1];
        myNewArray.push(onion);
    }
    return myNewArray;
}

