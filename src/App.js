// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import './App.css';

const Recipe = ({ id, name, description }) => (
  <div>
    <h3>{name}</h3>
    <p>{description}</p>
  </div>
);

const RecipeList = ({ recipes }) => (
  <ul>
    {recipes.map((recipe) => (
      <li key={recipe.id}>
        <NavLink to={`/recipes/${recipe.id}`} activeClassName="active">
          {recipe.name}
        </NavLink>
      </li>
    ))}
  </ul>
);

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

const RecipeApp = () => {
  const [recipes, setRecipes] = useState([]);
  const [recommendedRecipe, setRecommendedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setRecipes(data);

      if (data.length > 0) {
        setRecommendedRecipe(data[0]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    // Simulated search logic
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update the state with filtered recipes
    setRecipes(filteredRecipes);
  };

  return (
    <Router>
      <div>
        <h1>Recipe Application</h1>

        <nav>
          <ul>
            <li>
              <NavLink exact to="/" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/recipes" activeClassName="active">
                All Recipes
              </NavLink>
            </li>
          </ul>
          <SearchBar onSearch={handleSearch} />
        </nav>

        <hr />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Route
            path="/"
            exact
            render={() => (
              <div>
                <h2>Welcome to the Recipe App!</h2>
                {recommendedRecipe && (
                  <div>
                    <h3>Recommended Recipe</h3>
                    <Recipe {...recommendedRecipe} />
                  </div>
                )}
              </div>
            )}
          />
        )}

        <Route
          path="/recipes"
          exact
          render={() => <RecipeList recipes={recipes} />}
        />
        <Route
          path="/recipes/:id"
          render={({ match }) => {
            const recipe = recipes.find(
              (r) => r.id === parseInt(match.params.id, 10)
            );
            return recipe ? <Recipe {...recipe} /> : <div>Recipe not found</div>;
          }}
        />
      </div>
    </Router>
  );
};

export default RecipeApp;
