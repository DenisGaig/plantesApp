import { useState } from "react";
import CoverageEditor from "../../components/app/diagnostic/CoverageEditor.jsx";
import DiagnosticResults from "../../components/app/diagnostic/DiagnosticResults.jsx";
import SoilAnalyzer from "../../components/app/diagnostic/SoilAnalyzer.jsx";
import SoilQuery from "../../components/app/diagnostic/SoilQuery.jsx";
import SpeciesInventory from "../../components/app/diagnostic/SpeciesInventory.jsx";
import Button from "../../components/app/shared/Button.jsx";
import Stepper from "../../components/app/shared/Stepper.jsx";
import { usePlants } from "../../context/PlantsProvider.jsx";
import storageService from "../../services/storageService.js";

export default function Diagnostic() {
  const { identifiedPlants } = usePlants();
  const [currentStep, setCurrentStep] = useState(0);
  // const [selectedPlants, setSelectedPlants] = useState([]);
  const [coverages, setCoverages] = useState(() => {
    const storedCoverages = storageService.getStoredData("coverages");
    return storedCoverages || {};
  });
  const [coefficients, setCoefficients] = useState(() => {
    const storedCoefficients = storageService.getStoredData("coefficients");
    return storedCoefficients || {};
  });
  const emptyFormData = {
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
  };
  const [formData, setFormData] = useState(() => {
    const storedData = storageService.getStoredData("formData");
    return storedData || emptyFormData;
  });
  const [selectedContext, setSelectedContext] = useState(() => {
    const storedContext = storageService.getStoredData("selectedContext");
    return storedContext || "";
  });
  const [analysisResults, setAnalysisResults] = useState([]);
  const [sortedResultsColumns, setSortedResultsColumns] = useState(null);
  const [compositesResults, setCompositesResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [detailedReport, setDetailedReport] = useState(null);

  console.log("COEFFICIENTS", Object.keys(coefficients).length);

  const steps = [
    { id: 1, label: "Inventaire" },
    { id: 2, label: "Couverture" },
    { id: 3, label: "Paramètres" },
    { id: 4, label: "Analyse" },
    { id: 5, label: "Résultats" },
  ];

  // const handlePlantSelection = (plants) => {
  //   setSelectedPlants(plants);
  // };

  const handleCoverageChange = (coverageData, coefficientData) => {
    setCoverages(coverageData);
    setCoefficients(coefficientData);
    storageService.storeData("coverages", coverageData);
    storageService.storeData("coefficients", coefficientData);
    // console.log("Coverages: ", coverages);
  };

  // Gère les données de SoilQuery.jsx et les met à jour dans le state
  const handleFormDataUpdate = (section, data) => {
    if (formData[section] !== data) {
      const updateFormData = { ...formData, [section]: data };
      setFormData(updateFormData);
      // Sauvegarder les données dans le localStorage
      storageService.storeData("formData", updateFormData);
      storageService.storeData("selectedContext", selectedContext);
      console.log("Handle Form data: ", updateFormData);
      console.log("Handle Form data: ", selectedContext);
    }
  };

  const handleAnalysisComplete = (
    results,
    sortedColumns,
    compositesResults,
    recommendations,
    detailedReport
    // selectedContext
  ) => {
    console.log("Diagnostic: Résultats de l'analyse :", results);
    console.log("Diagnostic: Colonnes triées :", sortedColumns);
    console.log("Diagnostic: Résultats composites :", compositesResults);
    console.log("Diagnostic: Recommandations :", recommendations);
    console.log("Diagnostic: Contexte sélectionné :", selectedContext);
    console.log("Diagnostic: Rapport détaillé :", detailedReport);

    setAnalysisResults(results);
    setSortedResultsColumns(sortedColumns);
    setCompositesResults(compositesResults);
    setRecommendations(recommendations);
    setDetailedReport(detailedReport);
    // setSelectedContext(selectedContext);

    // Stockage des résultats dans le localStorage
    storageService.storeData("analysisResults", results);
    storageService.storeData("compositesResults", compositesResults);
    storageService.storeData("recommendations", recommendations);
    storageService.storeData("detailedReport", detailedReport);
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleReset = () => {
    setCurrentStep(0);
    // setSelectedPlants([]);
    setCoverages({});
    setCoefficients({});
    setFormData(emptyFormData);
    setAnalysisResults(null);
    setSortedResultsColumns([]);
    // storageService.removeItem("selectedPlants");
    storageService.removeItem("coverages");
    storageService.removeItem("coefficients");
    storageService.removeItem("formData");
    storageService.removeItem("analysisResults");
    storageService.removeItem("compositesResults");
    storageService.removeItem("recommendations");
    storageService.removeItem("selectedContext");
    storageService.removeItem("detailedReport");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <SpeciesInventory
          // selectedPlants={selectedPlants}
          // onSelectionChange={handlePlantSelection}
          />
        );
      case 1:
        return (
          <CoverageEditor
            selectedPlants={identifiedPlants}
            initialCoverages={coverages}
            onCoverageChange={handleCoverageChange}
          />
        );
      case 2:
        return (
          <SoilQuery
            initialData={formData}
            initialContext={selectedContext}
            onDataChange={(data, context) => {
              setSelectedContext(context);
              handleFormDataUpdate("soil", data.soil);
              handleFormDataUpdate("history", data.history);
            }}
          />
        );
      case 3:
        return (
          <SoilAnalyzer
            selectedPlants={identifiedPlants}
            selectedCoverages={coverages}
            selectedCoefficients={coefficients}
            selectedFormData={formData}
            selectedContext={selectedContext}
            onAnalysisComplete={handleAnalysisComplete}
            onNextStep={handleNext}
          />
        );
      case 4:
        return (
          <DiagnosticResults
            selectedPlants={identifiedPlants}
            selectedCoefficients={coefficients}
            analysisResults={analysisResults}
            compositesResults={compositesResults}
            recommendations={recommendations}
            selectedContext={selectedContext}
            detailedReport={detailedReport}
            sortedResultsColumns={sortedResultsColumns}
            isPreview={false}
          />
        );
      default:
        return null;
    }
  };

  const handleDisableNext = () => {
    if (currentStep === 0) {
      // Si aucun plante n'est sélectionnée, désactiver le bouton "Suivant"
      return identifiedPlants.length === 0;
    }
    if (currentStep === 1) {
      return Object.keys(coefficients).length === 0;
    }
    if (currentStep === 2) {
      return selectedContext === "";
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
          <Button variant="default" onClick={() => handleReset()}>
            Annuler
          </Button>
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
