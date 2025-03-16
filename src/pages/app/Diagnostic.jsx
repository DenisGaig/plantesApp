import { useState } from "react";
import SpeciesInventory from "../../components/app/diagnostic/SpeciesInventory.jsx";
import Button from "../../components/app/shared/Button.jsx";
import Stepper from "../../components/app/shared/Stepper.jsx";
import { usePlants } from "../../context/PlantsProvider.jsx";

export default function Diagnostic() {
  const { selectedPlants } = usePlants();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      Title: "Inventaire",
      Description: "Inventaire des espèces que vous avez identifiées",
    },
    {
      Title: "Couverture",
      Description: "Attribution de la densité de couverture",
    },
    { Title: "Analyse", Description: "Analyse des données" },
    { Title: "Résultats", Description: "Affichage des résultats" },
  ];
  const stepTitles = steps.map((step) => step.Title);

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <div className="diagnostic">
      <h1>Diagnostic de sol</h1>
      <div className="diagnostic__stepper">
        <Stepper steps={stepTitles} currentStep={currentStep} />
      </div>
      <div className="diagnostic__title">
        Etape {currentStep + 1}: {steps[currentStep].Description}
      </div>
      <div className="diagnostic__content">
        {currentStep === 0 && (
          <SpeciesInventory selectedPlants={selectedPlants} />
        )}
        {currentStep === 0 && (
          <Button variant="outline" className="diagnostic__actions-button">
            + Ajouter une espèce
          </Button>
        )}
      </div>
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
            disabled={currentStep === steps.length - 1}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
