// Initialize Firebase
var config = {
    apiKey: "AIzaSyCQ9tYU7GtsivtLEGnH74anSra--l052Rc",
    authDomain: "rps-multiplayer-c3663.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-c3663.firebaseio.com",
    projectId: "rps-multiplayer-c3663",
    storageBucket: "rps-multiplayer-c3663.appspot.com",
    messagingSenderId: "734365481521"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Global variables
var isPlayer1Connected = false;
var isPlayer2Connected = false;
var isGameOver = false;
var player = 0;
var turn = 0;

var player1Ref = database.ref("players/player1");
var player2Ref = database.ref("players/player2");

function restartGame() {
    $("#restart-area").show();
    //play again or quit

    // if quit
    // disconnect player
    // reset total game score.
    //
}

function checkGame(player1, player2) {

    // Tie game
    if (player1.choice === player2.choice && player1.choice != null && player2.choice != null) {
        player1.ties++;
        player2.ties++;
        $(".game-message").text("Tie Game!");
        isGameOver = true;
    }

    // Player 1 Wins

    if ((player1.choice == "rock" && player2.choice == "scissors") ||
        (player1.choice == "paper" && player2.choice == "rock") ||
        (player1.choice == "scissors" && player2.choice == "paper")) {
        
            if (!isGameOver) {
                player1.wins++;
                player2.losses++;
            }

        $(".game-message").text("Player 1 Wins!");
        isGameOver = true;
    }

    // Player 2 Wins
    if ((player1.choice == "rock" && player2.choice == "paper") ||
        (player1.choice == "paper" && player2.choice == "scissors") ||
        (player1.choice == "scissors" && player2.choice == "rock")) {

            if (!isGameOver) {
                player1.losses++;
                player2.wins++;
            }
        
        $(".game-message").text("Player 2 Wins!");
        isGameOver = true;
    }

    if (isGameOver) {

        console.log ("#1" + player1.choice);
        console.log ("#2" + player2.choice);

        $("#1" + player1.choice).show();
        $("#2" + player2.choice).show();

        database.ref("/players/player1").update({
            "wins": player1.wins,
            "losses": player1.losses,
            "ties": player1.ties,
            "choice": null
        });

        database.ref("/players/player2").update({
            "wins": player2.wins,
            "losses": player2.losses,
            "ties": player2.ties,
            "choice": null
        });

        // Restart Game
        restartGame();
    }
}

database.ref().on("value", function (snapshot) {

    var player1;
    var player2;

    // Needed to update Player 2 session if other players connects. 
    if (snapshot.child("players/player1").exists()) {
        isPlayer1Connected = true;

        if (player == 1 && !isGameOver) {
            $("#2rock").hide();
            $("#2paper").hide();
            $("#2scissors").hide();
        }

        if (player == 2 && !isGameOver) {
            $("#1rock").hide();
            $("#1paper").hide();
            $("#1scissors").hide();
        }

        player1 = {
            name: snapshot.val().players.player1.name,
            wins: snapshot.val().players.player1.wins,
            losses: snapshot.val().players.player1.losses,
            ties: snapshot.val().players.player1.ties,
            choice: snapshot.val().players.player1.choice
        }

        $("#player1-name").text(player1.name);
        $(".player1-status").text(isPlayer1Connected ? "Connected" : "Waiting");
        $(".player1-wins").text(player1.wins);
        $(".player1-losses").text(player1.losses);
        $(".player1-ties").text(player1.ties);
    } else {
        isPlayer1Connected = false;
        $(".player1-status").text(isPlayer1Connected ? "Connected" : "Waiting");
    }

    // Needed to update Player 1 session if other players connects. 
    if (snapshot.child("players/player2").exists()) {
        isPlayer2Connected = true;

        player2 = {
            name: snapshot.val().players.player2.name,
            wins: snapshot.val().players.player2.wins,
            losses: snapshot.val().players.player2.losses,
            ties: snapshot.val().players.player2.ties,
            choice: snapshot.val().players.player2.choice
        }

        $("#player2-name").text(player2.name);
        $(".player2-status").text(isPlayer2Connected ? "Connected" : "Waiting");
        $(".player2-wins").text(player2.wins);
        $(".player2-losses").text(player.losses);
        $(".player2-ties").text(player2.ties);
    } else {
        isPlayer2Connected = false;
        $(".player2-status").text(isPlayer2Connected ? "Connected" : "Waiting");
    }

    if (snapshot.child("players/player1/choice").exists()) {

        switch (player1.choice) {
            case "rock":
            case "paper":
            case "scissors":
                if (player == 1) {
                    $("#player1-message").text("You chose " + player1.choice);
                }

                if (player == 2) {
                    $("#player1-message").text(player1.name + " has chosen");
                }

                if (player2.choice == null || player2.choice == undefined) {
                    $("#player2-message").text("Waiting for " + player2.name + " to choose");
                } else {
                    checkGame(player1, player2);
                }
                break;
        }
    } else {
        if (!isGameOver && isPlayer1Connected && player1.choice == null && player == 1) {
            $("#1rock").show();
            $("#1paper").show();
            $("#1scissors").show();
        }
    }

    if (snapshot.child("players/player2/choice").exists()) {

        switch (player2.choice) {
            case "rock":
            case "paper":
            case "scissors":
                if (player == 1) {
                    $("#player2-message").text(player1.name + " has chosen");
                }

                if (player == 2) {
                    $("#player2-message").text("You chose " + player2.choice);
                }

                if (player2.choice === null || player2.choice == undefined) {
                    $("#player1-message").text("Waiting for " + player1.name + " to choose");
                } else {
                    checkGame(player1, player2);
                }
                break;
        }
    } else {
        if (!isGameOver && isPlayer2Connected && player2.choice == null && player == 2) {
            $("#2rock").show();
            $("#2paper").show();
            $("#2scissors").show();
        }
    }

    // Create Error Handling
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// Hide other players choice to show result
database.ref("players/").on("value", function (snapshot) {
    if (snapshot.child("player1/choice").exists()) {

        switch (snapshot.val().player1.choice) {
            case ("rock"):
                $("#1paper").hide();
                $("#1scissors").hide();
                break;
            case ("paper"):
                $("#1rock").hide();
                $("#1scissors").hide();
                break;
            case ("scissors"):
                $("#1rock").hide();
                $("#1paper").hide();
                break;
        }
    }

    if (snapshot.child("player2/choice").exists()) {
    
        switch (snapshot.val().player2.choice) {
            case ("rock"):
                $("#2paper").hide();
                $("#2scissors").hide();
                break;
            case ("paper"):
                $("#2rock").hide();
                $("#2scissors").hide();
                break;
            case ("scissors"):
                $("#2rock").hide();
                $("#2paper").hide();
                break;
        }
    }

});


// Click on Start button event
$("#input-submit").on("click", function (event) {
    event.preventDefault();

    var name = $("#input-name").val().trim();

    if (name === "" || name === undefined) {
        alert("Please type your name and then click start.");

    } else {

        $("#input-name").val("");
        $("#status-form").hide();

        if (isPlayer1Connected && isPlayer2Connected) {
            alert("Sorry, Game Full! Try Again Later!");
        } else if (!isPlayer1Connected) {
            console.log("Player1: " + isPlayer1Connected);
            console.log("Player2: " + isPlayer2Connected);

            player = 1;

            player1Ref.set({
                "name": name,
                "wins": 0,
                "losses": 0,
                "ties": 0,
                "choice": null
            });

            player1Ref.onDisconnect().remove();

            $(".game-message").html("Hi " + name + "! You are Player 1");

        } else if (!isPlayer2Connected) {
            console.log("Player1: " + isPlayer1Connected);
            console.log("Player2: " + isPlayer2Connected);

            player = 2;

            player2Ref.set({
                "name": name,
                "wins": 0,
                "losses": 0,
                "ties": 0,
                "choice": null
            });

            player2Ref.onDisconnect().remove();

            $(".game-message").html("Hi " + name + "! You are Player 2");
        }
    }

});

$(".choice").on("click", function (event) {
    var choice = $(this).attr("id");
    console.log(choice);

    function updateDB() {
        database.ref("players/player" + player).update({
            "choice": choice.substring(1, choice.length),
        });
    }

    switch (choice) {
        case (player + "rock"):
            $("#" + player + "paper").hide();
            $("#" + player + "scissors").hide();
            updateDB();
            break;
        case (player + "paper"):
            $("#" + player + "rock").hide();
            $("#" + player + "scissors").hide();
            updateDB();
            break;
        case (player + "scissors"):
            $("#" + player + "rock").hide();
            $("#" + player + "paper").hide();
            updateDB();
            break;
    }
});

$("#input-play").on("click", function (event) {
    event.preventDefault();
    turn++;

    $("#" + player + "rock").hide();
    $("#" + player + "paper").hide();
    $("#" + player + "scissors").hide();

    if (player == 1) {
        isGameOver = false;
        database.ref("/players").update({
            "turn": turn
        });      
    }

    if (player == 2) {
        isGameOver = false;
        database.ref("/players").update({
            "turn": turn
        });
    }
});

$("#input-quit").on("click", function (event) {
    event.preventDefault();
    if (player == 1) {
        isGameOver = true;
        player1Ref.remove();
        $("#status-form").show();
    }

    if (player == 2) {
        isGameOver = true;
        player2Ref.remove();
        $("#status-form").show();
    }
});

// All of our connections will be stored in this directory.
// connectionsRef references a specific location in our database.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function (snapshot) {
    if (snapshot.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snapshot) {
    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#connected-viewers").text(snapshot.numChildren());
});

$(document).ready(function () {

});