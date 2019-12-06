var turn;
var mapMatrix = [];
var posPlayer = [];
var gameData;

function startGame()
{
    getData();
}

function generateMaze()
{

}

function getData()
{
    gameData = localStorage.getItem('dataCP');
    gameData = JSON.parse(gameData);
    turn = gameData.turn;
    mapMatrix = gameData.mapMatrix;
    posPlayer = gameData.mapMatrix;
}

function saveData()
{

}