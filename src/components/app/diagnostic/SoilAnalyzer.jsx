import { Mountain, Shovel, Wheat, Worm } from "lucide-react";
import { useEffect } from "react";
import useSoilAnalysis from "../../../hooks/useSoilAnalysis.js";
import Button from "../shared/Button.jsx";
import { CircleLoaderSpinner } from "../shared/Spinner.jsx";
import DiagnosticResults from "./DiagnosticResults.jsx";
import SoilCharts from "./SoilCharts.jsx";
import SoilIndicators from "./SoilIndicators.jsx";

const allColumns = [
  "BNS",
  "BS",
  "Air",
  "Eau",
  "MOT",
  "MO(C)",
  "MO(N)",
  "Nit",
  "Al3+",
  "Foss",
  "Less",
  "Ero",
  "Sali",
  "BP",
  "BK",
  "AB+",
  "AB-",
  "Poll",
];

const SoilAnalyzer = ({
  selectedPlants,
  selectedCoverages,
  selectedCoefficients,
  selectedFormData,
  onAnalysisComplete,
  // sortedResultsColumns,
  onNextStep,
}) => {
  // console.log(
  //   "Inputs: ",
  //   selectedPlants,
  //   selectedCoverages,
  //   selectedCoefficients,
  //   selectedFormData
  // );

  const {
    loading,
    error,
    showResults,
    sortedColumns,
    analysisResults,
    generateAnalysisResults,
    resetAnalysis,
    getSortedResults,
  } = useSoilAnalysis(selectedPlants, selectedCoefficients, allColumns);

  const handleSoilAnalysis = () => {
    generateAnalysisResults();
  };

  // const sortedResultsColumns = analysisResults
  //   ? getSortedResults(allColumns)
  //   : null;

  useEffect(() => {
    if (analysisResults) {
      onAnalysisComplete(analysisResults, sortedColumns);
    }
  }, [analysisResults]);

  // useEffect(() => {
  //   if (analysisResults) {
  //     onAnalysisComplete(analysisResults);
  //   }
  // }, [analysisResults, onAnalysisComplete]);

  return (
    <div className="soil-analyzer">
      {!showResults ? (
        <div className="soil-analyzer__resume">
          <h2>Etape 4: Analyse du sol</h2>
          <div className="soil-analyzer__collectedDatas">
            <h3>Données collectées</h3>
            <div className="soil-analyzer__collectedDatas__container">
              <div className="soil-analyzer__collectedDatas__plants">
                <h4>Plantes identifiées</h4>
                <div className="soil-analyzer__collectedDatas__plants__chart">
                  <SoilCharts
                    chartType="bar"
                    selectedPlants={selectedPlants}
                    selectedCoverages={selectedCoverages}
                    selectedCoefficients={selectedCoefficients}
                  />
                </div>
              </div>
              <div className="soil-analyzer__collectedDatas__soil-parameters">
                <SoilIndicators selectedFormData={selectedFormData} />
              </div>
            </div>
            <div className="soil-analyzer__collectedDatas__history">
              <h4>Historique de la parcelle</h4>
              <ul>
                <li>
                  <Wheat color="#FFE666" strokeWidth="1.5" /> Culture
                  précédente: {selectedFormData.history.soilHistory}
                </li>
                <li>
                  <Shovel color="#676767" strokeWidth="1.5" />
                  Travail du sol: {selectedFormData.history.soilWork}
                </li>
              </ul>
              <ul>
                <li>
                  <Worm color="#987654" strokeWidth="1.5" />
                  Amendement récent: {selectedFormData.history.soilAmendement}
                </li>
                <li>
                  <Mountain />
                  Texture du sol: {selectedFormData.soil.soilTexture}
                </li>
              </ul>
            </div>
          </div>
          <div className="soil-analyzer__collectedDatas__action">
            {!loading && (
              <Button
                onClick={() => {
                  handleSoilAnalysis();
                }}
              >
                Lancer l'analyse
              </Button>
            )}
            {loading && (
              <div className="loading-spinner">
                <p className="loading-spinner__text">
                  L'analyse peut prendre quelques secondes. Merci de patienter.
                </p>
                <CircleLoaderSpinner />
              </div>
            )}
            {error && <p>Erreur: {error}</p>}
          </div>
        </div>
      ) : (
        <div className="soil-analyzer__preliminary-results">
          <h3>Aperçu des résultats de l'analyse</h3>
          <DiagnosticResults
            selectedPlants={selectedPlants}
            selectedCoefficients={selectedCoefficients}
            analysisResults={analysisResults}
            isPreview={true}
            sortedResultsColumns={sortedColumns}
          />
          <div className="soil-analyzer__preliminary-results__action">
            <Button variant="primary" onClick={onNextStep}>
              Voir l'analyse complète et les recommendations
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default SoilAnalyzer;
