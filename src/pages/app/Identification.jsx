import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CameraComponent from "../../components/app/identification/CameraComponent";
import PlanNetResults from "../../components/app/identification/PlantNetResults.jsx";
import { usePlants } from "../../context/PlantsProvider.jsx";

export default function Identification() {
  const [identificationResults, setIdentificationResults] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // const [selectedPlants, setSelectedPlants] = useState(null);
  const { addPlant } = usePlants();

  const handleResultsReceived = (results) => {
    console.log("Résultats reçus dans Identification:", results);
    setIdentificationResults(results);
  };

  const handleImagePreview = (imagePreviewURL) => {
    setImagePreview(imagePreviewURL);
    // Afficher l'URL de la prévisualisation de l'image dans la console
    console.log("Image Preview URL: ", imagePreviewURL);
  };
  console.log("RESULTATS D'IDENTIFICATION: ", identificationResults);

  const handlePlantSelected = (plant) => {
    console.log("Plante sélectionnée:", plant);
    // setSelectedPlants((prevSelectedPlants) => [...prevSelectedPlants, plant]);
    // Normaliser les données de la plante sélectionnée
    const normalizedPlant = {
      id: uuidv4(), // Génère un identifiant unique pour la plante
      score: plant.score,
      images: plant.images,
      name: plant.species.commonNames,
      scientificName: plant.species.scientificNameWithoutAuthor,
      genus: plant.species.genus.scientificNameWithoutAuthor,
      family: plant.species.family.scientificNameWithoutAuthor,
    };
    console.log("Plante sélectionnée normalisée:", normalizedPlant);

    addPlant(normalizedPlant);
  };

  return (
    <div className="identification">
      <h1>Identification de plantes</h1>

      {identificationResults ? (
        <PlanNetResults
          results={identificationResults}
          imagePreview={imagePreview}
          onPlantSelected={handlePlantSelected}
        />
      ) : (
        <>
          <p>
            Prenez une photo ou téléchargez une image pour identifier une
            plante.
          </p>
          <CameraComponent
            onResultsReceived={handleResultsReceived}
            onImagePreview={handleImagePreview}
          />
        </>
      )}
    </div>
  );
}
