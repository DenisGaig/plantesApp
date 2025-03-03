import { useState } from "react";
import { usePlantIdentification } from "../../../hooks/usePlantIdentification.js";

const CameraComponent = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Utiliser le hook pour l'identification de la plante
  const { identifyPlantImage, loading, error, results } =
    usePlantIdentification();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Créer une URL pour la prévisualisation de l'image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) return;

    // Appel à l'API PlantNet avec l'image sélectionnée
    // "results" est directement mis à jour par le hook donc plus besoin de le faire ici avec setResults
    await identifyPlantImage(selectedImage);
  };

  return (
    <div className="camera-component">
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="image-upload"
        />
        <label htmlFor="image-upload" className="upload-label">
          Sélectionnez une image
        </label>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Prévisualisation de l'image" />
            <button type="submit" className="submit-button">
              Identifier la plante
            </button>
          </div>
        )}
      </form>

      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}

      {results && (
        <div className="identification-results">
          <h2>Résultats de l'identification</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <h3>{result.species.commonNames?.[0]}</h3>
                <p>Score: {(result.score * 100).toFixed(2)}%</p>
                <p>Nom scientifique: {result.species.scientificName}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
