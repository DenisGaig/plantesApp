import { useEffect, useState } from "react";
import plantsIndicators from "../data/bioindicators_plants.json";

const useSoilAnalysis = (selectedPlants, selectedCoefficients, allColumns) => {
  const [indicatorsDatabase, setIndicatorsDatabase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [sortedColumns, setSortedColumns] = useState(null);

  useEffect(() => {
    try {
      setIndicatorsDatabase(plantsIndicators);
      console.log("Hook - Bio-indicators plants bien chargés");
      setLoading(false);
      console.log("Hook - Loading set to false");
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  const generateAnalysisResults = () => {
    setLoading(true);
    console.log("Hook - Loading set to true");
    setTimeout(() => {
      try {
        setError(null);

        // Logique pour générer les résultats d'analyse
        console.log("Hook - Analyse du sol en cours...");

        const results = {};
        // Initialiser les résultats avec des objets pour stocker les valeurs positives et négatives
        allColumns.forEach((column) => {
          results[column] = { positive: 0, negative: 0, total: 0 };
        });

        selectedPlants.forEach((plant) => {
          const plantData = indicatorsDatabase.find(
            (p) => p.scientificName === plant.scientificName
          );

          // Récupérer la densité correspondante à partir de selectedCoefficients
          const density = selectedCoefficients[plant.id] || 0;
          console.log(
            "Hook - Densité de la plante",
            plant.scientificName,
            ":",
            density,
            "%"
          );

          if (plantData && plantData.caracteristiques) {
            Object.entries(plantData.caracteristiques).forEach(
              ([column, value]) => {
                if (!results[column]) {
                  results[column] = { positive: 0, negative: 0, total: 0 };
                }
                if (value === "+" || value === "+K") {
                  results[column].positive += density;
                } else if (value === "-") {
                  results[column].negative += density;
                }
                results[column].total =
                  results[column].positive + results[column].negative;
              }
            );
          }
        });

        setAnalysisResults(results);
        setShowResults(true);
        console.log("Hook - Analyse du sol terminée", results);

        // Calculer et définir sortedColumns immédiatement
        const sortedResultsColumns = allColumns
          .filter((column) => results[column].total > 0)
          .sort((a, b) => {
            const totalA = results[a].total;
            const totalB = results[b].total;
            return totalB - totalA;
          });

        setSortedColumns(sortedResultsColumns);
        console.log(
          "Hook - Colonnes triées (immédiatement après analyse):",
          sortedResultsColumns
        );
        return results; // Retourne les résultats pour les tests unitaires
      } catch (err) {
        setError("Erreur lors de l'analyse du sol");
        console.error("Hook - Erreur lors de l'analyse du sol:", err);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  // Fonction getSortedResults pour toute utilisation externe
  const getSortedResults = () => {
    if (!analysisResults) return [];

    return allColumns
      .filter((column) => analysisResults[column]?.total > 0)
      .sort((a, b) => {
        const totalA = analysisResults[a]?.total;
        const totalB = analysisResults[b]?.total;
        return totalB - totalA;
      });
  };

  const resetAnalysis = () => {
    setAnalysisResults(null);
    setShowResults(false);
    setSortedColumns([]);
    setLoading(false);
    setError(null);
    console.log("Hook - Analyse du sol réinitialisée");
  };

  return {
    loading,
    error,
    analysisResults,
    sortedColumns,
    showResults,
    generateAnalysisResults,
    resetAnalysis,
    getSortedResults,
  };
};
export default useSoilAnalysis;
