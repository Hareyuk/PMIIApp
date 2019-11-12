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
        puntaje: ""
    },
    {
        picture: "",
        name: "",
        nick: "",
        puntaje: ""
    }
];


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

        }
        else
        {
            //Enable all inputs, is first time
            var shadowBox = document.getElementById('shadowBox');
            shadowBox.hidden = false;
            loadInputs();
        }
    }
};

app.initialize();

//Enable all inputs
function loadInputs()
{
    document.getElementById("shadowBox").hidden = false;
    document.getElementById("sendData").disabled = false;
    var btn1 = document.getElementById('takePicture1');
    btn1.onclick = takePicture(1);
    document.getElementById("takePicture1").disabled = false;
    document.getElementById("namePlayer1").disabled = false;
    document.getElementById("nickName1").disabled = false;
    document.getElementById('myImage1').hidden = false;
    var btn2 = document.getElementById('takePicture2');
    btn2.onclick = takePicture(2);
    document.getElementById("takePicture2").disabled = false;
    document.getElementById("namePlayer2").disabled = false;
    document.getElementById("nickName2").disabled = false;
    document.getElementById('myImage2').hidden = false;
}

function takePicture(num)
{
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 20,
        mediaType: Camera.MediaType.PICTURE,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 200,
        targetHeight: 200,
        correctOrientation: true
    });
    
    function onSuccess(imageData) {
        var image = document.getElementById('myImage' + num);
        image.hidden = false;
        image.src = "data:image/jpeg;base64," + imageData;
    }
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }
}
//SubmitForm

/*
function saveLocalData()
{
    localStorage.setItem('players', JSON.stringify(players));
}

function loadLocalData()
{
    players = localStorage.getItem('players');
    players = JSON.parse(players);
}

function submitData()
{
    var allRight = true;
    var nameP = document.getElementById("namePlayer");
    var nickP = document.getElementById("nickName");
    var imgP = document.getElementById("myImage");
    var btnImg = document.getElementById("takePicture");
    if(nameP.value == "")
    {
        allRight = false;
        nameP.style.backgroundColor = "#f23f3f";
        nameP.style.color = "#fff";
    }
    else
    {
        nameP.style.backgroundColor = "";
        nameP.style.color = "";
    }

    if(nickP.value == "")
    {
        allRight = false;
        nickP.style.backgroundColor = "#f23f3f";
        nickP.style.color = "#fff";
    }
    else
    {
        nickP.style.backgroundColor = "";
        nickP.style.color = "";
    }

    if(imgP.src == "")
    {
        allRight = false;
        btnImg.style.backgroundColor = "#f23f3f";
        btnImg.style.color = "#fff";
    }
    else
    {
        btnImg.style.backgroundColor = "";
        btnImg.style.color = "";
    }

    if(allRight)
    {
        players[playerNumberData].name = nameP.value;
        players[playerNumberData].nick = nickP.value;
        players[playerNumberData].picture = imgP.src; 
        document.getElementById("shadowBox").hidden = true;
        if(localStorage.length > 0)
        {
            //If new
            loadInputs()
        }
        console.log('All datas loaded successful');
    }
}*/

