var authContainer = document.getElementById("firebaseui-auth-container");

//User clicks "Report an Issue" button and is presented with disclaimer. Must confirm or cannot proceed to login.//
function loadBtn() {
    
        var btn = document.querySelector( '.btn' );
    
        var btnFront = btn.querySelector( '.btn-front' ),
            btnBack = btn.querySelector ( ' .btn-back' ),
            btnConfirm = btn.querySelector( '.btn-back .confirm' );
    
        btnFront.addEventListener( 'click', function( event ) {
            btnBack.style.visibility = "visible";
            
            var mx = event.clientX - btn.offsetLeft,
                my = event.clientY - btn.offsetTop;
    
            var w = btn.offsetWidth,
                h = btn.offsetHeight;
    
            var directions = [
                { id: 'top', x: w/2, y: 0 },
                { id: 'right', x: w, y: h/2 },
                { id: 'bottom', x: w/2, y: h },
                { id: 'left', x: 0, y: h/2 }
            ];
    
            directions.sort( function( a, b ) {
                return distance( mx, my, a.x, a.y ) - distance( mx, my, b.x, b.y );
            } );
    
            btn.setAttribute( 'data-direction', directions.shift().id );
            btn.classList.add( 'is-open' );
        } );
    
        btnConfirm.addEventListener( 'click', function( event ) {
            btn.style.display = "none";
            authContainer.style.display = "block"; 
            var main = document.getElementById('main');
            main.style.display = "flex";
            main.style.justifyContent = "center";           
        } );
    
        function distance( x1, y1, x2, y2 ) {
            var dx = x1-x2;
            var dy = y1-y2;
            return Math.sqrt( dx*dx + dy*dy );
        }
    };

//if authenticate successful//
function removeLoginScr() {
    var loginOverlay = document.getElementsByClassName("login-overlay")[0];
    var loginBackground = document.getElementsByClassName("login-background")[0];
    var titleWrapper = document.getElementsByClassName("title-wrapper")[0];
    var container = document.querySelector('.container');
    container.style.display ="none";
    authContainer.style.display = "none";
    loginOverlay.style.display = "none";
    loginBackground.style.display = "none";
    titleWrapper.style.display = "none";
}

//Loading screen post-authentication
var loadingOverlay = document.getElementById("loading");
var loadingTimeout;

function showLoading() {
  clearTimeout(loadingTimeout);
  loadingTimeout = setTimeout(function() {
    loadingOverlay.style.display = "block";
  }, 400);
}

function hideLoading() {
  clearTimeout(loadingTimeout);
  loadingTimeout = setTimeout(function() {
    loadingOverlay.style.display = "none";
  }, 400);
}
// Initialize Firebase
var config = {
    apiKey: "AIzaSyC4TgQIM5RXWNQzDVxrjbLKfdhuIlayRrs",
    authDomain: "publicfix-a8fa3.firebaseapp.com",
    databaseURL: "https://publicfix-a8fa3.firebaseio.com",
    projectId: "publicfix-a8fa3",
    storageBucket: "publicfix-a8fa3.appspot.com",
    messagingSenderId: "237938052181"
};

firebase.initializeApp(config);

//Logging map form data to Firebase
var database = firebase.database();

$('#addIssueBtn').on("click", function() {
  var issueCat = $('#issueType').val();
  var issueDetail = $('#issueDet').val().trim();

  var issueFinal = {
    category: issueCat,
    detail: issueDetail
  }

  database.ref('/user').child('/service').push(issueFinal);

  console.log(issueFinal.category);
  console.log(issueFinal.detail);

  $('#issueType').val().trim();
  $('#issueDet').val().trim();

  return false;
});

function addMarker(marker) {
  console.log(marker);
  var lat = marker.position.lat();
  var lng = marker.position.lng();
  var position = {
    lattitude: lat,
    longitude: lng
  }
  database.ref('/user').child('/Marker').push(position)
}

// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: 'index.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

// Track authorization status
initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;

            console.log('User', user);
            removeLoginScr();

            hideLoading();

            var userFull = {
              name: displayName,
              email: email
            }

            database.ref('/user').push(userFull);

            console.log(displayName);
            console.log(email);

            user.getIdToken().then(function(accessToken) {
                //document.getElementById('sign-in-status').textContent = 'Signed in';
                //document.getElementById('sign-in').textContent = 'Sign out';

                /*
                document.getElementById('account-details').textContent = JSON.stringify({
                  displayName: displayName,
                  email: email,
                  emailVerified: emailVerified,
                  phoneNumber: phoneNumber,
                  photoURL: photoURL,
                  uid: uid,
                  accessToken: accessToken,
                  providerData: providerData
                }, null, '  ');
                */

            });
        } else {

          hideLoading();
        
          // User is signed out.
          //document.getElementById('sign-in-status').textContent = 'Signed out';
          //document.getElementById('sign-in').textContent = 'Sign in';
          //document.getElementById('account-details').textContent = 'null';
        }
    }, function(error) {
        console.log(error);
    });
};

window.addEventListener('load', function() {
    initApp()
});

loadBtn();