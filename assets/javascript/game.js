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

// Firebase watcher + initial loader .on("value")
database.ref().on("value", function (snapshot) {
    console.log("Initial value: " + snapshot.val());

    // Create Error Handling
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});