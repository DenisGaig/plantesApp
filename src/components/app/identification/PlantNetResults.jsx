import { usePlants } from "../../../context/PlantsProvider.jsx";
import Button from "../shared/Button.jsx";
import PlantNetCard from "./PlantNetCard.jsx";

const PlantNetResults = ({
  imagePreview,
  results,
  onPlantSelected,
  onNewIdentification,
}) => {
  // Récupère la fonction d'intégration des résultats d'identification depuis le contexte
  const { integrateIdentificationResults } = usePlants();

  if (!results || !Array.isArray(results) || results.length === 0) {
    return <p>Aucune plante d'identifiée</p>;
  }

  const handlePlantSelection = (result) => {
    console.log("Plante sélectionnée: ", result);

    const processedResults = integrateIdentificationResults([result]);
    // Appeler la fonction de rappel pour sélectionner la plante
    // et passer les résultats intégrés
    console.log("Résultats intégrés: ", processedResults);
    if (processedResults && processedResults.length > 0) {
      onPlantSelected(processedResults[0]);
    } else {
      // Si aucun résultat n'est trouvé, transmettre le résultat d'origine
      console.log("Résultat d'origine: ", result);
      onPlantSelected(result);
    }
  };

  const handleNewIdentification = () => {
    onNewIdentification();
    // Retour à une nouvelle identification
    console.log("Retour à l'identification");
  };

  return (
    <div className="plantNet-results">
      <div className="plantNet-results__header">
        <h3>Résultats de l'identification</h3>
        <Button variant="outline" onClick={handleNewIdentification}>
          Nouvelle identification
        </Button>
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
                onClick={() => handlePlantSelection(result)}
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
