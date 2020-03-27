// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfEVm9wldlkfp6lidnLAcHkEEN1f2iknw",
    authDomain: "ruvca-btl.firebaseapp.com",
    databaseURL: "https://ruvca-btl.firebaseio.com",
    projectId: "ruvca-btl",
    storageBucket: "ruvca-btl.appspot.com",
    messagingSenderId: "587990058453",
    appId: "1:587990058453:web:3fd764f3f5838525"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log("firebase.js loaded");

window.FirebaseLoginCachedOnly = (instance) => {

    var provider = new firebase.auth.GoogleAuthProvider();

    if (localStorage.token && localStorage.email && localStorage.display && localStorage.authenticatedToken) {
        instance.invokeMethod('LoginCallback', localStorage.email, localStorage.display, localStorage.token, localStorage.photoUrl, localStorage.authenticatedToken);
    }
};

window.setFirebaseAuthToken = (instance, authToken) => {
    localStorage.authenticatedToken = authToken;
};

window.getFirebaseAuthToken = (instance, authToken) => {
    if (localStorage.authenticatedToken) return localStorage.authenticatedToken;
    return "";
};


window.FirebaseLogin = (instance) => {

    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        //console.log(token);
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log(user);


        user.getIdToken(/* forceRefresh */ true).then(function (idToken) {

            localStorage.display = user.displayName;
            localStorage.email = user.email;
            localStorage.token = idToken;
            localStorage.photoUrl = user.photoURL;
            instance.invokeMethod('LoginCallback', user.email, user.displayName, idToken, user.photoURL, localStorage.authenticatedToken);

        }).catch(function (error) {
            console.log(error);
        });

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

};


window.FirebaseLogout = (instance) => {
    firebase.auth().signOut().then(() => {
        localStorage.display = "";
        localStorage.email = "";
        localStorage.token = "";
        instance.invokeMethod('LogoutCallback');
    });
};
