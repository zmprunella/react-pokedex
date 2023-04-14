import React, { useState, useEffect } from "react";
import axios from "axios";

const PokemonCard = ({
  name,
  url,
  onCardClick,
  onTypeClick,
  singleView,
  stats,
  sprite,
}) => {
  const [pokemonInfo, setPokemonInfo] = useState({});

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      try {
        const response = await axios.get(url);
        setPokemonInfo(response.data);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        setPokemonInfo(null);
      }
    };
    fetchPokemonInfo();
  }, [url]);

  if (!pokemonInfo) {
    return <div className="pokemon-card">Pokemon not found</div>;
  }
  const getTypeColor = (type) => {
    const colors = {
      rock: "#B69E31",
      water: "#6390F0",
      grass: "#46c000",
      fire: "#ff0000",
      electric: "#ede61e",
      psychic: "#F85888",
      ice: "#98D8D8",
      dragon: "#7038F8",
      dark: "#705848",
      fairy: "#EE99AC",
      normal: "#A8A878",
      bug: "#A8B820",
      ghost: "#705898",
      steel: "#B8B8D0",
      flying: "#A890F0",
      ground: "#E0C068",
      poison: "#A040A0",
      fighting: "#C03028",
    };

    return colors[type] || "#3f51b5";
  };

  return (
    <div
      className="pokemon-card"
      onClick={() => {
        if (!singleView && typeof onCardClick === "function") {
          onCardClick(name, url);
        }
      }}
    >
      <h2>{name.toUpperCase()}</h2>
      <img
        src={singleView ? sprite : pokemonInfo.sprites?.front_default}
        alt={name}
      />
      {pokemonInfo && pokemonInfo.types ? (
        <div className="pokemon-types">
          {pokemonInfo.types.map((typeObj, index) => (
            <span
              key={index}
              className="pokemon-type"
              style={{ backgroundColor: getTypeColor(typeObj.type.name) }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card's onClick event
                if (!singleView && typeof onTypeClick === "function") {
                  onTypeClick(typeObj.type.name);
                }
              }}
            >
              {typeObj.type.name}
            </span>
          ))}
        </div>
      ) : null}
      {singleView && stats ? (
        <div className="pokemon-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat">
              <span className="stat-name">{stat.stat.name}:</span>{" "}
              {stat.base_stat}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PokemonCard;
