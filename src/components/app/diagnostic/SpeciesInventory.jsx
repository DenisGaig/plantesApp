import { CircleCheckBigIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePlants } from "../../../context/PlantsProvider.jsx";
import Button from "../shared/Button.jsx";
import ListCard from "../shared/ListCard.jsx";

const SpeciesInventory = ({ selectedPlants, onSelectionChange }) => {
  const { identifiedPlants } = usePlants();
  const [localSelectedPlants, setLocalSelectedPlants] = useState([]);
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);

  // Mets à jour la liste des plantes sélectionnées
  useEffect(() => {
    setLocalSelectedPlants(selectedPlants);
    console.log("Local selected plants updated: ", localSelectedPlants);
  }, [selectedPlants]);

  const handlePlantToggle = (plant) => {
    const isSelected = localSelectedPlants.some((p) => p.id === plant.id);
    if (isSelected) {
      // Si la plante est déjà sélectionnée, la désélectionner
      const updated = localSelectedPlants.filter((p) => p.id !== plant.id);
      setLocalSelectedPlants(updated);
      onSelectionChange(updated);
    } else {
      // Sinon, l'ajouter à la liste des plantes sélectionnées
      const updated = [...localSelectedPlants, plant];
      setLocalSelectedPlants(updated);
      onSelectionChange(updated);
    }
  };

  const handleRemovePlant = (plant) => {
    const updated = localSelectedPlants.filter((p) => p.id !== plant.id);
    setLocalSelectedPlants(updated);
    onSelectionChange(updated);
  };

  return (
    <div className="species-inventory">
      <div className="species-inventory__header">
        <h2>Etape 1: Inventaire des espèces</h2>
        <p className="species-inventory__header-info">
          Vous avez déjà identifié{" "}
          {identifiedPlants.length ? identifiedPlants.length : 0} espèces. Vous
          pouvez en ajouter de nouvelles en cliquant sur le bouton ci-dessous.
          Sélectionnez (en cliquant sur les cartes) les plantes présentes sur
          votre terrain pour ensuite ajuster la couverture de chaque espèce.
        </p>
      </div>
      <div className="species-inventory__identified-plants">
        <div className="species-inventory__identified-plants__section-header">
          <h3>Plantes identifiées récemment</h3>
          <Button
            variant="outline"
            className="species-inventory__identified-plants__button"
            onClick={() => setShowAddPlantModal(true)}
            // disabled={!identifiedPlants.length}
          >
            + Ajouter une plante
          </Button>
        </div>

        {identifiedPlants.length > 0 ? (
          <div className="species-inventory__identified-plants__plants-grid">
            {identifiedPlants.map((plant) => (
              <div
                key={plant.id}
                className={`species-inventory__identified-plants__plant-card ${
                  localSelectedPlants.some((p) => p.id === plant.id)
                    ? "species-inventory__identified-plants__plant-card--selected"
                    : ""
                }`}
                onClick={() => handlePlantToggle(plant)}
              >
                <ListCard plant={plant} />
                <div className="species-inventory__identified-plants__selection-indicator">
                  {/* Indicateur de sélection de la plante pour le diagnostic */}
                  {localSelectedPlants.some((p) => p.id === plant.id) ? (
                    <CircleCheckBigIcon className="species-inventory__identified-plants--check-icon" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="species-inventory__identified-plants-empty">
            Vous n'avez pas encore identifié de plantes. Utilisez la
            fonctionnalité d'identification ou ajoutez des plantes manuellement.
          </p>
        )}
      </div>

      <div className="species-inventory__selected-plants">
        <h3>Plantes sélectionnées pour le diagnostic</h3>
        {localSelectedPlants.length > 0 ? (
          <div className="species-inventory__selected-plants__plants-list">
            {localSelectedPlants.map((plant) => (
              <div
                key={plant.id}
                className="species-inventory__selected-plants__plant-card"
              >
                {/* <ListCard plant={plant} /> */}
                <p>{plant.commonName || plant.scientificName}</p>
                <button
                  className="species-inventory__selected-plants__remove-button"
                  onClick={() => handleRemovePlant(plant)}
                  aria-label="Retirer cette plante"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="species-inventory__selected-plants-empty">
            Vous n'avez pas encore sélectionné de plantes pour le diagnostic.
          </p>
        )}
      </div>
    </div>
  );
};

export default SpeciesInventory;
