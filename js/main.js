let recipes = [];
const recipeGrid = document.querySelector('.recipe-grid');

// RECUPERER DEPUIS L'API
async function fetchRecipes() {
    try {
        const response = await fetch('http://localhost:2000/recipes');
        recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.log('Erreur lors du chargement des recettes', error);
        recipeGrid.innerHTML = "<p>Erreur lors du chargement des recettes.</p>";
    }
}

// AFFICHER RECETTES
function displayRecipes(recipes) {
    recipeGrid.innerHTML = "";
    
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        let difficultyClass = '';
        switch(recipe.difficulty) {
            case 'facile':
                difficultyClass = 'difficulty-easy';
                break;
            case 'moyen':
                difficultyClass = 'difficulty-medium';
                break;
            case 'difficile':
                difficultyClass = 'difficulty-hard';
                break;
            default:
                difficultyClass = 'difficulty-easy';
        }
        
        const totalTime = recipe.prepTime + recipe.cookingTime;
        
        recipeCard.innerHTML = `
            <div class="recipe-image">
                ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}">` : 'Photo du plat'}
            </div>
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-foot">
                    <span class="recipe-time">Temps: ${totalTime} min</span>
                    <span class="recipe-difficulty ${difficultyClass}">● ${recipe.difficulty}</span>
                </div>
            </div>
        `;
        
        recipeCard.addEventListener('click', () => {
            window.location.href = `recipe.html?id=${recipe._id}`;
        });
        
        recipeGrid.appendChild(recipeCard);
    });

    // Carte "ajouter recette"
    const addCard = document.createElement('div');
    addCard.className = 'recipe-card add-recipe-card';
    addCard.innerHTML = `
        <div class="add-recipe-content">
            <div class="add-recipe-icon">+</div>
            <p class="add-recipe-text">Ajouter une recette</p>
        </div>
    `;
    addCard.addEventListener('click', () => openRecipeModal());
    recipeGrid.appendChild(addCard);
}

fetchRecipes();