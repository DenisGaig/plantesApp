import { useEffect, useState } from "react";
import plantesData from "../data/plantes.json";

export function usePlantDatabase() {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [filters, setFilters] = useState({
    biotope: "",
    caracteresIndicateurs: "",
    famille: "",
    comestible: "",
    etatDuSol: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setPlants(plantesData);
      console.log("Plantes bien chargées");
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("APPLY FILTERS !");
    applyFilters();
  }, [filters, plants]);

  useEffect(() => {
    console.log("FILTERED PLANTS OUTPUT : ", filteredPlants);
  }, [filteredPlants]);

  // Récupérer une plante par son ID
  const getPlantById = (id) => {
    return plants.find((plant) => plant.id === id);
  };

  const applyFilters = () => {
    let result = [...plants];
    // console.log("RESULTS INPUT: ", result);

    // Filtrer par biotope
    if (filters.biotope) {
      result = result.filter((plant) => {
        const allBiotopes = [
          ...(plant["Biotope primaire"] || []),
          ...(plant["Biotope secondaire"] || []),
        ];
        return allBiotopes.some((biotope) =>
          biotope.toLowerCase().includes(filters.biotope.toLowerCase())
        );
      });
    }

    // Filtrer par famille
    if (filters.famille) {
      result = result.filter((plant) => {
        // console.log("Plant famille : ", plant.Famille);
        return plant["Famille"]
          ?.toLowerCase()
          .includes(filters.famille.toLowerCase());
      });
    }

    // Filtrer par caractères indicateurs
    if (filters.caracteresIndicateurs) {
      result = result.filter((plant) => {
        return plant["Caractères indicateurs"]?.some((caractere) =>
          caractere
            .toLowerCase()
            .includes(filters.caracteresIndicateurs.toLowerCase())
        );
      });
    }

    // Filtrer par état du sol
    if (filters.etatDuSol) {
      result = result.filter((plant) => {
        return plant["Etat du sol"] === filters.etatDuSol;
      });
    }
    // Filtrer par comestibilité
    if (filters.comestible) {
      result = result.filter((plant) => {
        return plant["Comestible"] === filters.comestible;
      });
    }

    setFilteredPlants(result);
  };

  const updateFilters = (newFilters) => {
    console.log("Mise à jour des filtres : ", newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    plants,
    loading,
    error,
    getPlantById,
    filteredPlants,
    updateFilters,
    filters,
  };
}
