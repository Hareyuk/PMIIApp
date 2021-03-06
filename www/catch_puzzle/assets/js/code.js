var turn = "johan";
var mapMatrix = [];
var posPlayer = {
    x: 0,
    y: 0
};
var gameData;
var finishedSearch;
var widthMap = 20;
var heightMap = 20;
var players;
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
var img1Selected=null;
var lastImage = null;
var numberImage = null;
var arrayPieces=[];
var puzzleMatrix=[];
var times = {};
var turnNumber = 0;
var theme = document.getElementById("theme");
theme.volume = 0.3;
//For pieces' selector
var positionList = 0;
var players;
var intervalTimer;

function startGame() {
    getData();
    loadGame();
}

//Extracted from p5 formula1
function  formatTimeInMins(time)
{
    //I get minutes
    let m = Math.floor(time/ 60);
    //I get seconds
    let s = Math.floor(time%60);
    //I return the text  "XXmXX.XXXs" (X = some number unknown)
    return ("" + m).padStart(2, "0") + "m" + ("" + s).padStart(2, "0") + "s";
}

function playJohanVoice(num)
{
    var audio = document.getElementById("voiceJ"+num);
    audio.currentTime = 0;
    audio.play();
}

function playLefaraVoice(num)
{
    var audio = document.getElementById("voiceL"+num);
    audio.currentTime = 0;
    audio.play();
}

function playVictorySound()
{
    var audio = document.getElementById("victoryAudio")
    audio.currentTime = 0;
    audio.play();
}

function loadGame()
{
    if(finishedSearch)
    {
        if(gameData.dataPuzzle)
        {
            startJigsaw(0);
        }
        else
        {
            
            startJigsaw(1);
        }
    }
    else
    {
        if(turn == "johan")
        {
            showMsgBox(0);
        }
        else
        {
            showMsgBox(2);
        }
        if(!gameData.dataSaved)
        {
            mapMatrix = generateMatrix(widthMap, heightMap, mapMatrix);
            mapMatrix = markWallsMatrix(widthMap, heightMap, mapMatrix);
            mapMatrix = putPieces(widthMap, heightMap, mapMatrix);
            mapMatrix = putPlayerInMaze(widthMap, heightMap, mapMatrix);
        }
        generateMazeTable(widthMap, heightMap, mapMatrix);
        moveTable();
        generateCharacter(turn);
        buildButtonMob();
    }
    showNames();
    document.addEventListener("keydown", pressKey);
    document.addEventListener("keyup", keyUp);
}

function buildButtonMob()
{
    var game = document.getElementById("game");
    for(var i = 0; i < 2; i++)
    {
        var buttonUp = document.createElement("button");
        buttonUp.innerHTML = "↑";
        buttonUp.addEventListener("click", function(){
            movePlayer(-1,0,"up");
        });
        var buttonLeft = document.createElement("button");
        buttonLeft.innerHTML = "←";
        buttonLeft.addEventListener("click", function(){
            movePlayer(0,-1,"left");
        });
        var buttonRight = document.createElement("button");
        buttonRight.innerHTML = "→";
        buttonRight.addEventListener("click", function(){
            movePlayer(0,1,"right");
        });
        var buttonDown = document.createElement("button");
        buttonDown.innerHTML = "↓";
        buttonDown.addEventListener("click", function(){
            movePlayer(1,0,"down");
        });
        var cont = document.createElement("div");
        cont.id = "boxButtons"+i;
        cont.classList.add("buttonTap");
        cont.appendChild(buttonLeft);
        cont.appendChild(buttonUp);
        cont.appendChild(buttonDown);
        cont.appendChild(buttonRight);
        game.appendChild(cont); 
    }
}

function showMsgBox(num, winner)
{
    var msgBox = document.getElementById("msgBox");
    var div = document.getElementById("msgBoxInfo");
    msgBox.classList.remove("hidden");
    var txt = "Continuar";
    switch(num)
    {
        case 0:
            //when seeking pieces starts
            div.classList.add("border_red");
            var figure = document.createElement("figure");
            var img = document.createElement("img");
            img.src = "assets/img/piece.png";
            img.alt = "pieces";
            var figcaption = document.createElement("figcaption");
            figcaption.innerHTML = "¡Tienes que recolectar estas piezas!";
            figure.appendChild(img);
            figure.appendChild(figcaption);
            var figure2 = document.createElement("figure");
            var img2 = document.createElement("img");
            img2.src = "assets/img/dontpass.png";
            img2.alt = "can't pass";
            var figcaption2 = document.createElement("figcaption");
            figcaption2.innerHTML = "No son mortales pero no se pueden avanzar ahí.";
            figure2.appendChild(img2);
            figure2.appendChild(figcaption2);
            var p = document.createElement("p");
            p.innerHTML ="¡El objetivo del juego es conseguir todas las piezas!<br>En dispositivo táctil te mueves presionando los círculos que verás alrededor. ¡En computadora presioná las teclas!<br>¿Cómo ganar? ¡Hazlo más rápido que tu rival!"
            div.appendChild(figure);
            div.appendChild(figure2);
            div.appendChild(p);
            break;
        case 1:
            //when jigsaw starts
            div.classList.add("border_red");
            var figure = document.createElement("figure");
            var img = document.createElement("img");
            img.src = "assets/img/piece_normal.png";
            img.alt = "normal piece";
            var figcaption = document.createElement("figcaption");
            figcaption.innerHTML = "Estas son piezas.";
            figure.appendChild(img);
            figure.appendChild(figcaption);
            var figure2 = document.createElement("figure");
            var img2 = document.createElement("img");
            img2.src = "assets/img/piece_selected.png";
            img2.alt = "piece selected";
            var figcaption2 = document.createElement("figcaption");
            figcaption2.innerHTML = "Cuando les hacés click para seleccionar una, tienen un brillo alrededor.";
            figure2.appendChild(img2);
            figure2.appendChild(figcaption2);
            var figure3 = document.createElement("figure");
            var img3 = document.createElement("img");
            img3.src = "assets/img/piece_tuto.png";
            img3.alt = "tutorial";
            img3.classList.add("full");
            var figcaption3 = document.createElement("figcaption");
            figcaption3.innerHTML = "¡Una vez seleccionada una pieza, haz otro click en el tablero!";
            figure3.appendChild(img3);
            figure3.appendChild(figcaption3);
            div.appendChild(figure);
            div.appendChild(figure2);
            div.appendChild(figure3);
            break;
        case 2:
            var p = document.createElement("p");
            p.innerHTML = "¡Ya terminó tu turno, " + players[0].nick +"!<br>¡Es ahora turno del " + players[1].nick + "!";
            div.appendChild(p);
            break;
        case 3:
            //victory
            var link;
            var p = document.createElement("p");
            var txtW = "¡Ha ganado el jugador ";
            if(winner == "johan")
            {
                link = "url('assets/img/win_j.png')";
                txtW  += players[0].nick + "!";
            }
            else if (winner =="lefara")
            {
                link = "url('assets/img/win_l.png')";
                txtW  += players[1].nick + "!";
            }
            else
            {
                txtW = "¡Empate!"
                link = "url('assets/img/tie.png')";
            }
            div.style.backgroundImage = link;
            p.innerHTML = txtW;
            txt = "Empezar de vuelta"
            div.appendChild(p);
            div.classList.add('win');
            break;
    }

    var button = document.createElement("button");
    button.innerHTML = txt;
    button.addEventListener("click", function(){ 
        closeMsgBox(num);
    });
    div.appendChild(button);
}

function closeMsgBox(num)
{
    var msgBox = document.getElementById("msgBox");
    var div = document.getElementById("msgBoxInfo");
    msgBox.classList.add("hidden");
    div.classList.remove("border-red");
    div.innerHTML = "";
    if(num < 3)
    {
        intervalTimer = setInterval(function(){
            if(turn == "johan")
            {
                players[0].pointCP++;   
            }
            else
            {
                players[1].pointCP++;
            }
            saveData();
        },1000);
    }
    else if (num == 3)
    {
        div.style.backgroundImage = "";
        div.classList.remove('win');
        document.getElementById("game").innerHTML = "";
        loadGame();
    }
}

function showNames()
{
    var div = document.getElementById("names");
    div.innerHTML = "";
    var p = document.createElement("p");
    p.innerHTML = "Turno:<br>" + players[turnNumber].nick;
    div.classList.add("nameCatch");
    div.appendChild(p);
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
    document.querySelector("#maze").appendChild(img);
    var div = document.createElement("div");
    div.id = "shadow_character";
    document.querySelector("#maze").appendChild(div);
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


function getAPositionFromMatrix(m, posXI,posXF, posYI, posYF, condition)
{
    var posX = genRandom(posXI, posXF);
    var posY = genRandom(posYI,posYF);
    if(condition != "none")
    {
        while(m[posX][posY] == condition)
        {
            posX = genRandom(posXI, posXF);
            posY = genRandom(posYI,posYF);
        }
    }
    return [posX,posY];
}

function putPieces(w, h, m) {
    //piece 1 top left
    var posIniX = 2;
    var posFinX =  h/2 - 2;
    var posIniY = 2;
    var posFinY =  w/2 - 2;
    var pos = getAPositionFromMatrix(m, posIniX,posFinX,posIniY,posFinY, "X");
    m[pos[0]][pos[1]] = "obj";

    //piece2 top right
    posIniX = h / 2 + 2;
    posFinX = h - 3;
    posIniY = 2;
    posFinY = w / 2 - 2;
    pos = getAPositionFromMatrix(m, posIniX,posFinX,posIniY,posFinY, "X");
    m[pos[0]][pos[1]] = "obj";

    //piece 3 bottom left
    posIniX = 2;
    posFinX = h / 2 - 2;
    posIniY = w / 2 + 2;
    posFinY  = w - 3;
    pos = getAPositionFromMatrix(m, posIniX,posFinX,posIniY,posFinY, "X");
    m[pos[0]][pos[1]] = "obj";

    //piece 4 bottom right
    posIniX = h / 2 + 2;
    posFinX = h - 3;
    posFinY = w / 2 + 2;
    posFinY = w - 3;
    pos = getAPositionFromMatrix(m, posIniX,posFinX,posIniY,posFinY, "X");
    m[pos[0]][pos[1]] = "obj";
    return m;
}

function generateMazeTable(w, h, m) {
    document.getElementById('game').innerHTML = "";
    var div = document.createElement("div");
    div.id = "maze";
    var table = document.createElement("table");
    for (var i = 0; i < w; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < h; j++) {
            var td = document.createElement("td");
            if (m[i][j] == "X") 
            {
                td.classList.add("doNotPass");
            }
            
            else if (m[i][j] == "P") 
            {
                //Add turn later
                td.classList.add("start_position_player");
            } 
            else if (m[i][j] == "obj") 
            {
                td.classList.add("pieces");
            }
            else //if (m[i][j] == null) 
            {
                td.classList.add("passThrough");
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

function sizePixels(stateGame)
{
    var px; 
    if(stateGame == 0) //Seeking pieces
    {
        var x = window.matchMedia("(max-width: 375px)");
        if(x.matches) px = 60;
        else
        {
            x = window.matchMedia("(max-height: 375px) and (orientation: landscape)");
            if(x.matches) px=60;
        }
        x = window.matchMedia("(min-width: 376px)");
        if(x.matches)
        {
            x=window.matchMedia("(min-height: 376px)");
            if(x.matches) px = 75;
        }
        x = window.matchMedia("(min-width: 421px)");
        if(x.matches)
        {
            x=window.matchMedia("(min-height: 421px)");
            if(x.matches) px = 84;
        }
        x = window.matchMedia("(min-width: 630px)");
        if(x.matches)
        {
            x=window.matchMedia("(min-height: 630px)");
            if(x.matches) px=124;
        }
        x = window.matchMedia("(min-width: 769px)");
        if(x.matches)
        {
            x=window.matchMedia("(min-height: 769px)");
            if(x.matches) px=150;
        }
    }
    else
    {
        var x = window.matchMedia("(max-width: 375px)");
        if(x.matches) px = 60;
        else
        {
            x = window.matchMedia("(max-height: 375px) and (orientation: landscape)");
            if(x.matches) px=60;
        }
        x = window.matchMedia("(min-width: 376px)");
        if(x.matches)
        {
            x=window.matchMedia("(min-height: 376px)");
            if(x.matches) px = 75;
        }
        x = window.matchMedia("(min-width: 421px)");
        if(x.matches)
        {
            x=window.matchMedia("(min-height: 421px)");
            if(x.matches) px = 84;
        }
        x = window.matchMedia("(min-width: 630px)");
        if(x.matches)
        {
            x=window.matchMedia("(min-height: 630px)");
            if(x.matches) px=120;
        }
    }
    console.log("PX: " + px)
    return px;
}

function moveTable() {
    
    var px = sizePixels(0);
    tableGame.style.top = (-posPlayer.x * px+(px*2)) + "px";
    tableGame.style.left = (-posPlayer.y * px+(px*2)) + "px";
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

function createWall(m, posX, posY,w, h, dirX, dirY, otherSideX1,otherSideY1,otherSideX2,otherSideY2,directionNullX,directionNullY)
{
    var cellFree = 0;
    while (posY > 2 && posY < h - 3 && posX > 2 && posX < w - 3)
        {
        if (m[posX + dirX][posY + dirY] == "X" && cellFree == 4) {
            //Coming from other side?
            if (m[posX + otherSideX1][posY + otherSideY1] == "X" && m[posX + otherSideX2][posY + otherSideY2] == "X") {
                cellFree = 0;
                m[posX][posY] = null;
                if(dirX != 0)
                {
                    if (posX > 4 || posX < w-5) {
                        m[posX + directionNullX][posY] = "n";
                    }
                }
                else if(dirY != 0)
                {
                    if(posY < h - 5 || posY > 4)
                    {
                        m[posX][posY + directionNullY] = "n";
                    }
                }
                posX += directionNullX;
                posY += directionNullY;
            } 
            else
            {
                m[posX - dirX][posY - dirY] == "X";
                break;
            }
        } 
        else 
        {
            if (cellFree < 999) {
                cellFree++;
            }
            if(dirX != 0)
            {
                posX -= dirX;
                m[posX][posY] = "X";
                posX -= dirX;

            }
            else if (dirY != 0)
            {
                posY -= dirY;
                m[posX][posY] = "X";
                posY -= dirY;
            }
        }
    }
    return m;
}

function buildBlocksWalls(w, h, m) {
    var arrayPositions = obtainPositions(w, h);
    var dir = genRandom(0, 3); //0 = up | 1 = left | 2 = down | 3 = right
    while (arrayPositions.length > 0) {
        var amountPos = arrayPositions.length - 1;
        var posRandom = genRandom(0, amountPos);
        var positions = arrayPositions[posRandom];
        positions = positions.split("_");
        arrayPositions.splice(posRandom, 1);
        var posX = parseInt(positions[0]);
        var posY = parseInt(positions[1]);
        if(dir==0)
        {
            m = createWall(m, posX, posY, w, h, -1, 0, -1, -1, -1, 1, -2, 0);
        }
        else if(dir==1)
        {
            m = createWall(m, posX, posY, w, h, 0, 1, 1,1,-1,1,0,2);
        }
        else if(dir == 2)
        {
            m = createWall(m, posX, posY, w, h, 1,0,1,1,1,-1,2,0);
        }
        else if(dir == 3)
        {
           m = createWall(m, posX, posY, w, h,0,-1,1,-1,-1,-1,0,-2);
        }
        (dir < 3) ? dir++ : dir = 0;
    }
    return m;
}


function obtainPositions(w, h) {
    var array = [];
    var amountForZone = (w*h / (w/2+h/2));
    amountForZone /= 4; // 4 = 4 zones
    amountForZone /= 2;
    amountForZone = Math.floor(amountForZone);
    //top left
    for(var i = 0; i < amountForZone; i++)
    {
        var posIniX = 3;
        var posFinX =  h/2 - 2;
        var posIniY = 3;
        var posFinY =  w/2 - 2;
        var pos = getAPositionFromMatrix(mapMatrix, posIniX,posFinX,posIniY,posFinY, "none");
        array.push(pos[0] + "_" + pos[1]);
    }

    //top right
    for(var i = 0; i < amountForZone; i++)
    {
        posIniX = h / 2 + 2;
        posFinX = h - 4;
        posIniY = 3;
        posFinY = w / 2 - 2;
        var pos = getAPositionFromMatrix(mapMatrix, posIniX,posFinX,posIniY,posFinY, "none");
        array.push(pos[0] + "_" + pos[1]);
    }

    //bottom left
    for(var i = 0; i < amountForZone; i++)
    {
        var posIniX = 3;
        var posFinX =  h/2 - 2;
        var posFinY = w / 2 + 2;
        var posFinY = w - 4;
        var pos = getAPositionFromMatrix(mapMatrix, posIniX,posFinX,posIniY,posFinY, "none");
        array.push(pos[0] + "_" + pos[1]);
    }
    
    //bottom right
    for(var i = 0; i < amountForZone; i++)
    {
        var posIniX = h / 2 + 2;
        var posFinX = h - 4;
        var posFinY = w / 2 + 2;
        var posFinY = w - 4;
        var pos = getAPositionFromMatrix(mapMatrix, posIniX,posFinX,posIniY,posFinY, "none");
        array.push(pos[0] + "_" + pos[1]);
    }

    /*for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            if (i > 2 && i < (w - 3) && j > 2 && j < (h - 3)) {
                array.push(i + "_" + j);
            }
        }
    }*/
    return array;
}

function getData() {
    players = localStorage.getItem("players");
    players = JSON.parse(players);
    gameData = localStorage.getItem("dataCP");
    gameData = JSON.parse(gameData);
    turn = gameData.turn;
    if(turn == "johan")
    {
        turnNumber = 0;
    }
    else
    {
        turnNumber = 1;
    }
    mapMatrix = gameData.mapMatrix;
    numberImage = gameData.numberImage;
    lastImage = gameData.lastImage;
    posPlayer = gameData.posPlayer;
    puzzleMatrix = gameData.puzzleMatrix;
    arrayPieces = gameData.arrayPieces;
    finishedSearch = gameData.finishedSearch;
}

function saveData() {
    gameData.turn = turn;
    gameData.mapMatrix = mapMatrix;
    gameData.posPlayer = posPlayer;
    gameData.numberImage = numberImage;
    gameData.puzzleMatrix = puzzleMatrix;
    gameData.arrayPieces = arrayPieces;
    gameData.lastImage = lastImage;
    gameData.finishedSearch = finishedSearch;
    localStorage.setItem("dataCP", JSON.stringify(gameData));
    localStorage.setItem("players",JSON.stringify(players));
}


async function movePlayer(moveX, moveY, direction) {
    if (mapMatrix[posPlayer.x + moveX][posPlayer.y + moveY] != "X") 
    {
        if (lastDirection != direction) {
            lastDirection = direction;
            keepMoving = false;
        }

        if(!keepMoving)
        {
            keepMoving = true;
            characterWalking(turn, direction);
            posPlayer.x += moveX;
            posPlayer.y += moveY;
            askFindObject(posPlayer.x,posPlayer.y); 
            mapMatrix[posPlayer.x - moveX][posPlayer.y - moveY] = null;
            moveTable();
            mapMatrix[posPlayer.x][posPlayer.y] = "P";
            saveData();
            setTimeOuts.push(setTimeout(function()
            {
                
                setTimeOuts.push(setTimeout(function() {           
                    lastDirection = direction;
                }, 450));
                keepMoving = false;
            },400));
        }
        gameData.dataSaved = true;
        saveData();
    }
}

async function askFindObject(x,y)
{
   if(mapMatrix[x][y] == "obj")         
   {
       setTimeout(function(){
            var tr = tableGame.childNodes[x];
            var td = tr.childNodes[y];
            td.classList.remove('pieces');
            td.classList.add('passThrough');
            if(turn == "johan")
            {
                playJohanVoice(1);
            }
            else
            {
                playLefaraVoice(1);
            }
            grabPiece();
       }, 200);
            
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
            blackScreen();
        }
    }, 500);
}

async function characterWalking(character, direction) {
    validateSteps();
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

function startJigsaw(newJigsaw)
{

    showMsgBox(1);
    gameData.dataPuzzle = true;
    if(newJigsaw == 1)
    {
        do 
        {
            numberImage = genRandom(0,10);
        } while (numberImage == lastImage)
        //Just to know if is new game or is there save
        positionList = 0;
        puzzleMatrix = buildMatrixJigsaw(numberImage);
        arrayPieces = generateArrayPieces(numberImage);
    }
    //Show
    infoPlayerPuzzle();
    buildTableJigsaw(puzzleMatrix);
    buildMenuPieces();
}

function infoPlayerPuzzle()
{
    var div = document.getElementById("names");
    div.classList.remove("nameCatch");
    div.classList.add("namePuzzle");
}

function buildMatrixJigsaw()
{
    var m = [];
    var rowPieces = 5;
    var colPieces = 5;
    var px = sizePixels(1);
    for(var i = 0; i < rowPieces; i++)
    {
        m.push([]);
        for(var j = 0; j < colPieces; j++)
        {
            m[i][j] = {top:-(px*i)+"px",left: (-px*j)+"px", src: "assets/img/cellJigsaw.png", alt: "empty"};
        }
    }
    return m;
}

function buildTableJigsaw(m)
{
    var table = document.createElement('table');
    table.id = "jigsaw";
    for(var i = 0; i < 5;i++)
    {
        var tr = document.createElement('tr');
        for(var j = 0; j < 5; j++)
        {
            var td = document.createElement('td');
            td.classList.add('piece');
            var img = document.createElement('img');
            img.addEventListener("click", function()
            {
                selectPiece(this);
            });
            img.src= m[i][j].src;
            img.alt = m[i][j].alt;
            img.style.top=m[i][j].top;
            img.style.left=m[i][j].left;
            img.draggable = false;
            td.appendChild(img);
            td.id = i + "_" + j;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById('game').appendChild(table);
    var div = document.createElement("div");
    div.id = "card";
    var img = document.createElement("img");
    img.src = 'assets/img/'+numberImage+'/card.png';
    img.draggable = false;
    div.classList.add("hidden");
    div.appendChild(img);
    document.getElementById('game').appendChild(div);
}

function generateArrayPieces()
{
    var array = [];
    var amountPiecesX = 5;
    var amountPiecesY = 5;
    var px = sizePixels(1);
    for(var i = 0; i < amountPiecesX;i++)
    {
        for(var j = 0; j < amountPiecesY;j++)
        {
            array.push({top:-(px*i)+"px",left: (-px*j)+"px", alt: "piece"});
        } 
    }
    array = shuffle(array);
    return array;
}

 //Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function blackScreen()
{
    var div = document.createElement('div');
    div.classList.add('blackScreen');
    div.style.opacity = '0';
    document.getElementById('game').appendChild(div);
    setTimeout(() => {
        div.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        document.querySelector("#maze").remove();
        document.getElementById("boxButtons0").remove();
        document.getElementById("boxButtons1").remove();
        startJigsaw(1);
        div.style.opacity = '0';
        finishedSearch = true;
        saveData();
    }, 1100);
    setTimeout(() => {
        div.remove();
    },2200);
}

function buildMenuPieces()
{
    var content = document.createElement("div");
    content.id = "contentPieces";
    var button = document.createElement("button");
    button.addEventListener("click", function() {  changeMenuPieces(1); });
    button.innerHTML = "<";
    button.classList.add("buttonJigsaw");
    content.appendChild(button);

    for(var i = 0; i < 5; i++)
    {
        var div = document.createElement('div');
        div.classList.add("piece");
        var img = document.createElement("img");
        img.id = "eligible"+i;
        img.draggable = false;
        img.addEventListener("click", function(){ selectPiece(this); });
        if(arrayPieces.length > i)
        {
            
            img.src = "assets/img/"+numberImage+"/full.png";
            img.style.top = arrayPieces[i].top;
            img.style.left= arrayPieces[i].left;
            img.alt = arrayPieces[i].alt;
        }
        else
        {
            img.src = "assets/img/cellJigsaw.png";
            img.style.top = "-120px";
            img.style.left= "-120px";
            img.alt = "Empty";
        }
        div.appendChild(img);
        content.appendChild(div);
    }

    var button2 = document.createElement("button");
    button2.addEventListener("click", function() { changeMenuPieces(-1); });
    button2.innerHTML =">";
    button2.classList.add("buttonJigsaw");
    content.appendChild(button2);

    document.getElementById("game").appendChild(content);
}

function selectPiece(img2Selected)
{
    //Not chosen piece   
    if(img1Selected == null)
    {
        var id = img2Selected.id;
        if(isFromMenu(id))
        {
            if(img2Selected.alt == "piece")
            {
                var div = img2Selected.parentNode;
                div.classList.add("selected");
                img1Selected = img2Selected;
            }
        }
        else
        {
            var div = img2Selected.parentNode;
                div.classList.add("selected");
                img1Selected = img2Selected;
        }
    }
    else if (img1Selected != img2Selected && img2Selected.alt != "empty" || img1Selected.alt != "empty" && img1Selected.alt != img2Selected.alt)
    {
        clearInterval(intervalTimer);
        var div = img1Selected.parentNode; //For remove class CSS "selected"
        if(img1Selected.alt == "empty" )
        {
            //Change places between piece 1 and 2 so piece 2 is empty and it'll be easier to process
            var aux = img2Selected;
            img2Selected = img1Selected;
            img1Selected = aux;
            div = img2Selected.parentNode;
        }

        var aux = {top: img2Selected.style.top, left: img2Selected.style.left, src: img2Selected.getAttribute("src"), alt: img2Selected.alt};
        var id = img1Selected.id; //Obtain id
        if(img2Selected.alt != "empty")
        { 
            //Piece 2 isn't empty
            if(isFromMenu(id))
            {
                //piece1 is from Menu's pieces
                var id2 = img2Selected.id;
                if(isFromMenu(id2))
                {
                    console.log("no pasó nada, ambas piezas son del menú");
                }
                else
                {
                    //Change piece 1 from menu and piece 2 from jigsaw
                    img2Selected.style.top = img1Selected.style.top;
                    img2Selected.style.left = img1Selected.style.left;
                    img1Selected.style.top = aux.top;
                    img1Selected.style.left = aux.left;
                    id = id.substring(8,9);
                    id = parseInt(id);
                    var pos = id + positionList;
                    if(pos>arrayPieces.length-1) pos-=arrayPieces.length;
                    arrayPieces.splice(pos,1,{top: aux.top, left: aux.left, alt: aux.alt});
                    updatePuzzleMatrix(img2Selected, img2Selected);
                    console.log("Cambiamos pieza 1 de menú y pieza 2 de tablero");
                }
            }
            else
            {
                //piece1 is from table
                var id2 = img2Selected.id;
                img2Selected.style.top = img1Selected.style.top;
                img2Selected.style.left = img1Selected.style.left;
                img1Selected.style.top = aux.top;
                img1Selected.style.left = aux.left;
                img1Selected.src = aux.src;
                if(isFromMenu(id2)) //Piece2 is from menu?
                {
                    //Restore the array with the piece (1) returned in menu.
                    id2 = id2.substring(8,9);
                    id2 = parseInt(id2);
                    var obj = {top: img2Selected.style.top, left: img2Selected.style.left, alt: img2Selected.alt, src: img2Selected.src};
                    var pos = id2 + positionList;
                    if(pos>arrayPieces.length-1) pos-=arrayPieces.length;
                    arrayPieces.splice(pos,1,obj);
                    updatePuzzleMatrix(img1Selected, img1Selected);
                    console.log("Devolvimos la pieza 1 al menú y el 2° del menú pasó al tablero");
                }
                else
                {
                    //two pieces from table changed, nothing more
                    img1Selected.src = aux.src;
                    img1Selected.alt = aux.alt;
                    img1Selected.style.top = aux.top;
                    img1Selected.style.left = aux.left;
                    updatePuzzleMatrix(img1Selected, img1Selected);
                    updatePuzzleMatrix(img2Selected, img2Selected);
                    console.log("Dos piezas del tablero cambiaron");
                }
            }
        }
        else if(img2Selected.alt == "empty")
        {
            if(isFromMenu(id)) //Is piece 1 from the menu?
            {
                img2Selected.style.top = img1Selected.style.top;
                img2Selected.style.left = img1Selected.style.left;
                img2Selected.src = img1Selected.getAttribute("src");
                img2Selected.alt = img1Selected.alt;
                id = id.substring(8,9);
                id = parseInt(id);
                var pos = id + positionList;
                if(pos>arrayPieces.length-1) pos-=arrayPieces.length;
                arrayPieces.splice(pos,1);
                updatePuzzleMatrix(img2Selected, img1Selected);
                console.log("Pusimos una pieza del menú en una casilla vacía de la tabla");
            }
            else
            { 
               var id2 = img2Selected.id;
               if(isFromMenu(id2))
               {
                    var obj = {top: img1Selected.style.top, left: img1Selected.style.left, alt: img1Selected.alt, src: img1Selected.src};
                    img1Selected.style.top = img2Selected.style.top;
                    img1Selected.style.left = img2Selected.style.left;
                    img1Selected.src = img2Selected.src;
                    img1Selected.alt = img2Selected.alt;
                    arrayPieces.push(obj);
                    updatePuzzleMatrix(img1Selected, img2Selected);
                    var lastPosition = arrayPieces.length-1;
                    positionList[lastPosition]=lastPosition;
                    console.log("La pieza 1 del tablero volvió al menu");
               }
               else
               {
                   img2Selected.style.top = img1Selected.style.top;
                   img2Selected.style.left = img1Selected.style.left;
                   img2Selected.src = img1Selected.getAttribute("src");
                   img2Selected.alt = img1Selected.alt;
                   img1Selected.src = aux.src;
                   img1Selected.alt = aux.alt;
                   img1Selected.style.top = aux.top;
                   img1Selected.style.left = aux.left;
                   updatePuzzleMatrix(img1Selected, img1Selected);
                   updatePuzzleMatrix(img2Selected, img2Selected);
                   console.log("Dos piezas del tablero cambiaron. el 2° era 'empty'");
               }
            }    
        }
        //To default
        changeMenuPieces(0);
        img1Selected=null;
        div.classList.remove("selected");
        if(validatePuzzle(puzzleMatrix))
        {
            gameData.dataPuzzle = false;
            gameData.dataSaved = false;
            finishedSearch = false;
            if(turn == "johan")
            {
                clearInterval(intervalTimer);
                animationCardResolved();
                setTimeout(function()
                {
                    turn = "lefara";
                    document.getElementById("game").innerHTML = null;
                    saveData();
                    loadGame();
                },8000);
            }
            else
            {
                clearInterval(intervalTimer);
                animationCardResolved();
                setTimeout(function()
                {
                    document.getElementById("card").remove();
                    if(players[0].pointCP < players[1].pointCP)
                    {
                        showMsgBox(3, "johan");
                        playJohanVoice(2);
                    }
                    else if(players[0].pointCP > players[1].pointCP)
                    {
                        showMsgBox(3, "lefara");
                        playLefaraVoice(2);
                    }
                    else
                    {
                        showMsgBox(3, "tie");
                    }
                    playVictorySound();
                    turn = "johan";
                    lastImage = null;
                    players[0].pointCP = 0;
                    players[1].pointCP = 0;
                    saveData();
                },8000);
            }
        }
        intervalTimer = setInterval(function(){
            if(turn == "johan")
            {
                players[0].pointCP++;   
            }
            else
            {
                players[1].pointCP++;
            }
            saveData();
        },1000);
    }
    else if(img2Selected == img1Selected)
    {
        //To default
        var div = img1Selected.parentNode; //For remove the class CSS "selected"
        img1Selected=null;
        div.classList.remove("selected");
    }
}

function animationCardResolved()
{
    var div = document.getElementById("card");
    div.classList.remove("hidden");
    div.children[0].classList.add("animatedCard");
}

function isFromMenu(id)
{
    for(var i = 0; i < 5; i++)
    {
        if(id == "eligible"+i)
        {
            return true;
        }
    }
    return false;
}

function changeMenuPieces(num)
{
    var px = sizePixels(1);
    positionList += num;
    if(num == 0)
    {
        num = 1; //Evade error
    }
    if(positionList < 0)
    {
        positionList = arrayPieces.length-1;
    }
    if(positionList > arrayPieces.length-1)
    {
        positionList = 0;
    }
    for(var i =0;i < 5; i++)
    {
        var count = positionList+i*num;
        if(count > arrayPieces.length-1)
        {
            count -= (arrayPieces.length);
        }
        else if(count < 0)
        {
            count += (arrayPieces.length-1);
        }
        num = 1; //if is =1 it will ocurr error
        var img = document.getElementById("eligible"+i);
        if(arrayPieces.length-1 < 5 && i > arrayPieces.length - 1)
        {
            img.alt = "empty";
            img.src = "assets/img/cellJigsaw.png";
        }
        else
        {
            img.style.top = arrayPieces[count].top;
            img.style.left = arrayPieces[count].left;
            img.alt = arrayPieces[count].alt;
            img.src = 'assets/img/'+numberImage+'/full.png';
        }
    }
}

function obtainPositionJigsaw(id)
{
    var array = id;
    array = array.split("_");
    for(var i=0;i<array.length;i++)
    {
        array[i] = Number(array[i]);
    }
    return array;
}

function validatePuzzle(mapGame)
{
    var px = sizePixels(1);
    for(var i = 0; i < mapGame.length; i++)
    {
        for(var j = 0; j < mapGame[i].length; j++)
        {
            var topPlayer = mapGame[i][j].top;
            var topWin = (-i*px)+"px";
            var leftPlayer = mapGame[i][j].left;
            var leftWin = (-j*px)+"px";
            var altPlayer = mapGame[i][j].alt;
            if(altPlayer == "empty" || topPlayer != topWin || leftPlayer != leftWin)
            {
                return false;
            }
        }
    }
    return true;
}

function updatePuzzleMatrix(idSelected, imgSelected)
{
    var parent =idSelected.parentNode;
    var idParent = parent.id;
    var position = obtainPositionJigsaw(idParent);
    var pieceX = position[0];
    var pieceY = position[1];
    var saveTop = imgSelected.style.top;
    var saveLeft = imgSelected.style.left;
    var saveSrc = imgSelected.getAttribute("src");
    var saveAlt = imgSelected.alt;
    var obj = {top: saveTop, left: saveLeft, src: saveSrc, alt: saveAlt};
    puzzleMatrix[pieceX][pieceY] = obj;
    saveData();
}