var turn;
var mapMatrix = [];
var posPlayer = [];
var gameData;
var widthMap = 30;
var heightMap = 30;
var players;
var playersTimes = [{points: 0, time: 0}, {points: 0, time: 0}];

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
    generateMaze(widthMap, heightMap, mapMatrix);
}

function generateMatrix(w, h, m)
{
    for(var i=0;i<w;i++)
    {
        m.push([]);
        for(var j=0; j < h; j++)
        {
            m[i][j] = 0; 
        }
    }
    return m;
}

function generateMaze(w, h, m)
{
    var table = document.createElement("table");
    for(var i=0;i <w;i++)
    {
        var tr = document.createElement("tr");
        for(var j=0;j<h;j++)
        {
            var td = document.createElement("td");
            td.style.width = "20px";
            td.style.height = "20px";
            if(m[i][j] == 0)
            {
                td.classList.add("passThrough");
            }
            else if(m[i][j] == 1)
            {
                td.classList.add("doNotPass");
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById("game").appendChild(table);
}

function genRandom(min, max)
{
    return Math.round(Math.random() * (max - min) + min);
}

function markWallsMatrix(w, h, m)
{
    for(var i = 0; i < w; i++)
    {
        //Up
        m[0][i] = 1;
        //Down
        m[m.length-1][i] = 1;
        //Left
        m[i][0] = 1;
        //Right
        m[i][m.length-1] = 1;
    }

    m = buildWalls(w, h, m);
    m = cellsLocked(w, h, m);
    return m;
}

function cellsLocked(w, h, m)
{
    for(var i=1;i<h-2;i++)
    {
        for(var j=1;j<w-2;j++)
        {
            var top = m[i-1][j];
            var left = m[i][j-1];
            var bottom = m[i+1][j];
            var right = m[i][j+1];
            if(top == left && top == right && top == bottom && top == 1)
            {
                m[i][j] = 1;
            }
        }
    }
    return m;
}

function buildWalls(w, h, m)
{
    var arrayPositions = obtainPositions(w, h);
    arrayPositions = shuffle(arrayPositions);
    arrayPositions.splice(w*h/(w+h));
    var dir = genRandom(0, 3); //0 = up | 1 = left | 2 = down | 3 = right
    while(arrayPositions.length>0)
    {
        var limitFree = m.length/arrayPositions.length;
        var amountFrees = 0;
        var amountPos = arrayPositions.length - 1;
        var posRandom = genRandom(0, amountPos);
        var positions = arrayPositions[posRandom];
        positions = positions.split("_");
        arrayPositions.splice(posRandom, 1);
        var posX = parseInt(positions[0]);
        var posY = parseInt(positions[1]); 
        while(posY > 1 && posY < h-2 && posX > 1 && posX < w-2)
        {   
            if(dir == 0)
            {
                if(m[posX-1][posY] == 1 && amountFrees < limitFree)
                {
                    if(posX > 3)
                    {
                        m[posX-2][posY] = 0;
                    }
                    posX-=3;
                    amountFrees++;
                }
                else
                {
                    m[posX][posY] = 1;
                    posX--;
                    m[posX][posY] = 1;
                    posX--;
                }
            }
            else if(dir == 1)
            {
                if(m[posX][posY+1] == 1 && amountFrees < limitFree)
                {
                    if(posY < h-3)
                    {
                        m[posX][posY+2] = 0;
                    }
                    posY+=3;
                    amountFrees++;
                }
                else
                {
                    m[posX][posY] = 1;
                    posY++;
                    m[posX][posY] = 1;
                    posY++;
                }
            }
            else if(dir == 2)
            {
                if(m[posX+1][posY] == 1 && amountFrees < limitFree)
                {
                    if(posX < w-3)
                    {
                        m[posX+2][posY] = 0;
                    }
                    posX+=3;
                    amountFrees++;
                }
                else
                {
                    m[posX][posY] = 1;
                    posX++;
                    m[posX][posY] = 1;
                    posX++;
                }
            }
            else if(dir == 3)
            {
                if(m[posX][posY-1] == 1 && amountFrees < limitFree)
                {
                    if(posY > 3)
                    {
                        m[posX][posY-2] = 0;
                    }
                    posY-=3;
                    amountFrees++;
                }
                else
                {
                    m[posX][posY] = 1;
                    posY--;
                    m[posX][posY] = 1;
                    posY--;
                }
            }
        }
        amountFrees=0;
        (dir < 3) ? dir++ : dir=0;
        
    }
    return m;
}


function canPassAll(m)
{

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