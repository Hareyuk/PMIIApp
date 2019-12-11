var turn = "johan";
var mapMatrix = [];
var posPlayer = {
    x: 0,
    y: 0
};
var gameData;
var widthMap = 20;
var heightMap = 20;
var players;
var playersTimes = [{
    points: 0,
    time: 0
}, {
    points: 0,
    time: 0
}];
var canMove = true;
var tableGame;
var lastDirection = "";
var imageCharacter;
var setTimeOuts = [];
var fps = 8;

function startGame() {
    /*players = localStorage.getItem("players");
    players = JSON.parse(players);
    gameData = localStorage.getItem('dataCP');
    gameData = JSON.parse(gameData);
    if(gameData.dataSaved)
    {
        getData();

    }
    else
    {

    }*/
    mapMatrix = generateMatrix(widthMap, heightMap, mapMatrix);
    mapMatrix = markWallsMatrix(widthMap, heightMap, mapMatrix);
    mapMatrix = putPieces(widthMap, heightMap, mapMatrix);
    mapMatrix = putPlayerInMaze(widthMap, heightMap, mapMatrix);
    generateMazeTable(widthMap, heightMap, mapMatrix);
    moveTable();
    generateCharacter(turn);
    document.addEventListener("keydown", pressKey);
    document.addEventListener("keyup", keyUp);
}

function keyUp(event)
{
    canMove = true;
}

function pressKey(event) {
    var arrowKey = event.keyCode || event.which;
    switch (arrowKey) {
        case 37: //Left
            movePlayer(0, -1, "up");
            break;
        case 38: //Up
            movePlayer(-1, 0, "left");
            break;
        case 39: //Right
            movePlayer(0, 1, "down");
            break;
        case 40: //Down
            movePlayer(1, 0, "right");
            break;
    }
}

function generateCharacter(character) {
    var img = document.createElement("img");
    img.id = "character";
    img.alt = character;
    img.src = "assets/img/frames_" + character + "/1.png";
    img.classList.add("character");
    document.querySelector("#game div").appendChild(img);
    imageCharacter = document.getElementById('character');
}

function generateMatrix(w, h, m) {
    for (var i = 0; i < w; i++) {
        m.push([]);
        for (var j = 0; j < h; j++) {
            m[i][j] = null;
        }
    }
    return m;
}

function putPlayerInMaze(w, h, m) {
    var randX = genRandom(1, h - 2);
    var randY = genRandom(1, w - 2);
    while (m[randX][randY] == "X" || m[randX][randY] == "obj") {
        randX = genRandom(1, h - 2);
        randY = genRandom(1, w - 2);
    }
    m[randX][randY] = "P";
    posPlayer.x = randX;
    posPlayer.y = randY;
    return m;
}

function putPieces(w, h, m) {
    var posIni = 2;
    var posFin =  h/2 - 2;
    var piece1X = genRandom(posIni, posFin);
    posIni = 2;
    posFin =  w/2 - 2;
    var piece1Y = genRandom(posIni, posFin);
    while (m[piece1X][piece1Y] == "X") {
        piece1X = genRandom(2, h / 2 - 2);
        piece1Y = genRandom(2, w / 2 - 2);
    }
    m[piece1X][piece1Y] = "obj";
    console.log('pieza 1: ', piece1X, " - ", piece1Y);

    var piece2X = genRandom(h / 2 + 2, h - 3);
    var piece2Y = genRandom(2, w / 2 - 2);
    while (m[piece2X][piece2Y] == "X") {
        piece2X = genRandom(h / 2 + 2, h - 3);
        piece2Y = genRandom(2, w / 2 - 2);
    }
    m[piece2X][piece2Y] = "obj";
    console.log('pieza 1: ', piece2X, " - ", piece2Y);

    var piece3X = genRandom(2, h / 2 - 2);
    var piece3Y = genRandom(w / 2 + 2, w - 3);
    while (m[piece3X][piece3Y] == "X") {
        piece3X = genRandom(2, h / 2 - 2);
        piece3Y = genRandom(w / 2 + 2, w - 3);
    }
    m[piece3X][piece3Y] = "obj";
    console.log('pieza 1: ', piece3X, " - ", piece3Y);

    var piece4X = genRandom(2, h - 3);
    var piece4Y = genRandom(2, w - 3);
    while (m[piece4X][piece4Y] == "X") {
        piece4X = genRandom(2, h - 3);
        piece4Y = genRandom(2, w - 3);
    }
    m[piece4X][piece4Y] = "obj";
    console.log('pieza 1: ', piece4X, " - ", piece4Y);
    return m;
}

function generateMazeTable(w, h, m) {
    document.getElementById('game').innerHTML = "";
    var div = document.createElement("div");
    var table = document.createElement("table");
    for (var i = 0; i < w; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < h; j++) {
            var td = document.createElement("td");
            if (m[i][j] == null) {
                td.classList.add("passThrough");
            } else if (m[i][j] == "X") {
                td.classList.add("doNotPass");
            } else if (m[i][j] == "P") {
                //Add turn later
                td.classList.add("start_position_player");
            } else if (m[i][j] == "obj") {
                td.classList.add("pieces");
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
        table.id = "tableGame";
    }
    div.appendChild(table);
    document.getElementById("game").appendChild(div);
    tableGame = document.getElementById("tableGame");
}

function moveTable() {
    tableGame.style.top = (-posPlayer.x * 100 + 200) + "px";
    tableGame.style.left = (-posPlayer.y * 100 + 200) + "px";
}

function genRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function markWallsMatrix(w, h, m) {
    //Left & Right
    for (var i = 0; i < w; i++) {
        //Left
        m[i][0] = "X";
        m[i][1] = "X";
        //Right
        m[i][h - 1] = "X";
        m[i][h - 2] = "X";
    }

    //Up & Down
    for (var i = 0; i < h; i++) {
        //Up
        m[0][i] = "X";
        m[1][i] = "X";
        //Down
        m[w - 1][i] = "X";
        m[w - 2][i] = "X";
    }
    m = buildBlocksWalls(w, h, m);
    m = cellsLocked(w, h, m);
    return m;
}

function cellsLocked(w, h, m) {
    for (var i = 1; i < w - 2; i++) {
        for (var j = 1; j < h - 2; j++) {
            var top = m[i - 1][j];
            var left = m[i][j - 1];
            var bottom = m[i + 1][j];
            var right = m[i][j + 1];
            if (top == left && top == right && top == bottom && top == "X") {
                m[i][j] = "X";
            }
        }
    }
    return m;
}

function buildBlocksWalls(w, h, m) {
    var cellFree = true;
    var arrayPositions = obtainPositions(w, h);
    arrayPositions = shuffle(arrayPositions);
    arrayPositions.splice(w * h / (w + h));
    while (arrayPositions.length > 0) {
        var amountPos = arrayPositions.length - 1;
        var posRandom = genRandom(0, amountPos);
        var positions = arrayPositions[posRandom];
        positions = positions.split("_");
        arrayPositions.splice(posRandom, 1);
        var posX = parseInt(positions[0]);
        var posY = parseInt(positions[1]);
        var dir = genRandom(0, 3); //0 = up | 1 = left | 2 = down | 3 = right
        while (posY > 1 && posY < h - 2 && posX > 1 && posX < w - 2) {
            if (dir == 0) {
                //Found a wall in two cells top
                if (m[posX - 1][posY] == "X" && cellFree == true) {

                    //Coming from other side?
                    if (m[posX - 1][posY - 1] == "X" && m[posX - 1][posY + 1] == "X") {
                        cellFree = false;
                        m[posX][posY] = null;
                        if (posX > 3) {
                            m[posX - 3][posY] = null;
                        }
                        posX -= 3;
                    } else
                    {
                        m[posX - 1][posY] == "X";
                        break;
                    }
                } else {
                    if (cellFree == false) {
                        cellFree = true;
                    }
                    posX--;
                    m[posX][posY] = "X";
                    posX--;
                }
            } else if (dir == 1) {
                if (m[posX][posY + 1] == "X") {
                    if (m[posX + 1][posY + 1] == "X" && m[posX - 1][posY + 1] == "X" && cellFree == true) {
                        cellFree = false;
                        m[posX][posY] = null;
                        if (posY < h - 3) {
                            m[posX][posY + 3] = null;
                        }
                        posY += 3;
                    } else{
                        m[posX][posY + 1] == "X";
                        break;
                    }
                } else {
                    if (cellFree == false) {
                        cellFree = true;
                    }
                    posY++;
                    m[posX][posY] = "X";
                    posY++;
                }
            } else if (dir == 2) {
                if (m[posX + 1][posY] == "X") {
                    if (m[posX + 1][posY + 1] == "X" && m[posX + 1][posY - 1] == "X" && cellFree == true) {
                        cellFree = false;
                        m[posX][posY] = null;
                        if (posX < w - 3) {
                            m[posX + 3][posY] = null;
                        }
                        posX += 3;
                    } else {
                        m[posX + 1][posY] == "X";
                        break;
                    }
                } else {
                    if (cellFree == false) {
                        cellFree = true;
                    }
                    posX++;
                    m[posX][posY] = "X";
                    posX++;
                }
            } else if (dir == 3) {
                if (m[posX][posY - 1] == "X") {
                    if (m[posX + 1][posY - 1] == "X" && m[posX - 1][posY - 1] == "X" && cellFree == true) {
                        cellFree = false;
                        m[posX][posY] = null;
                        if (posY > 3) {
                            m[posX][posY - 3] = null;
                        }
                        posY -= 3;
                    } else {
                        m[posX][posY - 1] == "X";
                        break;
                    }
                } else {
                    if (cellFree == false) {
                        cellFree = true;
                    }
                    posY--;
                    m[posX][posY] = "X";
                    posY--;
                }
            }
        }
        (dir < 3) ? dir++ : dir = 0;

    }
    return m;
}

function obtainPositions(w, h) {
    var array = [];
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            if (i > 2 && i < (w - 3) && j > 2 && j < (h - 3)) {
                array.push(i + "_" + j);
            }
        }
    }
    return array;
}

function getData() {
    turn = gameData.turn;
    mapMatrix = gameData.mapMatrix;
    posPlayer = gameData.mapMatrix;
}

function saveData() {

}

//Taken from: http://sedition.com/perl/javascript-fy.html
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

async function movePlayer(moveX, moveY, direction) {
    if (mapMatrix[posPlayer.x + moveX][posPlayer.y + moveY] != "X") {
        if (lastDirection != direction) {
            canMove = true;
            lastDirection = direction;
            console.log('Changed direction');
        }

        if(canMove)
        {
            clearTimeout(setTimeOuts[0]);
            console.log('Puede avanzar. TimeOut de movimiento listo.');
            canMove = false;
            posPlayer.x += moveX;
            posPlayer.y += moveY;
            mapMatrix[posPlayer.x - moveX][posPlayer.y - moveY] = null;
            moveTable();
            mapMatrix[posPlayer.x - moveX][posPlayer.y - moveY] = "P";
            setTimeOuts[0] = setTimeout(function() {           
                console.log('Ya avanzado. Llamando a removePiece()...');
                lastDirection = direction;
                canMove = true;
            }, 450);
            removePiece();
        }
        
    }
}

async function removePiece()
{
    console.log('En removePiece(), y limpiado setTimeOut...');
    setTimeout(function(){
        console.log('¿Es un objeto?');
        if(mapMatrix[posPlayer.x][posPlayer.y] == "obj")
        {
            console.log('¡Un objeto aquí! Brillo~');
            var tr = tableGame.childNodes[posPlayer.x];
            var td = tr.childNodes[posPlayer.y];
            td.classList.remove('pieces');
            td.classList.add('passThrough');
            grabPiece();
        } 
    }, 200);
} 

async function grabPiece()
{
    clearTimeout(setTimeOuts[2]);
    imageCharacter.classList.add('grabPieces');
    setTimeOuts[2] = setTimeout(function()
    {
        imageCharacter.classList.remove('grabPieces');
    }, 500);
}

function characterWalking(character, direction) {

}