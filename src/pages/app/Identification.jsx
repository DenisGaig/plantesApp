import { useState } from "react";
import CameraComponent from "../../components/app/identification/CameraComponent";
import PlanNetResults from "../../components/app/identification/PlantNetResults.jsx";

export default function Identification() {
  const [identificationResults, setIdentificationResults] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
  return (
    <div className="identification">
      <h1>Identification de plantes</h1>

      {identificationResults ? (
        <PlanNetResults
          results={identificationResults}
          imagePreview={imagePreview}
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
