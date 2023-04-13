import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import "./App.css";
import SearchBar from "./SearchBar";

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const resetView = async () => {
    setSelectedPokemon(null);
    try {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=150"
      );
      setPokemonData(response.data.results);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  };

  const handleBackButtonClick = () => {
    setSelectedPokemon(null);
  };

  const handleTypeClick = async (type) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/type/${type}`
      );
      const { pokemon } = response.data;
      setPokemonData(pokemon.map((poke) => poke.pokemon));
      setSelectedPokemon(null); // Reset the selected Pokemon state
    } catch (error) {
      console.error("Error fetching Pokemon of the selected type:", error);
    }
  };

  useEffect(() => {
    const fetchPokemonData = async () => {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=150"
      );
      setPokemonData(response.data.results);
    };
    fetchPokemonData();
  }, []);

  const handleCardClick = async (name, url) => {
    // Extract the Pokemon ID from the URL
    const id = url.split("/")[url.split("/").length - 2];
    // Call handleSearch with the extracted ID
    handleSearch(id);
  };

  const handleSearch = async (id) => {
    if (id) {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );
      setPokemonData([
        {
          name: response.data.name,
          url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
        },
      ]);
    }
  };

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} />
      <div className="home-button-container">
        <button className="home-button" onClick={resetView}>
          Home
        </button>
      </div>

      <div
        className={`pokedex${
          pokemonData && pokemonData.length === 1 ? "-single" : ""
        }`}
      >
        {selectedPokemon ? (
          <div className="single-card-container">
            <PokemonCard
              key={selectedPokemon.name}
              name={selectedPokemon.name}
              url={selectedPokemon.url}
              singleView // Add this new prop
            />
            <button className="back-button" onClick={handleBackButtonClick}>
              Back to List
            </button>
          </div>
        ) : (
          pokemonData.map((pokemon, index) => (
            <PokemonCard
              key={index}
              name={pokemon.name}
              url={pokemon.url}
              onCardClick={handleCardClick}
              onTypeClick={handleTypeClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
