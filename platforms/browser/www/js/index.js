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
    player2ID: 0,
    turnPlayer: 0,
    canClick: true
}

var dataMT =
{
    dataSaved: false,
    size: 0,
    matrix: [],
    player1ID: 0,
    player2ID: 0,
    pairsFound: 0,
    turnPlayer: 0,
}

var dataCP =
{
    dataSaved: 0,
    player1Points: 0,
    player2Points: 0
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
    btn1.setAttribute("onclick", "takePicture(1)");
    document.getElementById("takePicture1").disabled = false;
    document.getElementById("namePlayer1").disabled = false;
    document.getElementById("nickName1").disabled = false;
    document.getElementById('myImage1').hidden = false;
    var btn2 = document.getElementById('takePicture2');
    btn2.setAttribute("onclick", "takePicture(2)");
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
}