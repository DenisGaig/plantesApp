import { useContext, useEffect, useState } from "react";
import { usePlantDatabase } from "../hooks/usePlantDatabase.js";
// import { getStoredData, storeData } from "../services/storageService.js";
import storageService from "../services/storageService.js";
import { PlantsContext } from "./PlantsContext.jsx";

export function PlantsProvider({ children }) {
  const { plantsDatabase, loading, error } = usePlantDatabase();
  const [identifiedPlants, setIdentifiedPlants] = useState([]);

  // Récupérer les plantes du localStorage au chargement initial
  useEffect(() => {
    const loadIdentifiedPlants = async () => {
      const storedPlants = await storageService.getStoredData(
        "identifiedPlants"
      );
      if (storedPlants && storedPlants.length > 0) {
        setIdentifiedPlants(storedPlants);
      }
    };
    loadIdentifiedPlants();
  }, []);

  // Ajouter une plante identifiée
  const addIdentifiedPlant = (plant) => {
    // Vérifier si la plante existe déjà dans la liste
    const exits = identifiedPlants.some((p) => p.id === plant.id);
    if (!exits) {
      const updatedPlants = [...identifiedPlants, plant];
      setIdentifiedPlants(updatedPlants);
      storageService.storeData("identifiedPlants", updatedPlants);
    }
  };

  // Supprimer une plante identifiée
  const removeIdentifiedPlant = (plant) => {
    const updatedPlants = identifiedPlants.filter((p) => p.id !== plant.id);
    setIdentifiedPlants(updatedPlants);
    storageService.storeData("identifiedPlants", updatedPlants);
  };

  const isPlantIdentified = (plantId) => {
    return identifiedPlants.some((plant) => plant.id === plantId);
  };

  // Intégrer des résultats d'identification PlantNet
  const integrateIdentificationResults = (results) => {
    const newIdentifiedPlants = results.map((result) => {
      const existingPlant = plantsDatabase.find(
        (plant) =>
          plant.scientificName[0].toLowerCase() ===
          result.species.scientificNameWithoutAuthor.toLowerCase()
      );
      if (existingPlant) {
        console.log("Plante trouvée dans la base de données :", existingPlant);
        return {
          ...existingPlant,
          confidence: result.score,
          genus: result.species.genus?.scientificNameWithoutAuthor || "",
          imageUrl: result.images[0]?.url.s || existingPlant.imagePath,
          isTemporary: false, // Marquer comme non temporaire (dans la base de données)
        };
      }

      console.log(
        "Plante non trouvée dans la base de données, création d'une entrée temporaire :",
        result.species.scientificNameWithoutAuthor,
        "Nom commun :",
        result.species.commonNames[0] || "Nom commun inconnu",
        "Famille :",
        result.species.family.scientificNameWithoutAuthor,
        "Confiance :",
        result.score,
        "Image :",
        result.images[0]?.url.s || "Aucune image disponible"
      );
      // Si la plante n'existe pas dans la base de données, créer une nouvelle entrée temporaire
      return {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        scientificName: result.species.scientificNameWithoutAuthor,
        commonName: result.species.commonNames[0] || "Nom commun inconnu",
        family: result.species.family.scientificNameWithoutAuthor,
        genus: result.species.genus.scientificNameWithoutAuthor,
        confidence: result.score,
        imageUrl: result.images[0]?.url.s,
        isTemporary: true, // Marquer comme temporaire (non dans la base de données)
      };
    });

    // Ajouter uniquement les nouvelles plantes qui n'existent pas déjà
    const uniqueNewPlants = newIdentifiedPlants.filter(
      (newPlant) =>
        !identifiedPlants.some(
          (existingPlant) =>
            existingPlant.scientificName === newPlant.scientificName
        )
    );

    if (uniqueNewPlants.length > 0) {
      const updatedPlants = [...identifiedPlants, ...uniqueNewPlants];
      setIdentifiedPlants(updatedPlants);

      // Mettre à jour le stockage local avec les nouvelles plantes
      storageService.storeData("identifiedPlants", updatedPlants);
      console.log("Plantes ajoutées :", uniqueNewPlants);
    } else {
      console.log("Aucune nouvelle plante à ajouter.");
    }
    return newIdentifiedPlants;
  };

  return (
    <PlantsContext.Provider
      value={{
        identifiedPlants,
        addIdentifiedPlant,
        removeIdentifiedPlant,
        integrateIdentificationResults,
        isPlantIdentified,
      }}
    >
      {children}
    </PlantsContext.Provider>
  );
}

export const usePlants = () => useContext(PlantsContext);
