import Button from "../shared/Button.jsx";

const PlantNetResults = ({ imagePreview, results }) => {
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

          // Accédez de manière sécurisée aux propriétés pour éviter les erreurs
          const score = result.score ? (result.score * 100).toFixed(2) : "N/A";
          const species = result.species || {};
          const scientificName =
            species.scientificNameWithoutAuthor ||
            "Nom scientifique non disponible";
          const commonName =
            species.commonNames?.[0] || "Nom commun non disponible";
          const genus =
            species.genus?.scientificNameWithoutAuthor ||
            "Genre non disponible";
          const family =
            species.family?.scientificNameWithoutAuthor ||
            "Famille non disponible";

          // Vérifiez si images existe et est un tableau avant d'essayer d'itérer dessus
          const hasImages =
            result.images &&
            Array.isArray(result.images) &&
            result.images.length > 0;

          return (
            <li key={index}>
              <div className="plantNet-results__header">
                <p className="plantNet-results__header-score">{score}%</p>
                <h4>{scientificName}</h4>
                <div className="planNet-results__header-name">
                  <h5>NOM COMMUN</h5>
                  <p>{commonName}</p>
                </div>
                <div className="planNet-results__header-genus">
                  <h5>GENRE</h5>
                  <p>{genus}</p>
                </div>
                <div className="planNet-results__header-family">
                  <h5>FAMILLE</h5>
                  <p>{family}</p>
                </div>
              </div>
              <div className="plantNet-results__body">
                {hasImages &&
                  result.images.map((image, index) => {
                    // Vérifiez si l'image et son URL existent
                    if (!image || !image.url || !image.url.m) return null;
                    return (
                      <img
                        className="plantNet-results__body-image"
                        key={index}
                        src={image.url.m}
                        alt={`Image ${index + 1} of ${
                          result.species.commonNames?.[0]
                        }`}
                      />
                    );
                  })}
              </div>
              <button className="plantNet-results__button">
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
