const inputField = document.getElementById("inputing");
const addButton = document.getElementById("button-addon2");
const ingredientList = document.createElement("ul");
const modalBody = document.querySelector(".ings");
modalBody.appendChild(ingredientList);

// Add event listener for adding ingredients
addButton.addEventListener("click", function () {
  const ingredient = inputField.value.trim();
  if (ingredient) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.textContent = ingredient;
    ingredientList.appendChild(listItem);
    inputField.value = "";
  } else {
    alert("Please enter an ingredient.");
  }
});

const saveButton = document.querySelector(".custom-btn1");
const recipeNameInput = document.getElementById("recipeNameInput");
const recipeImageInput = document.getElementById("recipeImageInput");
const recipeInstructions = document.getElementById("recipeInstructions");
const displaySection = document.getElementById("displaySection");
const errorAlert = document.getElementById("errorAlert");

let savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
let editingRecipeIndex = null; 

// Function to reset modal and form
function resetModal() {
  recipeNameInput.value = "";
  recipeImageInput.value = "";
  inputField.value = "";
  recipeInstructions.value = "";
  ingredientList.innerHTML = "";
  errorAlert.classList.add("d-none");
}

// Create and display recipe card
function createRecipeCard(recipe, index) {
  const cardColumn = document.createElement("div");
  cardColumn.className = "col-md-3 mb-3 mt-5";

  const card = document.createElement("div");
  card.className = "card";
  card.style.width = "18rem";

  const img = document.createElement("img");
  img.src = recipe.image;
  img.className = "card-img-top";
  img.alt = recipe.name;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.innerText = recipe.name;

  // Create edit button
  const editButton = document.createElement("button");
  editButton.className = "custom-btn3 me-2";
  editButton.innerText = "Edit";

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.className = "custom-btn4";
  deleteButton.innerText = "Delete";

  cardBody.appendChild(title);
  cardBody.appendChild(editButton);
  cardBody.appendChild(deleteButton);
  card.appendChild(img);
  card.appendChild(cardBody);
  cardColumn.appendChild(card);
  displaySection.appendChild(cardColumn);

  // Delete functionality
  deleteButton.addEventListener("click", function (event) {
    event.stopPropagation(); 
    cardColumn.remove();
    savedRecipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(savedRecipes));
  });

  // Edit functionality
  editButton.addEventListener("click", function (event) {
    event.stopPropagation();
    editingRecipeIndex = index; 
    recipeNameInput.value = recipe.name;
    recipeImageInput.value = "";
    inputField.value = "";
    ingredientList.innerHTML = "";

    recipe.ingredients.forEach(ingredient => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = ingredient;
      ingredientList.appendChild(listItem);
    });

    recipeInstructions.value = recipe.instructions;

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById("recipeModal"));
    modal.show();
  });

  // Add event listener to card to show recipe details
  card.addEventListener("click", function () {
    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalIngredients = document.getElementById("modalIngredients");
    const modalDescription = document.getElementById("modalDescription");

    modalImage.src = recipe.image;
    modalTitle.innerText = recipe.name;

    modalIngredients.innerHTML = "";
    recipe.ingredients.forEach(ingredient => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = ingredient;
      modalIngredients.appendChild(li);
    });

    modalDescription.innerText = recipe.instructions;

    const modalDetails = new bootstrap.Modal(document.getElementById("recipeDetailsModal"));
    modalDetails.show();
  });
}

// Load saved recipes from localStorage
window.addEventListener("load", function () {
  savedRecipes.forEach((recipe, index) => {
    createRecipeCard(recipe, index);
  });
});

// Save recipe on button click
saveButton.addEventListener("click", function () {
  const recipeName = recipeNameInput.value.trim();
  const recipeImage = recipeImageInput.files[0];
  const ingredients = [...ingredientList.querySelectorAll("li")].map(li => li.textContent);

  if (!recipeName || !recipeImage || ingredients.length === 0 || !recipeInstructions.value.trim()) {
    errorAlert.classList.remove("d-none");
    return;
  }

  const recipeData = {
    name: recipeName,
    ingredients: ingredients,
    instructions: recipeInstructions.value.trim(),
    image: URL.createObjectURL(recipeImage)
  };

  if (editingRecipeIndex !== null) {
    savedRecipes[editingRecipeIndex] = recipeData; 
    savedRecipes.push(recipeData); 
  }

  localStorage.setItem('recipes', JSON.stringify(savedRecipes));
  resetModal(); 

  // Close the modal after saving
  const modal = bootstrap.Modal.getInstance(document.getElementById("recipeModal"));
  if (modal) {
    modal.hide();
  }

  displaySection.innerHTML = "";
  savedRecipes.forEach((recipe, index) => {
    createRecipeCard(recipe, index); 
  });

  editingRecipeIndex = null;
});
