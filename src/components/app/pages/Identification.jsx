import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { usePlants } from "../../../context/PlantsProvider.jsx";
import CameraComponent from "../identification/CameraComponent.jsx";
import PlanNetResults from "../identification/PlantNetResults.jsx";

export default function Identification() {
  const [identificationResults, setIdentificationResults] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { addIdentifiedPlant } = usePlants();

  const handleResultsReceived = (results) => {
    console.log("Résultats reçus dans Identification:", results);
    setIdentificationResults(results);
  };

  const handleImagePreview = (imagePreviewURL) => {
    setImagePreview(imagePreviewURL);
    // Afficher l'URL de la prévisualisation de l'image dans la console
    console.log("Image Preview URL: ", imagePreviewURL);
  };
  // console.log("RESULTATS D'IDENTIFICATION: ", identificationResults);

  const handlePlantSelected = (plant) => {
    console.log("Plante sélectionnée:", plant);

    let normalizedPlant;

    // Vérifier si c'est une plante temporaire (issue directement de PlantNet) ou une plante de votre base de données (qui a été matchée)
    if (plant.isTemporary !== undefined) {
      // C'est une plante traitée par integrateIdentificationResults
      if (plant.isTemporary) {
        // C'est une plante temporaire créée à partir des résultats PlantNet
        normalizedPlant = {
          id: uuidv4(),
          score: plant.confidence || 0,
          images: plant.imageUrl ? [{ url: plant.imageUrl }] : [],
          commonName: plant.commonName ? [plant.commonName] : [],
          scientificName: plant.scientificName,
          genus: plant.genus || "",
          family: plant.family || "",
        };
      } else {
        // C'est une plante de notre base de données
        normalizedPlant = {
          id: plant.id,
          score: plant.confidence || 0,
          images: plant.imageUrl ? [{ url: plant.imageUrl }] : [],
          commonName: plant.commonName ? [plant.commonName] : [],
          scientificName: plant.scientificName,
          genus: plant.genus || "",
          family: plant.family || "",
          primaryBiotope: plant.primaryBiotope || [],
          secondaryBiotope: plant.secondaryBiotope || [],
          indicatorTraits: plant.indicatorTraits || [],
          soilCondition: plant.soilCondition || 0,
          edible: plant.edible || "",
        };
      }
    } else {
      // C'est un résultat brut de PlantNet (non traité par integrateIdentificationResults)
      normalizedPlant = {
        id: uuidv4(),
        score: plant.score,
        images: plant.images,
        name: plant.species.commonNames,
        scientificName: plant.species.scientificNameWithoutAuthor,
        genus: plant.species.genus.scientificNameWithoutAuthor,
        family: plant.species.family.scientificNameWithoutAuthor,
      };
    }
    console.log("Plante sélectionnée normalisée:", normalizedPlant);

    addIdentifiedPlant(normalizedPlant);
  };

  const handleNewIdentification = () => {
    setIdentificationResults(null);
    setImagePreview(null);
  };

  return (
    <div className="identification">
      <h1>Identification de plantes</h1>

      {identificationResults ? (
        <PlanNetResults
          results={identificationResults}
          imagePreview={imagePreview}
          onPlantSelected={handlePlantSelected}
          onNewIdentification={handleNewIdentification}
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
