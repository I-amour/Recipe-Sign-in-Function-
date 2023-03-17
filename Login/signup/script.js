var firebaseConfig = {
  apiKey: "AIzaSyAsJAXmUHomzTOX9vzDAKe0QI7kZyKF2pE",
  authDomain: "sign-up-page-86e28.firebaseapp.com",
  projectId: "sign-up-page-86e28",
  storageBucket: "sign-up-page-86e28.appspot.com",
  messagingSenderId: "867021054091",
  appId: "1:867021054091:web:50086d4b2a45dee995348e",
  measurementId: "G-R4Z926GE1C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Get a reference to the database
var database = firebase.database().ref("data");
var storage = firebase.storage().ref();

// Register the user and save their information to the database
function registerUser() {
  var email = document.getElementById("signup-email").value;
  var password = document.getElementById("signup-password").value;
  var displayName = document.getElementById("signup-name").value;
  var file = document.getElementById("signup-image").files[0]; // get the selected file
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      var user = userCredential.user;
      console.log("User created with ID:", user.uid);
      
      // Update the user's display name
      user.updateProfile({
        displayName: displayName
      }).then(function() {
        console.log("Display name updated:", user.displayName);
        
        // Upload the profile picture to Firestore Storage
        var storageRef = firebase.storage().ref("profile-pictures/" + user.uid);
        var uploadTask = storageRef.put(file);
        
        // Listen for state changes, errors, and completion of the upload task
        uploadTask.on("state_changed", function(snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        }, function(error) {
          console.error("Error uploading profile picture:", error);
        }, function() {
          // Upload completed successfully, get the download URL of the file
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            
            // Update the user's photoURL field with the download URL
            user.updateProfile({
              photoURL: downloadURL
            }).then(function() {
              console.log("Photo URL updated:", user.photoURL);
              
              // Save the user's information to the database
              var userInfo = database.push();
              userInfo.set({
                name: displayName,
                password: password,
                email: email,
                photoURL: downloadURL
              });
              
              // Sign in the user and redirect them to the recipe page
              firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function() {
                  console.log("User signed in");
                  alert("Successfully Signed Up");
                  window.location.href = "../../index.html";
                })
                .catch(function(error) {
                  console.error("Error signing in user:", error);
                });
            })
            .catch(function(error) {
              console.error("Error updating photo URL:", error);
            });
          })
          .catch(function(error) {
            console.error("Error getting download URL:", error);
          });
        });
      })
      .catch(function(error) {
        console.error("Error updating display name:", error);
      });
    })
    .catch(function(error) {
      console.error("Error creating user:", error);
    });
}


// Listen for the form submission event and register the user
document.getElementById("signupform").addEventListener('submit', function(event) {
  
  event.preventDefault();
  registerUser();
  document.getElementById("signupform").reset();
});
