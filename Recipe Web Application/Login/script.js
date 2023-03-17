document.getElementById("login-error-msg-holder").style.display = "none";

var firebaseConfig = {
    apiKey: "AIzaSyAsJAXmUHomzTOX9vzDAKe0QI7kZyKF2pE",
    authDomain: "sign-up-page-86e28.firebaseapp.com",
    databaseURL: "https://sign-up-page-86e28-default-rtdb.firebaseio.com",
    projectId: "sign-up-page-86e28",
    storageBucket: "sign-up-page-86e28.appspot.com",
    messagingSenderId: "867021054091",
    appId: "1:867021054091:web:50086d4b2a45dee995348e",
    measurementId: "G-R4Z926GE1C"
  };
  
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();


  
  function UserLogin(event) {
    event.preventDefault();
    var email = document.getElementById("email-field").value;
    var password = document.getElementById("password-field").value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      document.getElementById("login-error-msg-holder").style.display = "none";
      alert("Successful Login");
      window.location.href = "../Recipe.html"; // redirect to recipes page
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
        document.getElementById("login-error-msg-holder").style.display = "block";
        alert("Incorrect password/email");
      } else {
        alert("You do not have an account, click the sign up button");
      }
      console.log(error);
    });
  }
  