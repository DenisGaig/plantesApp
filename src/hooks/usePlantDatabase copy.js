import { useEffect, useState } from "react";
import plantesData from "../data/plantes.json";
import { normalizeString } from "../utils.ts";

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

  const applyFilters = (
    specificFilters = filters,
    specificLogic = searchLogic
  ) => {
    let result = [...plants];
    // console.log("RESULTS INPUT: ", result);
    const matchFilters = {
      name: (plant, value) =>
        plant["commonName"]?.toLowerCase().includes(value.toLowerCase()),

      latinName: (plant, value) =>
        plant["scientificName"]?.toLowerCase().includes(value.toLowerCase()),

      famille: (plant, value) =>
        plant["family"]?.toLowerCase().includes(value.toLowerCase()),

      primaryBiotope: (plant, value) => {
        const normalizedValue = normalizeString(value);
        const keywords = normalizedValue.split(" ");

        // console.log("🔍 Valeur filtrée normalisée:", normalizedValue);
        // console.log("🔍 Mots-clés recherchés:", keywords);

        return (plant["primaryBiotope"] || []).some((biotope) => {
          const normalizedBiotope = normalizeString(biotope);
          // console.log("🌳 Biotope analysé normalisé:", normalizedBiotope);
          // Vérifie si l'ensemble de la phrase est une sous-chaîne complète
          if (normalizedBiotope.includes(normalizedValue)) {
            // console.log("✅ Correspondance directe trouvée !");
            return true;
          }
          // Vérifie si au moins UN des mots-clés est présent quelque part
          return keywords.every((keyword) =>
            normalizedBiotope.includes(keyword)
          );
        });
      },

      secondaryBiotope: (plant, value) => {
        const normalizedValue = normalizeString(value);
        const keywords = normalizedValue.split(" ");

        // console.log("🔍 Valeur filtrée normalisée:", normalizedValue);
        // console.log("🔍 Mots-clés recherchés:", keywords);

        return (plant["secondaryBiotope"] || []).some((biotope) => {
          const normalizedBiotope = normalizeString(biotope);
          // console.log("🌳 Biotope analysé normalisé:", normalizedBiotope);
          // Vérifie si l'ensemble de la phrase est une sous-chaîne complète
          if (normalizedBiotope.includes(normalizedValue)) {
            // console.log("✅ Correspondance directe trouvée !");
            return true;
          }
          // Vérifie si au moins UN des mots-clés est présent quelque part
          return keywords.every((keyword) =>
            normalizedBiotope.includes(keyword)
          );
        });
      },
      // secondaryBiotope: (plant, value) =>
      //   (plant["secondaryBiotope"] || []).some((biotope) =>
      //     biotope.toLowerCase().includes(value.toLowerCase())
      //   ),

      isEdible: (plant, value) => {
        // Si la valeur est vide ou undefined, ne pas filtrer sur ce critère
        if (value === "" || value === undefined || value === null) {
          return true; // Accepter toutes les plantes indépendamment de leur comestibilité
        }

        // Si la valeur est un booléen true, filtrer seulement les plantes comestibles
        if (value === true) {
          return plant["edible"] === "O";
        }

        // Si la valeur est un booléen false, ne pas filtrer sur ce critère
        // (Accepter toutes les plantes indépendamment de leur comestibilité)
        return true;
      },

      soilState: (plant, value) => plant["soilCondition"] === value,

      nitrogenIndicator: (plant, value) => plant["Indicateur azote"] === value,

      moistureIndicator: (plant, value) =>
        plant["Indicateur humidité"] === value,

      pHIndicator: (plant, value) => plant["Indicateur pH"] === value,

      isMedicinal: (plant, value) => plant["Médicinale"] === value,

      indicatorStrength: (plant, value) => plant["Force indicateur"] === value,

      // Ajouter d'autres correspondances au besoin
      default: () => false,
    };

    const filterEntries = Object.entries(specificFilters);
    console.log("Hook - FILTERS : ", filters);
    console.log("Hook - FILTER ENTRIES : ", filterEntries);
    console.log("Hook - SEARCH LOGIC : ", searchLogic);

    if (filterEntries.length > 0) {
      result = result.filter((plant) => {
        if (specificLogic === "AND") {
          return filterEntries.every(([key, value]) => {
            const matchFilter = matchFilters[key] || matchFilters.default;
            return matchFilter(plant, value);
          });
        } else if (specificLogic === "OR") {
          return filterEntries.some(([key, value]) => {
            const matchFilter = matchFilters[key] || matchFilters.default;
            return matchFilter(plant, value);
          });
        }
        return true;
      });
    }

    return result;
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
    console.log("Avant setFilters", filters);
    setFilters(newFilters);
    console.log("Après setFilters", filters);
    if (logic) setSearchLogic(logic);

    // Attendre le prochain cycle de rendu pour appliquer les filtres et filteredPlants sera mis à jour
    return new Promise((resolve) => {
      setTimeout(() => {
        // Utiliser applyFilters directement avec les paramètres fournis
        const result = applyFilters(newFilters, logic || searchLogic);

        // Mettre à jour l'état filteredPlants pour cohérence
        setFilteredPlants(result);
        setLoading(false);
        console.log(
          "RÉSULTATS DE RECHERCHE:",
          result.length,
          "plantes trouvées"
        );
        resolve(result);
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
