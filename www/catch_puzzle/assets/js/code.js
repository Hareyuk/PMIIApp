var turn = "johan";
var mapMatrix = [];
var posPlayer = {x:0,y:0};
var gameData;
var widthMap = 20;
var heightMap = 20;
var players;
var playersTimes = [{points: 0, time: 0}, {points: 0, time: 0}];
var canMove = true;
var tableGame;

function startGame()
{
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
    mapMatrix = putPlayerInMaze(widthMap, heightMap,mapMatrix);
    mapMatrix = putPieces(widthMap,heightMap, mapMatrix);
    generateMazeTable(widthMap, heightMap, mapMatrix);
    moveTable();
    generateCharacter(turn);
}

function generateCharacter(character)
{
    var img = document.createElement("img");
    img.alt = character;
    img.src = "assets/img/frames_"+character+"/1.png";
    img.classList.add("character");
    document.querySelector("#game div").appendChild(img);
}

function generateMatrix(w, h, m)
{
    for(var i=0;i<w;i++)
    {
        m.push([]);
        for(var j=0; j < h; j++)
        {
            m[i][j] = null; 
        }
    }
    return m;
}

function putPlayerInMaze(w, h, m)
{
    var randX = genRandom(1,h-2);
    var randY = genRandom(1, w-2);
    while(m[randX][randY] == "X")
    {
        randX = genRandom(1,h-2);
        randY = genRandom(1, w-2);
    }
    m[randX][randY] = "P";
    posPlayer.x = randX;
    posPlayer.y = randY;
    return m;
}

function putPieces(w, h, m)
{
    return m;
}

function generateMazeTable(w, h, m)
{
    var div = document.createElement("div");
    var table = document.createElement("table");
    for(var i=0;i <w;i++)
    {
        var tr = document.createElement("tr");
        for(var j=0;j<h;j++)
        {
            var td = document.createElement("td");
            if(m[i][j] == null)
            {
                td.classList.add("passThrough");
            }
            else if(m[i][j] == "X")
            {
                td.classList.add("doNotPass");
            }
            else if (m[i][j] == "P")
            {
                //Add turn later
                td.classList.add("player");
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

async function moveTable()
{
    tableGame.style.top = (-posPlayer.x*100+200)+"px";
    tableGame.style.left = (-posPlayer.y*100+200)+"px";
}

function genRandom(min, max)
{
    return Math.round(Math.random() * (max - min) + min);
}

function markWallsMatrix(w, h, m)
{
    //Left & Right
    for(var i = 0; i < w; i++)
    {
        //Left
        m[i][0] = "X";
        m[i][1] = "X";
        //Right
        m[i][h-1] = "X";
        m[i][h-2] = "X";
    }

    //Up & Down
    for(var i = 0; i < h; i++)
    {
        //Up
        m[0][i] = "X";
        m[1][i] = "X";
        //Down
        m[w-1][i] = "X";
        m[w-2][i] = "X";
    }
    m = buildWalls(w, h, m);
    m = cellsLocked(w, h, m);
    return m;
}

function cellsLocked(w, h, m)
{
    for(var i=1;i<w-2;i++)
    {
        for(var j=1;j<h-2;j++)
        {
            var top = m[i-1][j];
            var left = m[i][j-1];
            var bottom = m[i+1][j];
            var right = m[i][j+1];
            if(top == left && top == right && top == bottom && top == "X")
            {
                m[i][j] = "X";
            }
        }
    }
    return m;
}

function buildWalls(w, h, m)
{
    var cellFree = true;
    var arrayPositions = obtainPositions(w, h);
    arrayPositions = shuffle(arrayPositions);
    arrayPositions.splice(w*h/(w+h));
    while(arrayPositions.length>0)
    {
        var amountPos = arrayPositions.length - 1;
        var posRandom = genRandom(0, amountPos);
        var positions = arrayPositions[posRandom];
        positions = positions.split("_");
        arrayPositions.splice(posRandom, 1);
        var posX = parseInt(positions[0]);
        var posY = parseInt(positions[1]); 
        var dir = genRandom(0, 3); //0 = up | 1 = left | 2 = down | 3 = right
        while(posY > 1 && posY < h-2 && posX > 1 && posX < w-2)
        {
            if(dir == 0)
            {
                //Found a wall in two cells top
                if(m[posX-1][posY] == "X" && cellFree == true)
                {
                    
                    //Coming from other side?
                    if(m[posX-1][posY-1] == "X" && m[posX-1][posY+1] =="X")
                    {   
                        cellFree = false;
                        m[posX][posY] = null;
                        if(posX > 3)
                        {
                            m[posX-3][posY] = null;
                        }
                        posX-=3;
                    }
                    else m[posX-1][posY] == "X"; break;
                }
                else
                {
                    if(cellFree == false)
                    {
                        cellFree= true;
                    }
                    posX--;
                    m[posX][posY] = "X";
                    posX--;
                }
            }
            else if(dir == 1)
            {
                if(m[posX][posY+1] == "X")
                {
                    if(m[posX+1][posY+1] == "X" && m[posX-1][posY+1] == "X" && cellFree == true)
                    {   
                        cellFree= false;
                        m[posX][posY] = null;
                        if(posY < h-3)
                        {
                            m[posX][posY+3] = null;
                        }
                        posY+=3;
                    }
                    else m[posX][posY+1] == "X"; break;
                }
                else
                {
                    if(cellFree == false)
                    {
                        cellFree= true;
                    }
                    posY++;
                    m[posX][posY] = "X";
                    posY++;
                }
            }
            else if(dir == 2)
            {
                if(m[posX+1][posY] == "X")
                {
                    if(m[posX+1][posY+1] == "X" && m[posX+1][posY-1] == "X"  && cellFree == true)
                    {
                        cellFree= false;
                        m[posX][posY] = null;
                        if(posX < w-3)
                        {
                            m[posX+3][posY] = null;
                        }
                        posX+=3;
                    }
                    else m[posX+1][posY] == "X"; break;
                }
                else
                {
                    if(cellFree == false)
                    {
                        cellFree= true;
                    }
                    posX++;
                    m[posX][posY] = "X";
                    posX++;
                }
            }
            else if(dir == 3)
            {
                if(m[posX][posY-1] == "X")
                {
                    if(m[posX+1][posY-1] == "X" && m[posX-1][posY-1] == "X" && cellFree == true)
                    {
                        cellFree= false;
                        m[posX][posY] = null;
                        if(posY > 3)
                        {
                            m[posX][posY-3] = null;
                        }
                        posY-=3;
                    }
                    else m[posX][posY-1] == "X"; break;
                }
                else
                {
                    if(cellFree == false)
                    {
                        cellFree= true;
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

function obtainPositions(w, h)
{
    var array = [];
    for(var i=0;i<w;i++)
    {
        for(var j=0;j<h;j++)
        {
            if(i>2 && i < (w-3) && j > 2 && j < (h-3))
            {
                array.push(i+"_"+j);
            }
        }
    }
    return array;
}

function getData()
{
    turn = gameData.turn;
    mapMatrix = gameData.mapMatrix;
    posPlayer = gameData.mapMatrix;
}

function saveData()
{

}

//Taken from: http://sedition.com/perl/javascript-fy.html
function shuffle(array) {
var currentIndex = array.length, temporaryValue, randomIndex;

while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
}

return array;
}


/* Keyboard events from https://stackoverflow.com/questions/14261062/js-function-when-keyboard-key-is-pressed/14262201 */
function keyListener(event){ 
//whatever we want to do goes in this block
event = event || window.event; //capture the event, and ensure we have an event
var key = event.key || event.which || event.keyCode; //find the key that was pressed
//MDN is better at this: https://developer.mozilla.org/en-US/docs/DOM/event.which
if(key===84){ //this is for 'T'
    doThing();
}
}


/* the last example replace this one */

var el = window; //we identify the element we want to target a listener on
//remember IE can't capture on the window before IE9 on keypress.

var eventName = 'keypress'; //know which one you want, this page helps you figure that out: http://www.quirksmode.org/dom/events/keys.html
//and here's another good reference page: http://unixpapa.com/js/key.html
//because you are looking to capture for things that produce a character
//you want the keypress event.

//we are looking to bind for IE or non-IE, 
//so we have to test if .addEventListener is supported, 
//and if not, assume we are on IE. 
//If neither exists, you're screwed, but we didn't cover that in the else case.
if (el.addEventListener) {
el.addEventListener('click', keyListener, false); 
} else if (el.attachEvent)  {
el.attachEvent('on'+eventName, keyListener);
}

//and at this point you're done with registering the function, happy monitoring