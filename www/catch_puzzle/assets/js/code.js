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
var numberImage;
var arrayPieces=[];
var puzzleMatrix=[];
//For pieces' selector
var selectorPieces = [0,1,2,3,4];

function startGame() {
    players = localStorage.getItem("players");
    players = JSON.parse(players);
    gameData = localStorage.getItem('dataCP');
    gameData = JSON.parse(gameData);
    gameData = {dataSaved: true,dataPuzzle:false}; //DELETE LATER
    if(gameData.dataSaved)
    {
        //getData();
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
        mapMatrix = generateMatrix(widthMap, heightMap, mapMatrix);
        mapMatrix = markWallsMatrix(widthMap, heightMap, mapMatrix);
        mapMatrix = putPieces(widthMap, heightMap, mapMatrix);
        mapMatrix = putPlayerInMaze(widthMap, heightMap, mapMatrix);
        generateMazeTable(widthMap, heightMap, mapMatrix);
        moveTable();
        generateCharacter(turn);
    }
    //showNames();
    document.addEventListener("keydown", pressKey);
    document.addEventListener("keyup", keyUp);
}

function showNames()
{
    var div = document.getElementById("names");
    var p = document.createElement("p");
    p.innerHTML = players[0].nick;
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

function moveTable() {
    var px; 
    var x = window.matchMedia("(max-width: 375px)");
    if(x.matches) px = 60;
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
    turn = gameData.turn;
    mapMatrix = gameData.mapMatrix;
    posPlayer = gameData.posPlayer;
}

function saveData() {
    gameData.turn = turn;
    gameData.mapMatrix = mapMatrix;
    gameData.posPlayer = posPlayer;
    gameData.numberImage = numberImage;
}


async function movePlayer(moveX, moveY, direction) {
    if (mapMatrix[posPlayer.x + moveX][posPlayer.y + moveY] != "X") {
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
            setTimeOuts.push(setTimeout(function()
            {
                
                setTimeOuts.push(setTimeout(function() {           
                    lastDirection = direction;
                }, 450));
                keepMoving = false;
            },400));
        }
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
            startJigsaw(1);
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
    numberImage = genRandom(0,1);
    if(newJigsaw == 1)
    {
        //Just to know if is new game or is there save
        puzzleMatrix = buildMatrixJigsaw(numberImage);
        arrayPieces = generateArrayPieces(numberImage);
    }
    //Show
    buildTableJigsaw(puzzleMatrix);
    buildMenuPieces();
    buildButtonsJigsaw();
}

function buildMatrixJigsaw()
{
    var m = [];
    var rowPieces = 5;
    var colPieces = 5;
    for(var i = 0; i < rowPieces; i++)
    {
        m.push([]);
        for(var j = 0; j < colPieces; j++)
        {
            m[i][j] = {top:-(120*i)+"px",left: (-120*j)+"px", src: "cellJigsaw.png", alt: "empty"};
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
            img.src= "assets/img/" + m[i][j].src;
            img.alt = m[i][j].alt;
            img.style.top=m[i][j].top;
            img.style.left=m[i][j].left;
            img.draggable = false;
            td.appendChild(img);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById('game').appendChild(table);
    var img = document.createElement("img");
    img.src = 'assets/img/'+numberImage+'/full.png';
    img.draggable = false;
    img.classList.add("guide_img");
    document.getElementById('game').appendChild(img);
}

function generateArrayPieces()
{
    var array = [];
    var amountPiecesX = 5;
    var amountPiecesY = 5;
    for(var i = 0; i < amountPiecesX;i++)
    {
        for(var j = 0; j < amountPiecesY;j++)
        {
            array.push({top:-(120*i)+"px",left: (-120*j)+"px", alt: "piece"});
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
    },1200);
}

function buildMenuPieces()
{
    var content = document.createElement("div");
    content.id = "contentPieces";
    
    var button = document.createElement("button");
    button.addEventListener("click", function() {  changePieces(-1); });
    button.innerHTML = "<";
    button.classList.add("buttonJigsaw");
    content.appendChild(button);

    for(var i = 0; i < 5; i++)
    {
        var div = document.createElement('div');
        div.classList.add("piece");
        var img = document.createElement("img");
        img.src = "assets/img/"+numberImage+"/full.png";
        img.style.top = arrayPieces[i].top;
        img.style.left= arrayPieces[i].left;
        img.alt = arrayPieces[i].alt;
        img.value = arrayPieces[i].id;
        img.id = "eligible"+i;
        img.draggable = false;
        img.addEventListener("click", function(){ selectPiece(this); });
        div.appendChild(img);
        content.appendChild(div);
    }

    var button2 = document.createElement("button");
    button2.addEventListener("click", function() { changePieces(1); });
    button2.innerHTML =">";
    button2.classList.add("buttonJigsaw");
    content.appendChild(button2);

    document.getElementById("game").appendChild(content);
}

function selectPiece(img)
{
    //Is a piece or empty cell?
    
    if(img1Selected == null)
    {
        //Not chosen piece
        var div = img.parentNode;
        div.classList.add("selected");
        img1Selected = img;
    }
    else if (img1Selected != img && img.alt != "empty" || img1Selected.alt != "empty" && img1Selected.alt != img.alt)
    {
        var div = img1Selected.parentNode; //For remove the class CSS "selected"
        if(img1Selected.alt == "empty")
        {
            var aux = img;
            img = img1Selected;
            img1Selected = aux;
            div = img.parentNode;
        }

        var aux = {top: img.style.top, left: img.style.left, src: img.src, alt: img.alt};
        img.style.top = img1Selected.style.top;
        img.style.left = img1Selected.style.left;
        var id = img1Selected.id; //Obtain id
        if(img.alt != "empty")
        { 
            if(!isFromMenu(id))
            {
                img1Selected.style.top = aux.top;
                img1Selected.style.left = aux.left;
                img1Selected.src = aux.src;   
                //Restore the array with the piece returned in menu
                id = id.substring(8,9);
                id = parseInt(id);
                arrayPieces.splice(id,0,{top: img.style.top, left: img.style.left, alt: img.alt});
            }
        }
        else if(img.alt == "empty")
        {
             //Is from the menu?
             img.src = img1Selected.src;
             img.alt = img1Selected.alt;
             if(isFromMenu(id))
             {
                id = id.substring(8,9);
                id = parseInt(id);
                arrayPieces.splice(selectorPieces[id],1);
                changePieces(0);
             }
             else
             {
                img1Selected.src = aux.src;
                img1Selected.alt = aux.alt;
                img1Selected.style.top = aux.top;
                img1Selected.style.left = aux.left; 
             }
            
        }
        //To default
        img1Selected=null;
        div.classList.remove("selected");
    }
    else if(img == img1Selected)
    {
        //To default
        var div = img1Selected.parentNode; //For remove the class CSS "selected"
        img1Selected=null;
        div.classList.remove("selected");
    }
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

function changePieces(num)
{
    for(var i =0;i < 5; i++)
    {
        var img = document.getElementById("eligible"+i);
        if(arrayPieces.length > 0)
        {
            selectorPieces[i] += num;
            if(selectorPieces[i] < 0)
            {
                selectorPieces[i] = arrayPieces.length-1;
            }
            if(selectorPieces[i] > arrayPieces.length-1)
            {
                selectorPieces[i] = 0;
            }
            var pieceSelected = selectorPieces[i];
            img.style.top = arrayPieces[pieceSelected].top;
            img.style.left = arrayPieces[pieceSelected].left;
            if(arrayPieces.length-1 < 5 && i > arrayPieces.length - 1)
            {
                img.alt = "empty";
                img.src = "assets/img/cellJigsaw.png";
            }
            else
            {
                img.alt = arrayPieces[pieceSelected].alt;
            }
        }
        else
        {
            //all cels empty
            img.style.top = 0+"px";
            img.style.left = (i*-120)+"px";
            img.alt = "empty";
            img.src = "assets/img/cellJigsaw.png";
        }
    }
}

function buildButtonsJigsaw()
{

}

function validatePuzzle(mapGame, mapOriginal)
{
    var won = true;
    for(var i = 0; i < mapGame.length; i++)
    {
        for(var j = 0; j < mapGame[i].length; j++)
        {
            var topPlayer = mapGame[i][j].top;
            var topWin = mapOriginal[i][j].top;
            var leftPlayer = mapGame[i][j].left;
            var leftWin = mapOriginal[i][j].left;
            if(topPlayer != topWin || leftPlayer != leftWin)
            {
                return false;
            }
        }
    }
    return won;
}