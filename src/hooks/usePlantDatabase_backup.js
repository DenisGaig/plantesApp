import { useEffect, useState } from "react";
import plantesData from "../data/plantes.json";

export function usePlantDatabase() {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchLogic, setSearchLogic] = useState("AND");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setPlants(plantesData);
      console.log("Hook - Plantes bien chargées");
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Hook - APPLY FILTERS !", filters);
    applyFilters();
  }, [filters, plants, searchLogic]);

  useEffect(() => {
    console.log("FILTERED PLANTS OUTPUT : ", filteredPlants);
  }, [filteredPlants]);

  // Ajoutez une trace pour voir d'où vient l'appel - BUG
  useEffect(() => {
    console.log("FILTERS CHANGED TO:", JSON.stringify(filters));
    // Ajoutez une trace pour voir d'où vient l'appel
    console.trace("Filter change stacktrace");
  }, [filters]);

  // Récupérer une plante par son ID
  const getPlantById = (id) => {
    return plants.find((plant) => plant.id === id);
  };

  const applyFilters = () => {
    let result = [...plants];
    // console.log("RESULTS INPUT: ", result);
    const matchFilters = {
      name: (plant, value) =>
        plant["Nom commun"]?.toLowerCase().includes(value.toLowerCase()),

      latinName: (plant, value) =>
        plant["Nom Coste"]?.toLowerCase().includes(value.toLowerCase()),

      famille: (plant, value) =>
        plant["Famille"]?.toLowerCase().includes(value.toLowerCase()),

      primaryBiotope: (plant, value) =>
        (plant["Biotope primaire"] || []).some((biotope) =>
          biotope.toLowerCase().includes(value.toLowerCase())
        ),

      secondaryBiotope: (plant, value) =>
        (plant["Biotope secondaire"] || []).some((biotope) =>
          biotope.toLowerCase().includes(value.toLowerCase())
        ),

      isEdible: (plant, value) => {
        // Vérifier si la valeur est un booléen
        if (typeof value === "boolean") {
          return value
            ? plant["Comestible"] === "O"
            : plant["Comestible"] === "T" || plant["Comestible"] === "N";
        }
        // Si c'est déjà "O" ou "N"
        return plant["Comestible"] === value;
      },

      soilState: (plant, value) => plant["Etat du sol"] === value,

      nitrogenIndicator: (plant, value) => plant["Indicateur azote"] === value,

      moistureIndicator: (plant, value) =>
        plant["Indicateur humidité"] === value,

      pHIndicator: (plant, value) => plant["Indicateur pH"] === value,

      isMedicinal: (plant, value) => plant["Médicinale"] === value,

      indicatorStrength: (plant, value) => plant["Force indicateur"] === value,

      // Ajouter d'autres correspondances au besoin
      default: () => false,
    };

    // // Filtrer par biotope
    // if (filters.biotope) {
    //   result = result.filter((plant) => {
    //     const allBiotopes = [
    //       ...(plant["Biotope primaire"] || []),
    //       ...(plant["Biotope secondaire"] || []),
    //     ];
    //     return allBiotopes.some((biotope) =>
    //       biotope.toLowerCase().includes(filters.biotope.toLowerCase())
    //     );
    //   });
    // }

    // // Filtrer par famille
    // if (filters.famille) {
    //   result = result.filter((plant) => {
    //     // console.log("Plant famille : ", plant.Famille);
    //     return plant["Famille"]
    //       ?.toLowerCase()
    //       .includes(filters.famille.toLowerCase());
    //   });
    // }

    // // Filtrer par caractères indicateurs
    // if (filters.caracteresIndicateurs) {
    //   result = result.filter((plant) => {
    //     return plant["Caractères indicateurs"]?.some((caractere) =>
    //       caractere
    //         .toLowerCase()
    //         .includes(filters.caracteresIndicateurs.toLowerCase())
    //     );
    //   });
    // }

    // // Filtrer par état du sol
    // if (filters.etatDuSol) {
    //   result = result.filter((plant) => {
    //     return plant["Etat du sol"] === filters.etatDuSol;
    //   });
    // }
    // // Filtrer par comestibilité
    // if (filters.comestible) {
    //   result = result.filter((plant) => {
    //     return plant["Comestible"] === filters.comestible;
    //   });
    // }

    result = result.filter((plant) => {
      const filterEntries = Object.entries(filters);

      console.log("Hook - FILTERS : ", filters);
      console.log("Hook - FILTER ENTRIES : ", filterEntries);
      console.log("Hook - SEARCH LOGIC : ", searchLogic);

      if (searchLogic === "AND") {
        return filterEntries.every(([key, value]) => {
          const matchFilter = matchFilters[key] || matchFilters.default;
          return matchFilter(plant, value);
        });
      } else if (searchLogic === "OR") {
        return filterEntries.some(([key, value]) => {
          const matchFilter = matchFilters[key] || matchFilters.default;
          return matchFilter(plant, value);
        });
      }
      return true;
    });
    console.log("Hook - RESULT : ", result);
    setFilteredPlants(result);
    console.log("Hook - FILTERED PLANTS : ", filteredPlants);

    // setFilteredPlants((prevFilteredPlants) => {
    //   console.log("Hook - RESULT : ", result);
    //   return result; // Retourne le nouvel état basé sur l'état précédent
    // });
  };

  const updateFilters = (newFilters) => {
    console.log("Hook - Mise à jour des filtres : ", newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const searchPlants = async ({ filters: newFilters, logic }) => {
    setLoading(true);
    // Ajouter un log pour voir les nouveaux filtres
    console.log("Hook - SEARCHING WITH NEW FILTERS:", newFilters);
    // Mise à jour des filtres et de la logique de recherche
    setFilters(newFilters);
    if (logic) setSearchLogic(logic);

    // Attendre le prochain cycle de rendu pour appliquer les filtres et filteredPlants sera mis à jour
    return new Promise((resolve) => {
      setTimeout(() => {
        applyFilters();
        setLoading(false);
        resolve(filteredPlants);
        console.log("Hook - PROMISE RESOLVED ");
      }, 0);
    });
  };

  return {
    plants,
    loading,
    error,
    getPlantById,
    filteredPlants,
    updateFilters,
    searchPlants,
    setSearchLogic,
    searchLogic,
    filters,
  };
}
