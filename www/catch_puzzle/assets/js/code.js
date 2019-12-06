var turn;
var mapMatrix = [];
var posPlayer = [];
var gameData;
var widthMap = 10;
var heightMap = 10;
var players;
var playersTimes = [{points: 0, time: 0}, {points: 0, time: 0}];

function startGame()
{
    players = localStorage.getItem("players");
    players = JSON.parse(players);
    gameData = localStorage.getItem('dataCP');
    gameData = JSON.parse(gameData);
    if(gameData.dataSaved)
    {
        getData();

    }
    else
    {

    }
    generateMatrix(widthMap, heightMap);
}

function generateMatrix(w, h)
{
    for(i=0;i<w;i++)
    {
        
    }
}

function generateMaze()
{
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