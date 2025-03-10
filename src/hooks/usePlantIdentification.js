import { useState } from "react";
import { plantNetService } from "../services/plantNetService";

export function usePlantIdentification() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { identifyPlant } = plantNetService();

  const identifyPlantImage = async (selectedImage) => {
    setLoading(true);
    setError(null);

    // Appel à l'API PlantNet avec l'image sélectionnée
    try {
      const identificationResults = await identifyPlant(selectedImage);
      setResults(identificationResults.results);
      console.log(
        "Résultats de l'identification: ",
        identificationResults.results
      );
      return identificationResults.results;
    } catch (error) {
      setError(
        "Erreur lors de l'identification de la plante. Veuillez réessayer."
      );
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetIdentification = () => {
    setResults(null);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    identifyPlantImage,
    resetIdentification,
  };
}
