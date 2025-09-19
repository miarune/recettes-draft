const recipeDetail = document.getElementById('recipe-detail');
let currentRecipe = null; // Variable globale pour stocker la recette

function getRecipeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function getRecipe(id) {
    try {
        const response = await fetch(`http://localhost:2000/recipes/${id}`);
        const recipe = await response.json();
        currentRecipe = recipe; // Stocker la recette dans la variable globale
        displayRecipe(recipe);
    } catch (error) {
        console.log(error);
        recipeDetail.innerHTML = `
            <div class="error-message">
                <h2>Erreur</h2>
                <p>Impossible de charger la recette. <a href="index.html">Retour à l'accueil</a></p>
            </div>
        `;
    }
}

function displayRecipe(recipe) {
    document.getElementById('recipe-title').textContent = recipe.title;
    document.getElementById('recipe-category').textContent = recipe.category;
    document.getElementById('recipe-description').textContent = recipe.description;
    document.getElementById('prep-time').textContent = `${recipe.prepTime} minutes`;
    document.getElementById('cooking-time').textContent = `${recipe.cookingTime} minutes`;
    document.getElementById('total-time').textContent = `${recipe.prepTime + recipe.cookingTime} minutes`;

    // Difficulté avec classe CSS
    const difficultyElement = document.getElementById('recipe-difficulty');
    let difficultyClass = recipe.difficulty === 'facile' ? 'difficulty-easy' :
        recipe.difficulty === 'moyen' ? 'difficulty-medium' : 'difficulty-hard';
    difficultyElement.className = `recipe-difficulty ${difficultyClass}`;
    difficultyElement.textContent = `● ${recipe.difficulty}`;

    // Ingrédients
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    // Instructions
    document.getElementById('instructions-content').innerHTML = recipe.instructions.replace(/\n/g, '<br>');

    // Afficher le template
    document.getElementById('recipe-template').classList.remove('hidden');

    // Event listeners pour les boutons
    document.querySelector('.delete-btn').addEventListener('click', () => {
        const recipeId = getRecipeIdFromUrl();
        deleteRecipe(recipeId);
    });

    document.querySelector('.edit-btn').addEventListener('click', () => {
        openRecipeModal(currentRecipe); // Utilise la variable globale
    });

    // Titre de la page
    document.title = `MiamCraft - ${recipe.title}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const recipeId = getRecipeIdFromUrl();
    getRecipe(recipeId);
});

async function deleteRecipe(recipeId) {
    const confirmation = confirm("Êtes-vous certain de vouloir supprimer cette recette ?");

    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:2000/recipes/${recipeId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Recette supprimée avec succès");
            window.location.href = 'index.html';
        } else {
            alert("Erreur lors de la suppression");
        }
    } catch (error) {
        console.log(error);
        alert("Une erreur est survenue");
    }
}