const API_URL = "https://dummyjson.com/recipes";

// Mengambil elemen HTML
const searchInput = document.getElementById("search-input");
const mealFilter = document.getElementById("meal-filter");
const favOnly = document.getElementById("fav-only");
const recipeList = document.getElementById("recipe-list");
const statusText = document.getElementById("status");
const detailDialog = document.getElementById("detail-dialog");
const detailContent = document.getElementById("detail-content");
const closeBtn = document.getElementById("close-btn");

// Menyimpan semua data recipe
let recipes = [];

// Mengambil favorite dari LocalStorage
let favorites =
  JSON.parse(localStorage.getItem("recipeFavorites")) || [];

// Menjalankan aplikasi
getRecipes();


// ==================================
// FETCH DATA DARI API
// ==================================

async function getRecipes() {

  try {

    statusText.textContent = "Loading recipes...";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Gagal mengambil data recipe");
    }

    const data = await response.json();

    recipes = data.recipes;

    createMealFilter();

    showRecipes(recipes);

    statusText.textContent =
      `Menampilkan ${recipes.length} recipe`;

  } catch (error) {

    statusText.textContent =
      "Terjadi kesalahan saat mengambil data.";

    console.error(error);
  }
}


// ==================================
// MENAMPILKAN RECIPE
// ==================================

function showRecipes(recipeData) {

  recipeList.innerHTML = "";

  if (recipeData.length === 0) {

    recipeList.innerHTML =
      "<p>Recipe tidak ditemukan.</p>";

    return;
  }

  recipeData.forEach(function(recipe) {

    const isFavorite =
      favorites.includes(recipe.id);

    const card =
      document.createElement("article");

    card.className = "card";

    card.innerHTML = `

      <img
        src="${recipe.image}"
        alt="${recipe.name}"
      >

      <div class="card-body">

        <h3>${recipe.name}</h3>

        <p>
          ${recipe.cuisine} • ${recipe.difficulty}
        </p>

        <div class="card-buttons">

          <button
            class="detail-btn"
            onclick="showDetail(${recipe.id})"
          >
            Lihat Detail
          </button>

          <button
            class="favorite-btn ${isFavorite ? "active" : ""}"
            onclick="toggleFavorite(${recipe.id})"
          >
            ${isFavorite ? "❤️ Favorit" : "♡ Favorit"}
          </button>

        </div>

      </div>
    `;

    recipeList.appendChild(card);
  });
}


// ==================================
// MEMBUAT FILTER MEAL TYPE
// ==================================

function createMealFilter() {

  const mealTypes = [];

  recipes.forEach(function(recipe) {

    recipe.mealType.forEach(function(type) {

      if (!mealTypes.includes(type)) {
        mealTypes.push(type);
      }

    });

  });

  mealTypes.sort();

  mealTypes.forEach(function(type) {

    const option =
      document.createElement("option");

    option.value = type;
    option.textContent = type;

    mealFilter.appendChild(option);
  });
}


// ==================================
// SEARCH DAN FILTER
// ==================================

function filterRecipes() {

  const searchText =
    searchInput.value.toLowerCase();

  const selectedMeal =
    mealFilter.value;

  let filteredRecipes =
    recipes.filter(function(recipe) {

      const matchSearch =
        recipe.name
          .toLowerCase()
          .includes(searchText);

      const matchMeal =
        selectedMeal === "all" ||
        recipe.mealType.includes(selectedMeal);

      const matchFavorite =
        !favOnly.checked ||
        favorites.includes(recipe.id);

      return (
        matchSearch &&
        matchMeal &&
        matchFavorite
      );

    });

  showRecipes(filteredRecipes);

  statusText.textContent =
    `Menampilkan ${filteredRecipes.length} recipe`;
}


// ==================================
// DETAIL RECIPE
// ==================================

function showDetail(id) {

  const recipe =
    recipes.find(function(item) {

      return item.id === id;

    });

  if (!recipe) {
    return;
  }

  let ingredientsHTML = "";

  recipe.ingredients.forEach(function(ingredient) {

    ingredientsHTML +=
      `<li>${ingredient}</li>`;

  });


  let instructionsHTML = "";

  recipe.instructions.forEach(function(instruction) {

    instructionsHTML +=
      `<li>${instruction}</li>`;

  });


  detailContent.innerHTML = `

    <img
      class="detail-image"
      src="${recipe.image}"
      alt="${recipe.name}"
    >

    <h2>${recipe.name}</h2>

    <p>
      <strong>Cuisine:</strong>
      ${recipe.cuisine}
    </p>

    <p>
      <strong>Difficulty:</strong>
      ${recipe.difficulty}
    </p>

    <p>
      <strong>Rating:</strong>
      ${recipe.rating}
    </p>

    <p>
      <strong>Waktu:</strong>
      ${recipe.prepTimeMinutes +
      recipe.cookTimeMinutes}
      menit
    </p>

    <h3>Bahan-bahan</h3>

    <ul class="detail-list">
      ${ingredientsHTML}
    </ul>

    <h3>Cara membuat</h3>

    <ol class="detail-list">
      ${instructionsHTML}
    </ol>

  `;

  detailDialog.showModal();
}


// ==================================
// FAVORITE + LOCALSTORAGE
// ==================================

function toggleFavorite(id) {

  if (favorites.includes(id)) {

    favorites =
      favorites.filter(function(favoriteId) {

        return favoriteId !== id;

      });

  } else {

    favorites.push(id);

  }

  localStorage.setItem(
    "recipeFavorites",
    JSON.stringify(favorites)
  );

  filterRecipes();
}


// ==================================
// EVENT
// ==================================

searchInput.addEventListener(
  "input",
  filterRecipes
);

mealFilter.addEventListener(
  "change",
  filterRecipes
);

favOnly.addEventListener(
  "change",
  filterRecipes
);

closeBtn.addEventListener(
  "click",
  function() {

    detailDialog.close();

  }
);