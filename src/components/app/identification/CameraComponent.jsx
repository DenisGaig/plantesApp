import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { usePlantIdentification } from "../../../hooks/usePlantIdentification.js";
import Spinner from "../shared/Spinner.jsx";

// const CameraComponent = () => {
const CameraComponent = ({ onResultsReceived, onImagePreview }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Utiliser le hook pour l'identification de la plante - results enlevé car il est passé en paramètre de la fonction onResultsReceived
  const { identifyPlantImage, loading, error } = usePlantIdentification();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Créer une URL pour la prévisualisation de l'image
      const imagePreviewURL = URL.createObjectURL(file);
      setImagePreview(imagePreviewURL);

      if (onImagePreview) {
        onImagePreview(imagePreviewURL);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) return;

    // Appel à l'API PlantNet avec l'image sélectionnée
    // "results" est directement mis à jour par le hook donc plus besoin de le faire ici avec setResults
    // await identifyPlantImage(selectedImage);

    // Si onResultsReceived est fourni, appeler cette fonction avec les résultats
    const results = await identifyPlantImage(selectedImage);
    if (results && onResultsReceived) {
      console.log("Résultats reçus dans CameraComponent:", results);
      onResultsReceived(results);
    }
  };

  return (
    <div className="camera-component">
      <form className="camera-component__upload-input" onSubmit={handleSubmit}>
        {!imagePreview && (
          <>
            <span className="camera-component__upload-icon">
              <ImagePlus />
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="camera-component__upload-label"
            >
              Sélectionnez une image
            </label>
          </>
        )}

        {imagePreview && (
          <div className="camera-component__image-preview">
            <img src={imagePreview} alt="Prévisualisation de l'image" />
            <button type="submit" className="camera-component__submit-button">
              Identifier la plante
            </button>
          </div>
        )}
      </form>

      {loading && (
        <div className="camera-component__spinner">
          <Spinner />
        </div>
      )}
      {error && <p>Erreur: {error}</p>}
    </div>
  );
};

export default CameraComponent;
