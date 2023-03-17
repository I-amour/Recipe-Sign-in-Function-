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
 

  // Get the currently logged-in user's information
  const user = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var uid = user.uid;
      console.log(uid);
      var userRef = firebase.database().ref('data/' + uid);
      userRef.once('value').then(function(snapshot) {
          // Display user information on the page
          var name= user.displayName;
          console.log(name);
          document.getElementById('displayName').innerHTML = "Name: " + name;
          var email = user.email;
          document.getElementById('email').innerHTML = "Email: " + email;

      // Display user profile picture
      var photoURL = user.photoURL;
      console.log(photoURL);
      if (photoURL) {
        document.getElementById('profile-pic').src = photoURL;
      }
      });
      
    } else {
      // No user is signed in.
      console.log("User is not signed in.");
    }
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      const userId = user.uid;
      const recipeList = document.getElementById('recipe-list');
  
      // Get a reference to the user's recipes collection in Firestore
        // Get a reference to the user's recipes collection in Firestore
  const userRecipesRef = firebase.firestore().collection('users').doc(userId).collection('recipes');

  // Display the user's recipes in the recipe list
  userRecipesRef.onSnapshot(function(querySnapshot) {
    recipeList.innerHTML = '';
    querySnapshot.forEach(function(doc) {
      const recipe = doc.data();
      const ingredients = recipe.ingredients.split(',').map((ingredient) => `<li>${ingredient}</li>`).join('');
      const instruction = recipe.instruction.split('.').map((step) => `<li>${step}</li>`).join('');
      const image = recipe.image;
      recipeList.innerHTML += `
      <main>
        <article>
          <div>
          <img src="${image}" alt="Recipe Image" class="recipe-image">
            <h2>${recipe.name}</h2>
            <p>${recipe.description}</p>
            <h3>Ingredients:</h3>
            <ul>${ingredients}</ul>
            <h3>Instructions:</h3>
            <ol>${instruction}</ol>
            <button class="delete-recipe-btn">Delete Recipe</button>
            <button class="share-recipe-btn">Share Recipe</button>
            <button class="upload-image-btn">Upload Image</button>
          </div>
        </article>
      </main>
      `;
      const deleteRecipeButtons = document.querySelectorAll('.delete-recipe-btn');
      deleteRecipeButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
          const recipeId = doc.id;
          userRecipesRef.doc(recipeId).delete()
          .then(function() {
            alert('Recipe deleted successfully!');
          }).catch(function(error) {
            alert('Error deleting recipe: ' + error.message);
          });
        });
      });
      const sharedRecipesRef = firebase.firestore().collection('sharedRecipes');

      // ...
    
      // Add shared recipe to Firestore
      const shareRecipeButtons = document.querySelectorAll('.share-recipe-btn');
      shareRecipeButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
          const recipeId = doc.id;
          const recipeData = doc.data();
          sharedRecipesRef.add(recipeData)
            .then(function() {
              alert('Recipe shared successfully!');
            })
            .catch(function(error) {
              alert('Error sharing recipe: ' + error.message);
            });
        });
      });
      
      const uploadImageButtons = document.querySelectorAll('.upload-image-btn');
      uploadImageButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
          const recipeId = doc.id;
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`images/${recipeId}`);
            imageRef.put(file)
              .then(function(snapshot) {
                return imageRef.getDownloadURL();
              })
              .then(function(url) {
                return userRecipesRef.doc(recipeId).update({
                  image: url
                });
              })
              .then(function() {
                alert('Recipe image uploading successfully!');
              })
              .catch(function(error) {
              alert('Error uploading recipe image: ' + error.message);
            });
          });
              fileInput.click();
              });
              });
    });   
  });

  // Add a new recipe to the user's collection in Firestore
  const addRecipeForm = document.getElementById('add-recipe-form');
  addRecipeForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const recipeName = document.getElementById('recipe-name').value;
    const recipeDescription = document.getElementById('recipe-description').value;
    const recipeIngredients = document.getElementById('recipe-ingredients').value.split(',');
    const recipeInstructions = document.getElementById('recipe-instructions').value;
    userRecipesRef.add({
      name: recipeName,
      ingredients: recipeIngredients.join(','),
      description: recipeDescription,
      instruction: recipeInstructions
    }).then(function() {
      alert('Recipe added successfully!');
      addRecipeForm.reset();
    }).catch(function(error) {
      alert('Error adding recipe: ' + error.message);
    });
  });
  



} else {
  // No user is signed in
  window.location.replace('../Recipe.html');
}
  });
  
logoutButton= document.getElementById('logout-btn');
		// Add event listener to logout button
		logoutButton.addEventListener("click", function() {
			firebase.auth().signOut().then(function() {
				// Sign-out successful.
				window.location.replace("../Recipe.html"); // Redirect to login page
			}).catch(function(error) {
				// An error happened.
				alert(error.message);
			});
		});
	
