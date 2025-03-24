import { useState } from "react";
import CoverageEditor from "../../components/app/diagnostic/CoverageEditor.jsx";
import Recommendations from "../../components/app/diagnostic/Recommendations.jsx";
import SoilAnalyzer from "../../components/app/diagnostic/SoilAnalyzer.jsx";
import SoilQuery from "../../components/app/diagnostic/SoilQuery.jsx";
import SpeciesInventory from "../../components/app/diagnostic/SpeciesInventory.jsx";
import Button from "../../components/app/shared/Button.jsx";
import Stepper from "../../components/app/shared/Stepper.jsx";
import storageService from "../../services/storageService.js";

export default function Diagnostic() {
  // const { identifiedPlants } = usePlants();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [coverages, setCoverages] = useState(() => {
    const storedCoverages = storageService.getStoredData("coverages");
    return storedCoverages || {};
  });
  const [totalCoverage, setTotalCoverage] = useState(0);
  const [formData, setFormData] = useState(() => {
    const storedData = storageService.getStoredData("formData");
    return (
      storedData || {
        soil: {
          soilTexture: "",
          soilColor: "",
          soilDrainage: "",
          soilWorkability: "",
          soilOrganisms: "",
        },
        history: {
          soilHistory: "",
          soilWork: "",
          soilAmendement: "",
          soilPollution: "",
        },
      }
    );
  });

  // const steps = [
  //   { id: 1, label: "Inventaire", completed: identifiedPlants.length > 0 },
  //   { id: 2, label: "Couverture", completed: totalCoverage === 100 },
  //   {
  //     id: 3,
  //     label: "Paramètres",
  //     completed: Object.keys(soilParameters).length > 0,
  //   },
  //   { id: 4, label: "Analyse", completed: analysisResults !== null },
  //   { id: 5, label: "Résultats", completed: false },
  // ];
  const steps = [
    { id: 1, label: "Inventaire" },
    { id: 2, label: "Couverture" },
    { id: 3, label: "Paramètres" },
    { id: 4, label: "Analyse" },
    { id: 5, label: "Résultats" },
  ];

  const handlePlantSelection = (plants) => {
    setSelectedPlants(plants);
  };

  const handleCoverageChange = (coverageData, total) => {
    setCoverages(coverageData);
    setTotalCoverage(total);
    storageService.storeData("coverages", coverageData);
    // console.log("Total coverage: ", total);
    // console.log("Coverages: ", coverages);
  };

  // Gère les données de SoilQuery.jsx et les met à jour dans le state
  const handleFormDataUpdate = (section, data) => {
    if (formData[section] !== data) {
      const updateFormData = { ...formData, [section]: data };
      setFormData(updateFormData);
      // Sauvegarder les données dans le localStorage
      storageService.storeData("formData", updateFormData);
      console.log("Handle Form data: ", updateFormData);
    }
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <SpeciesInventory
            selectedPlants={selectedPlants}
            onSelectionChange={handlePlantSelection}
          />
        );
      case 1:
        return (
          <CoverageEditor
            selectedPlants={selectedPlants}
            initialCoverages={coverages}
            onCoverageChange={handleCoverageChange}
          />
        );
      case 2:
        return (
          <SoilQuery
            initialData={formData}
            onDataChange={(data) => {
              handleFormDataUpdate("soil", data.soil);
              handleFormDataUpdate("history", data.history);
            }}
          />
        );
      case 3:
        return (
          <SoilAnalyzer
            selectedPlants={selectedPlants}
            selectedCoverages={coverages}
            selectedFormData={formData}
          />
        );
      case 4:
        return <Recommendations />;
      default:
        return null;
    }
  };

  const handleDisableNext = () => {
    if (currentStep === 0) {
      // Si aucun plante n'est sélectionnée, désactiver le bouton "Suivant"
      return selectedPlants.length === 0;
    }
    if (currentStep === 1) {
      // Si la couverture totale n'est pas de 100%, désactiver le bouton "Suivant" en retournant "true"
      return totalCoverage !== 100;
    }
    return false;
  };

  return (
    <div className="diagnostic">
      {/* <h1>Diagnostic de sol</h1> */}
      <div className="diagnostic__stepper">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>
      <div className="diagnostic__content">{renderStepContent()}</div>

      <div className="diagnostic__footer">
        <div className="diagnostic__footer-actions">
          {/* <Button variant="small">Terminer</Button> */}
          <Button variant="small">Annuler</Button>
        </div>
        <div className="diagnostic__footer-progress">
          <Button
            variant="default"
            className="diagnostic__footer-button"
            onClick={() => handlePrev()}
            disabled={currentStep === 0}
          >
            Précédent
          </Button>
          <Button
            variant="default"
            className="diagnostic__footer-button"
            onClick={() => handleNext()}
            disabled={currentStep === steps.length - 1 || handleDisableNext()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
