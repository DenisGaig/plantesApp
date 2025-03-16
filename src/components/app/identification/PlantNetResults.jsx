import Button from "../shared/Button.jsx";
import PlantNetCard from "./PlantNetCard.jsx";

const PlantNetResults = ({ imagePreview, results, onPlantSelected }) => {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return <p>Aucune plante d'identifiée</p>;
  }
  return (
    <div className="plantNet-results">
      <div className="plantNet-results__header">
        <h3>Résultats de l'identification</h3>
        <Button variant="outline">Nouvelle identification</Button>
      </div>

      {imagePreview && (
        <div className="plantNet-results__image-preview">
          <img src={imagePreview} alt="Prévisualisation de l'image" />
        </div>
      )}

      <ul>
        {results.map((result, index) => {
          if (!result) return null;
          return (
            <li key={index}>
              <PlantNetCard result={result} index={index} />

              <button
                className="plantNet-results__button"
                onClick={() => onPlantSelected(result)}
              >
                🌱 Ajouter à ma liste
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlantNetResults;
