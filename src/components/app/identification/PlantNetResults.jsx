import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
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

  // Modal pour formulaire nouvelle plante absente base de donnée
  const [isModalOpen, setIsModalOpen] = useState(false);
  // État pour stocker les données de la plante temporaire
  const [tempPlantData, setTempPlantData] = useState(null);

  // Vérifie si des résultats sont disponibles
  if (!results || !Array.isArray(results) || results.length === 0) {
    return <p>Aucune plante d'identifiée</p>;
  }

  function FormModal({ plantData, onClose }) {
    console.log("Ouverture du formulaire en Modal", plantData);
    const form = useRef();
    const scientificName =
      plantData?.scientificName || "Nom scientifique non disponible";
    const commonName = plantData?.commonName || "Nom commun non disponible";
    const genus = plantData?.genus || "Genre non disponible";
    const family = plantData?.family || "Famille non disponible";

    const handleSubmit = async (e) => {
      e.preventDefault();
      // const formData = new FormData(e.target);

      // const templateParams = {
      //   scientific_name: formData.get("scientific_name"),
      //   common_name: formData.get("common_name"),
      //   genus: formData.get("genus"),
      //   family: formData.get("family"),
      //   // Optionnel : ajouter d'autres infos
      //   date: new Date().toLocaleDateString("fr-FR"),
      // };

      emailjs
        .sendForm(
          import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
          import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
          form.current,
          {
            publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY,
          }
        )
        .then(
          () => {
            console.log("SUCCESS!");
            alert("Demande envoyée avec succès !");
            onClose();
          },
          (error) => {
            console.log("FAILED...", error.text);
            alert("Erreur lors de l'envoi. Veuillez réessayer.");
          }
        );
    };

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>🌱 Nouvelle plante détectée !</h2>
          <p>
            Cette plante n'est pas encore référencée dans notre base de données.
          </p>
          <p>
            Elle ne pourra pas être incluse dans votre diagnostic actuel, mais
            vous pouvez nous aider à enrichir l'application en demandant son
            ajout.
          </p>
          <p>
            <strong>
              Votre contribution sera utile à toute la communauté !
            </strong>
          </p>
          <p>
            <em>
              Délai de traitement : 2 à 3 jours. Ajoutez votre email pour être
              notifié(e) de l'ajout.
            </em>
          </p>
          <form
            className="modal-content__form"
            ref={form}
            onSubmit={handleSubmit}
          >
            <label htmlFor="mail">Votre email (optionnel)</label>
            <input
              type="email"
              id="mail"
              name="mail"
              placeholder="Pour être notifié(e) de l'ajout"
            />

            <label htmlFor="scientific_name">Nom scientifique</label>
            <input
              type="text"
              id="scientific_name"
              name="scientific_name"
              defaultValue={scientificName}
            />

            <label htmlFor="common_name">Nom commun</label>
            <input
              type="text"
              id="common_name"
              name="common_name"
              defaultValue={commonName}
            />

            <label htmlFor="genus">Genre</label>
            <input type="text" id="genus" name="genus" defaultValue={genus} />

            <label htmlFor="family">Famille</label>
            <input
              type="text"
              id="family"
              name="family"
              defaultValue={family}
            />

            <div className="modal-content__form-buttons">
              <Button type="submit" variant="outline">
                Envoyer
              </Button>
              <Button variant="outline" onClick={onClose}>
                Annuler{" "}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const handleCloseFormModal = () => {
    setIsModalOpen(false);
    setTempPlantData(null);
  };

  const handlePlantSelection = (result) => {
    console.log("Plante sélectionnée: ", result);

    const processedResults = integrateIdentificationResults([result]);
    // Appeler la fonction de rappel pour sélectionner la plante
    // et passer les résultats intégrés
    console.log("PlantNetResults - Résultats intégrés: ", processedResults);

    const firstResult = Array.isArray(processedResults)
      ? processedResults[0]
      : processedResults;

    if (firstResult && firstResult.isTemporary) {
      console.log("Plante temporaire- Ouverture du formulaire");
      setTempPlantData(firstResult);
      setIsModalOpen(true);
      // return;
    }

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
      {isModalOpen && (
        <FormModal plantData={tempPlantData} onClose={handleCloseFormModal} />
      )}
    </div>
  );
};

export default PlantNetResults;
