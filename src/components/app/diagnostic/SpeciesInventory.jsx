import { LucideScan, LucideSearch } from "lucide-react";
import { useState } from "react";
import { usePlants } from "../../../context/PlantsProvider.jsx";
import Button from "../shared/Button.jsx";
import GlobalSearchBar from "../shared/GlobalSearchBar.jsx";
import PlantCard from "../shared/PlantCard.jsx";

const SpeciesInventory = () => {
  const { identifiedPlants } = usePlants();
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);
  console.log("Plantes identifiées", identifiedPlants);
  return (
    <div className="species-inventory">
      <div className="species-inventory__header">
        <h2>Etape 1: Inventaire des espèces</h2>
        <p className="species-inventory__header-info">
          Vous avez déjà identifié{" "}
          {identifiedPlants.length ? identifiedPlants.length : 0} espèces. Vous
          pouvez en ajouter de nouvelles en cliquant sur le bouton ci-dessous.
        </p>
      </div>
      {/* Modal pour ajouter une plante */}
      {!showAddPlantModal ? (
        <Button
          variant="default"
          className="species-inventory__identified-plants__button"
          onClick={() => setShowAddPlantModal(true)}
        >
          + Ajouter une plante
        </Button>
      ) : (
        <div className="species-inventory__search-bar">
          <Button
            variant="default"
            className="species-inventory__identified-plants__button"
            onClick={() => setShowAddPlantModal(false)}
          >
            Retour
          </Button>
          {/* Barre de recherche globale */}
          <GlobalSearchBar />
        </div>
      )}
      <div className="species-inventory__identified-plants">
        <div className="species-inventory__identified-plants__section-header">
          <h3>Plantes identifiées récemment</h3>
          {identifiedPlants.length > 0 && (
            <p>
              Cliquez sur le bouton "Retirer" des plantes qui ne sont pas
              représentatives de votre terrain
            </p>
          )}
        </div>

        {identifiedPlants.length > 0 ? (
          <div className="species-inventory__identified-plants__plants-grid">
            {identifiedPlants.map((plant) => (
              <div
                key={plant.id}
                className="species-inventory__identified-plants__plant-card"
              >
                <PlantCard plant={plant} viewMode="list" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="species-inventory__identified-plants__empty">
              Vous n'avez pas encore identifié de plantes.
            </p>
            <p className="species-inventory__identified-plants__empty">
              {" "}
              Utilisez la fonctionnalité d'identification {<LucideScan />} ou la
              recherche avancée {<LucideSearch />} pour commencer à identifier
              des plantes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeciesInventory;
