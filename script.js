document.getElementById("recipe-search-results").style.display = "none";

// Initialize Firebase
const firebaseConfig = {
    // your firebase config
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
  
// Get a reference to the login button
const loginBtn = document.getElementById('login-btn');
const iconImg = document.querySelector('.licon-img');
// Check if user is logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User is logged in');
      // User is logged in, change icon image
      iconImg.setAttribute('src', 'icons/user.png');
      iconImg.style.width = '50px';
      iconImg.style.height = '50px';
    } else {
      // User is not logged in, keep default icon image
      console.log('User is not logged in');
      iconImg.setAttribute('src', 'icons/icons8-customer-50.png');
    }
  });

// Add an event listener to the login button
loginBtn.addEventListener('click', () => {
  // If the user is not logged in, redirect to the login page
  if (!firebase.auth().currentUser) {
    window.location.href = 'Login/login.html';
  } else {
    // If the user is logged in, redirect to the user page
    window.location.href = 'User/user.html';
  }
});


  
function scrolll(){
    var left = document.querySelector(".scroll-images");
    left.scrollBy(-350,0)
}
function scrollr(){
    var right = document.querySelector(".scroll-images");
    right.scrollBy(350,0)
}

function searchRecipes() {
  document.getElementById("recipe-search-results").style.display = "none";
  const searchQuery = document.getElementById('search-btn').value;
  const recipeSearchResults = document.getElementById('recipe-search-results');
  // Replace <YOUR_API_KEY> with your Spoonacular API key
  const apiUrl = `https://api.spoonacular.com/recipes/search?apiKey=35426c9fe86d48c7a5474455805305f0&query=${searchQuery}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const recipes = data.results;
      // Display search results to the user
      // ...
      let html = '';
        if (recipes.length === 0) {
          html = '<p>No results found.</p>';
        } else {
          html = '<ul>';
          recipes.forEach(recipe => {
            const recipeUrl = `https://spoonacular.com/recipes/${recipe.title.replace(/[^a-zA-Z0-9]/g, '-')}-${recipe.id}`;
          html += `<li><a href="${recipeUrl}" target="_blank">${recipe.title}</a></li>`;
        });
          html += '</ul>';
        }
        recipeSearchResults.innerHTML = html;
        document.getElementById("recipe-search-results").style.display = "block";
    })
    .catch(error => console.error(error));
}

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  searchRecipes();
});

const sharedRecipesRef = firebase.firestore().collection('sharedRecipes');
const recipeImagesContainer = document.getElementById('recipe-images-container');

// Fetch shared recipes from Firestore
sharedRecipesRef.get().then((querySnapshot) => {
  // Loop through each shared recipe
  querySnapshot.forEach((doc) => {
    const recipeData = doc.data();
    // Create a new image element
    const recipeImage = document.createElement('img');
    recipeImage.className = 'child-img';
    recipeImage.src = recipeData.image;
    recipeImage.setAttribute('data-recipe-id', doc.id); // Add data-attribute with recipe ID
    // Add click event listener to the image
    recipeImage.addEventListener('click', function() {
      // Open pop-up window and display recipe details
      const popup = document.createElement('div');
      popup.className = 'popup-container';
      const ingredientsList = recipeData.ingredients.split(',').map(ingredient => `<li>${ingredient}</li>`).join('');
      const instructionsList = recipeData.instruction.split('.').map(instruction => `<li>${instruction.trim()}</li>`).join('');
      popup.innerHTML = `
      <div class="popup-content">
        <h2>${recipeData.name}</h2>
        <p>Ingredients: ${ingredientsList}</p>
        <p>Instructions: ${instructionsList}</p>
        <h3>Comments</h3>
        <div class="comments-container">
          <form id="comment-form">
            <input type="text" id="comment-input" placeholder="Add a comment...">
            <button type="submit" class="submit-button">Submit</button>
          </form>
          <p id="comments-list"></p>
        </div>
        <button class="popup-close-btn">Close</button>
        </div>
      `;
      document.body.appendChild(popup);
      // Add click event listener to the close button
      const closeButton = popup.querySelector('.popup-close-btn');
      closeButton.addEventListener('click', function() {
        document.body.removeChild(popup); // Remove pop-up window from the DOM
      });

      // Add submit event listener to the comment form
      const commentForm = popup.querySelector('#comment-form');
      commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
          // Check if user is signed in
          if (!firebase.auth().currentUser) {
            alert('You need to sign in to leave a comment.');
            return;
          }
        const commentInput = commentForm.querySelector('#comment-input');
        const commentText = commentInput.value.trim();

          // Check if the comment text is empty
        if (!commentText) {
          alert('Please enter a comment.');
          return;
        }

        if (commentText !== '') {
          const commentData = {
            user: firebase.auth().currentUser.displayName,
            text: commentText,
            timestamp: firebase.firestore.Timestamp.now()
          }
          const recipeId = recipeImage.getAttribute('data-recipe-id');
          const recipeRef = sharedRecipesRef.doc(recipeId);
          recipeRef.collection('comments').add(commentData)
            .then(() => {
              commentInput.value = '';
              window.location.href='Recipe.html';
            })
            .catch((error) => {
              console.error('Error adding comment:', error);
            });
        } 
      });
      
      // Display comments for the recipe
      const commentsList = popup.querySelector('#comments-list');
      const recipeId = recipeImage.getAttribute('data-recipe-id');
      const recipeRef = sharedRecipesRef.doc(recipeId);
      recipeRef.collection('comments').orderBy('timestamp', 'asc').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const commentData = doc.data();
            const commentItem = document.createElement('p');
            commentItem.innerHTML = `<p class= "comments">${commentData.user}:${commentData.text}</p>`;
            commentsList.appendChild(commentItem);
          });
        }).catch((error) => {
          console.error('Error fetching comments:', error);
        });
    });
    // Add the image to the container
    recipeImagesContainer.appendChild(recipeImage);
  });
}).catch((error) => {
  console.error('Error fetching shared recipes:', error);
});







