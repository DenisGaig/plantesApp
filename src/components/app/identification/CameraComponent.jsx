import { useState } from "react";
import plantNetService from "../../../services/plantNetService";

const CameraComponent = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const { identifyPlant } = plantNetService();

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
    // Logique pour envoyer l'image à l'API PlantNet
    if (!selectedImage) return;
    setLoading(true);
    setError(null);

    // Appel à l'API PlantNet avec l'image sélectionnée
    try {
      const identificationResults = await identifyPlant(selectedImage);
      setResults(identificationResults.results);
      console.log("Résultats de l'identification: ", identificationResults);
    } catch (error) {
      setError(
        "Erreur lors de l'identification de la plante. Veuillez réessayer."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
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
                <h3>{result.species.commonNames[0]}</h3>
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
