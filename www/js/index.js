/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var playerNumberData = 0; //If 0, is player 1. Else if 1, player 2.

var players=[
    {
        picture: "",
        name: "",
        nick: "",
        points: 0,
        pointTTT: 0,
        pointMT: 0,
        pointCP: 0
    },
    {
        picture: "",
        name: "",
        nick: "",
        points: 0,
        pointTTT: 0,
        pointMT: 0,
        pointCP: 0
    }
];

var dataTTT = 
{
    dataSaved: false,
    board: [],
    player1ID: 0,
    player2ID: 1,
    turnPlayer: 0,
    canClick: true,
    gameClean: false,
    winnerCells: [],
    savingCells: []
}

var dataMT =
{
    dataSaved: false,
    size: 0,
    matrix: [],
    player1ID: 0,
    player2ID: 1,
    pairsFound: 0,
    turnPlayer: 0,
}

var dataCP =
{
    dataSaved: 0,
    player1Points: 0,
    player2Points: 1
}


var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        //My code starts here
        if(localStorage.length > 0)
        {
            loadData();
            showGames();
            showInfo();
        }
        else
        {
            //Enable all inputs, is first time
            var shadowBox = document.getElementById('shadowBox');
            shadowBox.classList.remove('hidden');
            loadInputs();
        }
    }
};

app.initialize();

function showGames()
{
    var div = document.getElementById('games');
    div.classList.remove('hidden');
}

//Enable all inputs
function loadInputs()
{
    document.getElementById("shadowBox").classList.remove('hidden');
    document.getElementById("sendData").disabled = false;
    var btn1 = document.getElementById('takePicture1');
    btn1.setAttribute("formaction", "javascript:takePicture(1)");
    document.getElementById("takePicture1").disabled = false;
    document.getElementById("namePlayer1").disabled = false;
    document.getElementById("nickName1").disabled = false;
    var btn2 = document.getElementById('takePicture2');
    btn2.setAttribute("formaction", "javascript:takePicture(2)");
    document.getElementById("takePicture2").disabled = false;
    document.getElementById("namePlayer2").disabled = false;
    document.getElementById("nickName2").disabled = false;
}

function takePicture(num)
{
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 30,
        mediaType: Camera.MediaType.PICTURE,
        destinationType: Camera.DestinationType.DATA_URL,
        targetHeight: 100,
        targetWidth: 100,   
        correctOrientation: true,
        allowEdit: false
        
    });
    
    function onSuccess(imageData) {
        var image = document.getElementById('myImage' + num);
        image.classList.remove('hidden');
        image.alt = "Photo";
        image.src = "data:image/jpeg;base64," + imageData;
    }
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function submitData()
{
    var nameP1 = document.getElementById('namePlayer1');
    var nameP2 = document.getElementById('namePlayer2');
    var nickP1 = document.getElementById('nickName1');
    var nickP2 = document.getElementById('nickName2');
    var img1 = document.getElementById('myImage1');
    var img2 = document.getElementById('myImage2');
    var btnImg1 = document.getElementById('takePicture1');
    var btnImg2 = document.getElementById('takePicture2');

    var allRight = true;
    if(nameP1.value == "")
    {
        allRight = false;
        nameP1.setAttribute("style", "color: white; background-color:red;");
    }
    else
    {
        nameP1.setAttribute("style", "");
        players[0].name = nameP1.value;
    }

    if(nameP2.value == "")
    {
        allRight = false;
        nameP2.setAttribute("style", "color: white; background-color:red;");
    }
    else
    {
        nameP2.setAttribute("style", "");
        players[1].name = nameP2.value;
    }

    if(nickP1.value == "")
    {
        allRight = false;
        nickP1.setAttribute("style", "color: white; background-color:red;");
    }
    else
    {
        nickP1.setAttribute("style", "");
        players[0].nick = nickP1.value;
    }

    if(nickP2.value == "")
    {
        allRight = false;
        nickP2.setAttribute("style", "color: white; background-color:red;");
    }
    else
    {
        nickP2.setAttribute("style", "");
        players[1].nick = nickP2.value;
    }
    
    if(img1.alt == "None")
    {
        allRight = false;
        btnImg1.setAttribute("style", "color:white; background-color:red;");
    }
    else
    {
        btnImg1.setAttribute("style", "");
        players[0].picture = img1.src;
    }

    if(img2.alt == "None")
    {
        allRight = false;
        btnImg2.setAttribute("style", "color:white; background-color:red;");
    }
    else
    {
        btnImg2.setAttribute("style", "");
        players[1].picture = img2.src;
    }

    if(allRight == true)
    {
        saveData();
        document.getElementById('shadowBox').classList.add('hidden');
        showGames();
        showInfo();
    }

}

function saveData()
{
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('dataTTT', JSON.stringify(dataTTT));
    localStorage.setItem('dataMT', JSON.stringify(dataMT));
    localStorage.setItem('dataCP', JSON.stringify(dataCP));
}

function loadData()
{
    players = localStorage.getItem('players');
    players = JSON.parse(players);
    dataTTT = localStorage.getItem('dataTTT');
    dataTTT = JSON.parse(dataTTT);
    dataMT = localStorage.getItem('dataMT');
    dataMT = JSON.parse(dataMT);
    dataCP = localStorage.getItem('dataCP');
    dataCP = JSON.parse(dataCP);
    
}

function showInfo()
{
    document.getElementById('editButton').classList.remove('hidden');
    document.getElementById('profiles').classList.remove('hidden');
    for(var i=1; i <= 2; i++)
    {
        var namePl = document.querySelector('#player'+i+' h3');
        namePl.innerHTML = "Nombre: "+ players[(i-1)].name;
        
        var nickPl = document.querySelector('#player'+i+' h4');
        nickPl.innerHTML = "Apodo: " + players[(i-1)].nick;
        
        var imgPl = document.querySelector('#player'+i+' img');
        imgPl.src = players[(i-1)].picture;
        imgPl.alt = players[(i-1)].name;

        var pPl = document.querySelector('#player'+i+' p');
        var pointsTTT = players[(i-1)].pointTTT;
        var pointsMT = players[(i-1)].pointMT;
        var pointsCP = players[(i-1)].pointCP;
        var generalPoint = pointsTTT*750 + pointsMT + pointsCP; 
        pPl.innerHTML = "Puntaje general: " + generalPoint;
        pPl.innerHTML += "<br>Puntaje de tateti: "+players[(i-1)].pointTTT; 
        pPl.innerHTML += " <br>Puntaje de memotest: " + players[(i-1)].pointMT;
        pPl.innerHTML += "<br>Puntaje de Catch puzzle: " + players[(i-1)].pointCP;

    }
}

function hideInfo()
{
    document.getElementById('profiles').classList.add('hidden');   
}

function editProfiles()
{
    loadInputs();
    document.getElementById("namePlayer1").value = players[0].name;
    document.getElementById("nickName1").value = players[0].nick;
    document.getElementById('myImage1').src = players[0].picture;
    document.getElementById('myImage1').classList.remove('hidden');
    document.getElementById('myImage1').alt = players[0].name;
    document.getElementById("namePlayer2").value = players[1].name;
    document.getElementById("nickName2").value = players[1].nick;
    document.getElementById('myImage2').src = players[1].picture;
    document.getElementById('myImage2').alt = players[1].name;
    document.getElementById('myImage2').classList.remove('hidden');
}

function credits(num)
{
    if(num == 0)
    {
        document.getElementById('credits').classList.remove("hidden");
    }
    else
    {
        document.getElementById('credits').classList.add("hidden");
    }
}