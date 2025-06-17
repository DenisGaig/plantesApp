import { useState } from "react";
import { normalizeString } from "../utils.ts";

const useGlobalSearch = (initialData = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // console.log("Initial Data:", initialData);

  // Fonction pour calculer la pertinence d'une correspondance
  const calculateRelevance = (plant, term) => {
    let score = 0;

    // Correspondance exacte du nom scientifique (priorité la plus élevée)
    if (plant.scientificName[0]?.toLowerCase().includes(term)) {
      score += 10;
      if (plant.scientificName[0]?.toLowerCase() === term) score += 5;
    }

    // Correspondance du nom commun (haute priorité)
    if (plant.commonName[0]?.toLowerCase().includes(term)) {
      score += 8;
      if (plant.commonName[0]?.toLowerCase() === term) score += 4;
    }

    // Correspondance de la famille (priorité moyenne)
    if (plant.family[0]?.toLowerCase().includes(term)) {
      score += 5;
    }

    // Correspondance des indicateurs (priorité moyenne à haute)
    // const matchingIndicators = plant.indicators.filter((ind) =>
    //   ind.toLowerCase().includes(term)
    // );
    // score += matchingIndicators.length * 6;

    // Correspondance des mots-clés (priorité moyenne à basse)
    // const matchingKeywords = plant.keywords.filter((kw) =>
    //   kw.toLowerCase().includes(term)
    // );
    // score += matchingKeywords.length * 3;

    // Correspondance de la description (priorité la plus basse)
    if (
      plant.description.generalDescription?.[0]?.toLowerCase().includes(term)
    ) {
      score += 2;
    }

    return score;
  };
  // Fonction pour effectuer la recherche sur tous les champs
  const performSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulation d'une recherche asynchrone
    setTimeout(() => {
      const normalizedTerm = term.toLowerCase().trim();

      // Filtrer et trier les résultats par pertinence
      const results = initialData
        .map((plant) => ({
          ...plant,
          relevance: calculateRelevance(plant, normalizedTerm),
        }))
        .filter((plant) => plant.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);

      setSearchResults(results);
      setIsSearching(false);
    }, 300); // Délai simulé pour l'effet de recherche
  };

  // Sélectionner une suggestion
  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    performSearch(suggestion);
    setShowSuggestions(false);

    // Ajouter aux recherches récentes
    if (!recentSearches.includes(suggestion)) {
      setRecentSearches((prev) => [suggestion, ...prev].slice(0, 5));
    }
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    // !!! A TRAITER CAR SEARCHINPUTREF EST DEFINIT DANS LE COMPOSANT
    // if (searchInputRef.current) {
    //   searchInputRef.current.focus();
    // }
  };

  // Extraire des suggestions pour l'autocomplétion
  const getSuggestions = () => {
    const suggestions = new Set();

    // Limiter à 5 suggestions
    if (searchTerm.trim().length > 1) {
      // Priorité aux noms scientifiques et communs
      initialData.forEach((plant) => {
        if (
          plant.scientificName[0]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          suggestions.add(plant.scientificName[0]);
        }

        plant.commonName.forEach((name) => {
          const normalizedName = normalizeString(name);
          const normalizedSearchTerm = normalizeString(searchTerm);
          if (
            normalizedName
              .toLowerCase()
              .includes(normalizedSearchTerm.toLowerCase())
          ) {
            suggestions.add(name);
          }
        });
      });

      // Ajouter des indicateurs si nous avons encore de la place
      if (suggestions.size < 5) {
        initialData.forEach((plant) => {
          console.log("family", plant.family);

          plant.family.forEach((name) => {
            const normalizedName = normalizeString(name);
            const normalizedSearchTerm = normalizeString(searchTerm);

            if (
              normalizedName
                .toLowerCase()
                .includes(normalizedSearchTerm.toLowerCase())
            ) {
              suggestions.add(name);
            }
          });

          // plant.primaryHabitat.forEach((indicator) => {
          //   const normalizedName = normalizeString(indicator);
          //   const normalizedSearchTerm = normalizeString(searchTerm);
          //   if (
          //     normalizedName
          //       .toLowerCase()
          //       .includes(normalizedSearchTerm.toLowerCase()) &&
          //     suggestions.size < 5
          //   ) {
          //     suggestions.add(indicator);
          //   }
          // });
        });
      }

      // // Ajouter des mots-clés si nous avons encore de la place
      // if (suggestions.size < 5) {
      //   initialData.forEach((plant) => {
      //     plant.keywords.forEach((keyword) => {
      //       if (
      //         keyword.toLowerCase().includes(searchTerm.toLowerCase()) &&
      //         suggestions.size < 5
      //       ) {
      //         suggestions.add(keyword);
      //       }
      //     });
      //   });
      // }
    }

    return Array.from(suggestions);
  };

  // Mise en évidence du texte correspondant
  const highlightText = (text, term) => {
    console.log("highlightText text, term: ", text, term);
    // if (text === undefined || text === null) return "";

    // Vérifie si le texte est un tableau
    if (Array.isArray(text)) {
      // Traite chaque élément du tableau
      return text.map((item) => highlightText(item, term)).join(", ");
    }

    // Vérifie si le texte est undefined, null, ou non une chaîne
    if (typeof text !== "string") {
      console.warn("Text is not a string:", text);
      return String(text); // Convertit en chaîne ou retourne une valeur par défaut
    }

    if (!term.trim()) return text;

    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(regex, "<mark>$1</mark>");
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    isSearching,
    showSuggestions,
    setShowSuggestions,
    recentSearches,
    setRecentSearches,
    getSuggestions,
    setSuggestions,
    performSearch,
    handleSelectSuggestion,
    clearSearch,
    highlightText,
  };
};
export default useGlobalSearch;
