var count = 1;
var turn = 0; // 0 = X | 1 = O
var tableGame = [ [-1, -2, -3], [-4, -5, -6], [-7, -8, -9]];
var winPl1 = 0;
var winPl2 = 0;
var flagGaming = true; //Si alguien gana, que no se pueda hacer más clicks en el tablero pasandolo a FALSE
var winnerCells = []; //Cuando un jugador gana, sus celdas ganadoras se colorean
var savingCells = [];
var gameData = [];
var gameClean;
var players = [];
var theme = document.getElementById("themeAudio");
theme.volume = 0.4;

function loadLocalStorage()
{
    gameData = localStorage.getItem('dataTTT');
    gameData = JSON.parse(gameData);
    players = localStorage.getItem('players');
    players = JSON.parse(players);

    if(gameData.dataSaved == true)
    {
        getData();
        //table
        savingCells = localStorage.getItem('matrixPos');
        if(savingCells !== "undefined" && savingCells !== null)
        {
            savingCells = savingCells.split(',');
            reloadTableData();
        }
    }
    buildGame();
}

function getData()
{
    tableGame = gameData.board;
    gameClean = gameData.gameClean;
    winPl1 = players[0].pointTTT;
    winPl2 = players[1].pointTTT;
    flagGaming = gameData.canClick;
    savingCells = gameData.savingCells;
    winnerCells = gameData.winnerCells;
    turn = gameData.turn;
}

function reloadTableData()
{
    var counting=0;
    for(i=0;i<3;i++)
    {
        for(j=0;j<3;j++)
        {
            tableGame[i][j] = parseInt(savingCells[counting]);
            counting++;
        }
    }
}

function instruc() //Show instructions
{
    playPopAudio();
    $("#msgBox").removeClass("none");
    $("#msgBox").append('<div><h3>Instrucciones</h3><p>- El primer jugador en marcar 3 en línea en cualquier dirección (vertical, horizontal o diagonal) gana y obtiene 1 punto.</p><p>- Los jugadores tomarán turnos para marcar en la grilla.</p><p>- El juego se termina cuando los 9 casilleros están marcados.</p><p>- En caso de un empate ninguno de los jugadores obtiene puntos.</p><p>¡¡A disfrutar!!</p><button onclick="msgBoxDone()">¡Ok!</button onclick="playPopAudio();"></div>');
}

//Generar el cartel "¿Estás seguro?" con un parámetro para saber si es del reiniciar o salir
function areYouSure()
{
    playPopAudio();
    $("#msgBox").removeClass("none");
     $("#msgBox").append('<div><h3>¿Seguro que quiere reiniciar?</h3><button onclick="msgBoxDone(1)">Sí, deseo reiniciar</button><button onclick="msgBoxDone()">No, quiero seguir jugando</button></div>');
    $("#msgBox").addClass("sureAbout");
}


function msgBoxDone(num)
{
    playPopAudio();
    $("#msgBox").empty();
    $("#msgBox").addClass("none");
    $("#msgBox").removeClass("sureAbout");  
    if(num == 1)
    {  
        restartGame();
        gameData.dataSaved = false;
        saveData();
    }

    if(num ==2)
    {
        winPl1 = 0;
        winPl2 = 0;
        saveData();
        showPoints();
    }
}

function buildInfo(num)
{
    if(num == 0)
    {
        $("#displayInfo").append("<div id='info'></div>");
    }
    var classHand = 1;
    if(turn == 1)
    {
        classHand = 2;
    }
    $("#info").append("<div id='players'><img id='handPlayer' class='pointing"+classHand+"' src='assets/images/hand.png' alt='hand'><p id='point1'></p><p id='point2'></p></div>");
    if(flagGaming == false)
    {
        $("#handPlayer").remove();
    }
}

function buildButtons()
{
    $("#displayInfo").append("<div id='btns'></div>");
    $("#btns").append("<button onclick='areYouSure(1)'>Reiniciar</button>");
    $("#btns").append("<button onclick='instruc()'>Instrucciones</button>");
    $("#btns").append("<button onclick='restartPoints()'>Reiniciar puntos</button>")
}



function buildGame()
{
    $("#game").empty();
    //Create <table>
    $("#game").append("<div id='ttt'></div><div id='displayInfo'></div>");
    buildTable();
    buildInfo(0);
    buildButtons();
    showPoints();
}

function buildTable()
{
    $("#ttt").append("<table></table>");
    for(var i=0; i < 3; i++) //rows
    {
        //En cada fila generada, recibe 3 columnas generadas en la función "generateCol"
        $("#ttt table").append("<tr>"+generateCol(i)+"</tr>");
    }
    //Cuando se termina de construir la tabla, vuelvo el contador 1 para cuando se necesite reconstruir la tabla, las celdas sigan siendo del 1 a 9
    count=1;
    if(flagGaming == false)
    {
        paintCellsWin();
        noOneIsClickable();
    }
}

function generateCol(row)
{
    var txt ="";
    for(var j = 0; j < 3; j++)
    {

        if(tableGame[j][row] == 0)
        {
            txt += "<td id='col" +count+"' class='dontClick'><img src='assets/images/x.png' alt='mark X'></td>";
        }
        else if(tableGame[j][row] == 1)
        {
            txt += "<td id='col" +count+"' class='dontClick'><img src='assets/images/o.png' alt='mark O'></td>";    

        }
        else
        {
            txt += "<td id='col" +count+"' class='pointingActive' onmouseover='playOnHoverSound()' onclick='putSymbol("+count+")'></td>";    
        }
        count++;
    }
    return txt;
}

function playOnHoverSound()
{
    var audio = document.getElementById("onhoverAudio");
    audio.currentTime = 0;
    audio.play();
}

function playPopAudio()
{
    var audio = document.getElementById("popAudio");
    audio.currentTime = 0;
    audio.play();
}

function playVoltVoice(num)
{
    var audio = document.getElementById("voiceV"+num);
    audio.currentTime = 0;
    audio.play();
}

function playNinaVoice(num)
{
    var audio = document.getElementById("voiceN"+num);
    audio.currentTime = 0;
    audio.play();
}

function restartGame(num)
{
    playPopAudio();
    if(num==1)
    {
        saveData();
    }
    localStorage.removeItem('cellsWinTtt');
    flagGaming = true;  
    $("#ttt").empty();
    turn = 0;
    tableGame = [ [-1, -2, -3], [-4, -5, -6], [-7, -8, -9]];
    buildTable();
    $("#info").empty();
    buildInfo(1);
    showPoints();
    $("#winner").remove();
}

function playClickAudio()
{
    var audio = document.getElementById("clickAudio");
    audio.currentTime=0;
    audio.play();
}

function playVictoryAudio()
{
    var audio = document.getElementById("victoryAudio");
    audio.currentTime=0;
    audio.play();
}

function putSymbol(num)
{
    if(flagGaming)
    {
        saveData();
        var col = $('#col'+num);
        if(col.is(':empty') ) { 
            playClickAudio();
            col.removeClass('pointingActive');
            col.addClass('dontClick');
            col.removeAttr("onmouseover");
            //If its empty, put X or O
            //Put the number in the dimensional array matrix
            if(num == 1 || num == 4 || num == 7)
            {
                //col 0
                var result = parseInt(num / 3);
                tableGame[0][result] = turn;
            }
            else if(num == 2 || num == 5 || num == 8)
            {
                //col 1
                var result = parseInt(num / 3);
                tableGame[1][result] = turn;
            }
            else
            {
                //col 2
                var result = (parseInt(num / 3))-1;
                tableGame[2][result] = turn;
    
            }
            
            //Append PNG
            if(turn == 0)
            {
                playVoltVoice(2);
                col.append('<img src="assets/images/x.png" alt="mark X">');
            }
            else
            {
                playNinaVoice(2);
                col.append('<img src="assets/images/o.png" alt="mark O">');
            }
            saveData();
            validateWin();
        }
    }
    
}

function validateWin()
{
    var winner = false;

    //Vertical
    if(tableGame[0][0] == tableGame[0][1] && tableGame[0][1] == tableGame[0][2])
    {
        winner = true;
        winnerCells = [1, 4, 7];
    }

    if(tableGame[1][0] == tableGame[1][1] && tableGame[1][1] == tableGame[1][2])
    {
        winner = true;
        winnerCells = [2, 5, 8];
    }

    if(tableGame[2][0] == tableGame[2][1] && tableGame[2][1] == tableGame[2][2])
    {
        winner = true;
        winnerCells = [3, 6, 9];
    }

    //Horizontal
    if(tableGame[0][0] == tableGame[1][0] && tableGame[1][0] == tableGame[2][0])
    {
        winner = true;
        winnerCells = [1, 2, 3];
    }

    if(tableGame[0][1] == tableGame[1][1] && tableGame[1][1] == tableGame[2][1] )
    {
        winner = true;
        winnerCells = [4, 5, 6];
    }
    
    if(tableGame[0][2] == tableGame[1][2] && tableGame[1][2] == tableGame[2][2])
    {
        winner = true;
        winnerCells = [7, 8, 9];
    }

    //Diagonal
    if(tableGame[0][0] == tableGame[2][2] && tableGame[0][0] == tableGame[1][1])
    {
        winner = true;
        winnerCells = [1, 5, 9];
    }

    if(tableGame[2][0] == tableGame[0][2] && tableGame[1][1] == tableGame[2][0])
    {
        winner = true;
        winnerCells = [3, 5, 7];
    }

    $("#game").append('<div id="winner"></div>');

    if(winner== false)
    {
        if(tieGame())
        {
            $("#winner").append('<div><p>¡Empate!</p><button onclick="restartGame(1)">Jugar de nuevo</button></div>');
            $("#winner div").css("background-image","url('assets/images/tie_xo.jpg')");
        }
        else
        {
            changePlayer();
            $("#winner").remove();
            saveData();
        }

    }
    else
    {
        flagGaming = false;
        let imgPlayerWin;
        //Player winner! *claps claps*
        paintCellsWin();
        playVictoryAudio();
        if(turn == 0)
        {
            //LOCALSTORAGE: Podríamos meter aquí los localStorage de victorias de jugadores
            winPl1++;
            imgPlayerWin = "url('assets/images/win_x.jpg')";
            playVoltVoice(1);
        }
        else
        {
            winPl2++;
            imgPlayerWin = "url('assets/images/win_o.jpg')";
            changePlayer();
            playNinaVoice(1);
        }
        $("#handPlayer").remove();
        noOneIsClickable();
        saveData();
        showPoints();
        $("#winner").append('<div><p>¡Jugador ' + (turn + 1) + ' gana!</p><button onclick="javascript:$(\'#winner\').remove()">Ver el tablero</button><button onclick="restartGame(1)">Jugar de nuevo</button></div>');
        $("#winner div").css("background-image",imgPlayerWin);

    }
    saveData();
}

function showPoints()
{
    
    $("#point1").empty();
    $("#point2").empty();
    $("#point1").append(players[0].nick +": <span>" + winPl1+"</span>");
    $("#point2").append(players[1].nick +": <span>" + winPl2+"</span>");
}

function restartPoints()
{
    playPopAudio();
    $("#msgBox").removeClass("none");
     $("#msgBox").append('<div><h3>¿Reiniciar los puntos?</h3><button onclick="msgBoxDone(2)">Sí</button><button onclick="msgBoxDone()">No</button></div>');
    $("#msgBox").addClass("sureAbout");

}

function changePlayer()
{
    if(turn == 0)
    {
       $("#handPlayer").removeClass('pointing1');
        $("#handPlayer").addClass('pointing2');
        turn++;
    }
    else
    {
        turn--;
        $("#handPlayer").removeClass('pointing2');
        $("#handPlayer").addClass('pointing1');
    }
}

function tieGame()
{
    var tie = true;
    for(var i=0; i < 3; i++)
    {
        for(var j=0; j < 3; j++)
        {
            if(tableGame[i][j] < 0)
            {
                tie = false;
            }
        }
    }
    return tie;
}

function paintCellsWin()
{
    var classWinner;
    classWinner = (1+turn);
    for(i=0; i < 3; i++)
    {
        $("#col"+winnerCells[i]).addClass('cellWinner'+classWinner);
    }
}

function saveData()
{
    gameData.gameClean = gameClean;
    gameData.turn = turn;
    gameData.board = tableGame;
    gameData.dataSaved = true;
    gameData.savingCells  = savingCells;
    gameData.winnerCells = winnerCells;
    gameData.canClick = flagGaming;
    players[0].pointTTT = winPl1;
    players[1].pointTTT = winPl2;
    localStorage.setItem('dataTTT', JSON.stringify(gameData));
    localStorage.setItem('players', JSON.stringify(players));
}

function noOneIsClickable()
{
    for(i=1;i<10;i++)
    {
        $('#col'+i).removeClass('pointingActive');
        $('#col'+i).removeAttr("onmouseover");
        $('#col'+i).addClass('dontClick');
    }
}