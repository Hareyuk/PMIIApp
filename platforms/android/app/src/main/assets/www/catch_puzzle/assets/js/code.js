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
var keepMoving = false;
var tableGame;
var lastDirection = "";
var imageCharacter;
var setTimeOuts = [];
var fps = 8;
var walkingSteps = {};
walkingSteps["down"] = [2,1,3,1];
walkingSteps["up"] = [5,4,6,4];
walkingSteps["right"] = [8,7,9,7];
walkingSteps["left"] = [11,10,12,10]; 
var stepCounts = 0;

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
    keepMoving = false;
    validateSteps();
}


function pressKey(event) {
    var arrowKey = event.keyCode || event.which;
    switch (arrowKey) {
        case 37: //Left
            movePlayer(0, -1, "left");
            break;
        case 38: //Up
            movePlayer(-1, 0, "up");
            break;
        case 39: //Right
            movePlayer(0, 1, "right");
            break;
        case 40: //Down
            movePlayer(1, 0, "down");
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
    console.log('pieza 2: ', piece2X, " - ", piece2Y);

    var piece3X = genRandom(2, h / 2 - 2);
    var piece3Y = genRandom(w / 2 + 2, w - 3);
    while (m[piece3X][piece3Y] == "X") {
        piece3X = genRandom(2, h / 2 - 2);
        piece3Y = genRandom(w / 2 + 2, w - 3);
    }
    m[piece3X][piece3Y] = "obj";
    console.log('pieza 3: ', piece3X, " - ", piece3Y);

    var piece4X = genRandom(2, h - 3);
    var piece4Y = genRandom(2, w - 3);
    while (m[piece4X][piece4Y] == "X") {
        piece4X = genRandom(2, h - 3);
        piece4Y = genRandom(2, w - 3);
    }
    m[piece4X][piece4Y] = "obj";
    console.log('pieza 4: ', piece4X, " - ", piece4Y);
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
    arrayPositions = grabSomePositions(arrayPositions);
    arrayPositions = shuffle(arrayPositions);
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
            lastDirection = direction;
            console.log('Changed direction');
            keepMoving = false;
        }

        if(!keepMoving)
        {
            keepMoving = true;
            characterWalking(turn, direction);
            console.log('Puede avanzar. TimeOut de movimiento listo.');
            posPlayer.x += moveX;
            posPlayer.y += moveY;
            mapMatrix[posPlayer.x - moveX][posPlayer.y - moveY] = null;
            moveTable();
            mapMatrix[posPlayer.x - moveX][posPlayer.y - moveY] = "P";
            
            setTimeOuts.push(setTimeout(function()
            {
                
                setTimeOuts.push(setTimeout(function() {           
                    lastDirection = direction;
                }, 450));
                keepMoving = false;
            },400));
        }
        removePiece();
    }
}

async function removePiece()
{
    console.log('En removePiece(), y limpiado setTimeOut...');
    askFindObject(posPlayer.x, posPlayer.y);
} 

async function askFindObject(x,y)
{
   if(mapMatrix[x][y] == "obj")         
   {
            console.log('¡Un objeto aquí! Brillo~');
            var tr = tableGame.childNodes[x];
            var td = tr.childNodes[y];
            td.classList.remove('pieces');
            td.classList.add('passThrough');
            grabPiece();
        } 
}

async function grabPiece()
{   
    imageCharacter.classList.add('grabPieces');
    setTimeOuts[2] = setTimeout(function()
    {
        imageCharacter.classList.remove('grabPieces');
        if(!stillSeekingPieces(widthMap, heightMap, mapMatrix))
        {
            alert('Ya no quedan más piezas');
        }
    }, 500);
}

async function characterWalking(character, direction) {
    validateSteps();
    console.log('Dirección: ', direction);
    for(var i=1;i<3;i++)
    {
        setTimeOuts.push(setTimeout(function()
        {
            var link = "assets/img/frames_"+character+"/"+walkingSteps[direction][stepCounts]+".png";
            changeImageCharacter(link)
        },(1000/fps*i)));
    }
    
}

async function changeImageCharacter(link)
{
    stepCounts++;
    imageCharacter.src = link;
    validateSteps();
}

async function validateSteps()
{
    if(stepCounts>=walkingSteps["up"].length) stepCounts=0;
}

function stillSeekingPieces(w,h,m)
{
    for(i=0;i<h-1;i++)
    {
        for(j=0;j<w-1;j++)
        {
            if(m[i][j] == "obj")
            {
                return true;
            }
        }
    }
    return false;
}