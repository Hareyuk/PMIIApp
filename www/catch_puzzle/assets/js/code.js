var turn;
var mapMatrix = [];
var posPlayer = [];
var gameData;
var widthMap = 20;
var heightMap = 20;
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
            m[i][j] = null; 
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
            if(m[i][j] == null)
            {
                td.classList.add("passThrough");
            }
            else if(m[i][j] == "X")
            {
                td.classList.add("doNotPass");
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById("game").appendChild(table);
}

function createWallH(posX, posI, posF, free, m)
{
    for(var i = posI; i <= posF; i++)
    {
        if(i != free)
        {
            m[posX][i] = "X";
        }
    }
    return m;
}

function createWallV(posY, posI, posF, free, m)
{
    for(var i = posI; i <= posF; i++)
    {
        if(i!=free)
        {
            m[i][posY] = "X";
        }
    }
    return m;
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
        m[0][i] = "X";
        //Down
        m[m.length-1][i] = "X";
        //Left
        m[i][0] = "X";
        //Right
        m[i][m.length-1] = "X";
    }

    var r = genRandom(0,1);
    var amount = (w*h) / m.length;
    amount = (amount / 2) - 1; 
    var placeRandom = m.length / 2;
    var placeRandom = genRandom(placeRandom*0.8, placeRandom*1.2);
    var cellFree = genRandom(1, (m.length - 2));
    if(r == 0)
    {
        m = createWallH(placeRandom, 0, (m.length-1), cellFree, m);
    }
    else
    {
        m = createWallV(placeRandom, 0, (m.length-1), cellFree, m);
    }

    for(var i = 0; i < amount; i++)
    {
        for(var j = 0; j < amount; j++)
        {
            if(r == 0)
            {

                r++;
            }
            else 
            {

                r--;
            }
        }
    }
    return m;
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