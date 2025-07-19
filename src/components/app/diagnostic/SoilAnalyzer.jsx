import { Mountain, Shovel, Wheat, Worm } from "lucide-react";
import { useEffect } from "react";
import useSoilAnalysis from "../../../hooks/useSoilAnalysis.js";
import Button from "../shared/Button.jsx";
import { CircleLoaderSpinner } from "../shared/Spinner.jsx";
import DiagnosticResults from "./DiagnosticResults.jsx";

// Composant pour afficher une carte de résumé de plante
const PlantSummaryCard = ({ plant, coverage, coefficient }) => (
  <div className="soil-analyzer__plant-summary-card">
    <div className="soil-analyzer__plant-summary-image">
      {plant.images && plant.images[0]?.url ? (
        <img src={plant.images[0].url} alt={plant.commonName} />
      ) : (
        <div className="soil-analyzer__plant-summary-placeholder">🌱</div>
      )}
    </div>
    <div className="soil-analyzer__plant-summary-info">
      <h4 className="soil-analyzer__plant-summary-common">
        {plant.commonName}
      </h4>
      <p className="soil-analyzer__plant-summary-latin">
        {plant.scientificName}
      </p>
      <p className="soil-analyzer__plant-summary-density">
        Densité: {coverage}%
      </p>
      {coefficient !== undefined && (
        <p className="soil-analyzer__plant-summary-coefficient">
          Coeff: {coefficient}
        </p>
      )}
    </div>
  </div>
);

// Composant pour afficher une carte de fait sur le sol/historique
const SoilFactCard = ({ icon: Icon, color, label, value }) => (
  <div className="soil-analyzer__fact-card">
    <div className="soil-analyzer__fact-icon-wrapper">
      {Icon && <Icon color={color} strokeWidth="1.5" size={24} />}
    </div>
    <p className="soil-analyzer__fact-label">{label}:</p>
    <p className="soil-analyzer__fact-value">{value}</p>
  </div>
);

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
  selectedContext,
  onAnalysisComplete,
  onNextStep,
}) => {
  const {
    loading,
    error,
    analysisResults,
    compositesResults,
    recommendations,
    sortedColumns,
    showResults,
    detailedReport,
    generateAnalysisResults,
    resetAnalysis, // Garder resetAnalysis si nécessaire pour un bouton de réinitialisation
    getSortedResults, // Garder getSortedResults si nécessaire pour une utilisation interne
  } = useSoilAnalysis(
    selectedPlants,
    selectedCoefficients,
    allColumns,
    selectedContext
  );

  const handleSoilAnalysis = () => {
    generateAnalysisResults(selectedPlants, selectedCoefficients);
  };

  useEffect(() => {
    if (analysisResults) {
      onAnalysisComplete(
        analysisResults,
        sortedColumns,
        compositesResults,
        recommendations,
        detailedReport
      );
    }
  }, [
    analysisResults,
    onAnalysisComplete,
    sortedColumns,
    compositesResults,
    recommendations,
    detailedReport,
  ]); // Ajout des dépendances manquantes

  return (
    <div className="soil-analyzer">
      {!showResults ? (
        <div className="soil-analyzer__pre-analysis">
          <h2>Étape 4: Le Portrait de Votre Parcelle</h2>{" "}
          {/* Titre plus engageant */}
          <p className="soil-analyzer__intro-text">
            Voici un aperçu des observations que vous avez collectées. Chaque
            détail contribue à révéler les secrets et les besoins de votre sol.
          </p>
          <div className="soil-analyzer__data-section">
            <h3>🌱 Vos Messagères Végétales</h3> {/* Sous-titre évocateur */}
            <p className="soil-analyzer__section-description">
              Ces plantes, témoins silencieux, nous parlent de la vie de votre
              terre.
            </p>
            <div className="soil-analyzer__plant-summary-grid">
              {selectedPlants.map((plant) => (
                <PlantSummaryCard
                  key={plant.id}
                  plant={plant}
                  coverage={selectedCoverages[plant.id]}
                  coefficient={selectedCoefficients[plant.id]}
                />
              ))}
            </div>
            {/* Le graphique de densité reste pertinent pour un aperçu global */}
            {/* {selectedPlants.length > 0 && (
              <div className="soil-analyzer__chart-summary">
                <h4>Vue d'ensemble des densités</h4>
                <SoilCharts
                  chartType="bar"
                  selectedPlants={selectedPlants}
                  selectedCoverages={selectedCoverages}
                  selectedCoefficients={selectedCoefficients}
                />
              </div>
            )} */}
          </div>
          <div className="soil-analyzer__data-section">
            <h3>🌍 Les Caractéristiques de Votre Terre</h3>{" "}
            {/* Sous-titre évocateur */}
            <p className="soil-analyzer__section-description">
              Chaque élément du sol et son passé influencent son état actuel.
            </p>
            <div className="soil-analyzer__soil-facts-grid">
              {/* Historique et texture du sol */}
              {selectedFormData.history?.soilHistory && (
                <SoilFactCard
                  icon={Wheat}
                  color="#D4AC0D" // Couleur or/terre
                  label="Culture précédente"
                  value={selectedFormData.history.soilHistory}
                />
              )}
              {selectedFormData.history?.soilWork && (
                <SoilFactCard
                  icon={Shovel}
                  color="#8D6E63" // Couleur terre/marron
                  label="Travail du sol"
                  value={selectedFormData.history.soilWork}
                />
              )}
              {selectedFormData.history?.soilAmendement && (
                <SoilFactCard
                  icon={Worm}
                  color="#6D4C41" // Marron plus foncé
                  label="Amendement récent"
                  value={selectedFormData.history.soilAmendement}
                />
              )}
              {selectedFormData.soil?.soilTexture && (
                <SoilFactCard
                  icon={Mountain}
                  color="#78909c" // Gris pierre
                  label="Texture du sol"
                  value={selectedFormData.soil.soilTexture}
                />
              )}
              {/* Si SoilIndicators affiche d'autres paramètres du sol, vous pouvez les intégrer ici sous forme de SoilFactCard ou le laisser comme composant séparé */}
              {/* Exemple pour d'autres paramètres si SoilIndicators les expose: */}
              {/* {selectedFormData.soil?.pH && (
                  <SoilFactCard
                      icon={Balance} // Icône pour le pH
                      color="#4CAF50"
                      label="pH du sol"
                      value={selectedFormData.soil.pH}
                  />
              )} */}
            </div>
            {/* Si SoilIndicators est un composant qui affiche un résumé de plusieurs indicateurs, vous pouvez le garder ici */}
            {/* <SoilIndicators selectedFormData={selectedFormData} /> */}
          </div>
          <div className="soil-analyzer__action-area">
            {!loading && (
              <Button
                onClick={handleSoilAnalysis}
                className="soil-analyzer__action-button"
              >
                Révéler les Secrets de Votre Terre
              </Button>
            )}
            {loading && (
              <div className="soil-analyzer__loading-state">
                <p className="soil-analyzer__loading-message">
                  Votre sol murmure... L'analyse est en cours pour décrypter son
                  langage.
                </p>
                <CircleLoaderSpinner />
              </div>
            )}
            {error && (
              <p className="soil-analyzer__error-message">Erreur: {error}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="soil-analyzer__post-analysis">
          <h3>Les Premières Révélations de Votre Sol</h3>{" "}
          {/* Titre plus engageant */}
          <DiagnosticResults
            selectedPlants={selectedPlants}
            selectedCoefficients={selectedCoefficients}
            analysisResults={analysisResults}
            compositesResults={compositesResults}
            recommendations={recommendations}
            selectedContext={selectedContext}
            detailedReport={detailedReport}
            isPreview={true}
            sortedResultsColumns={sortedColumns}
          />
          <div className="soil-analyzer__post-analysis__action">
            <Button variant="primary" onClick={onNextStep}>
              Voir l'analyse complète et les recommandations
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilAnalyzer;

// Ancien code de SoilAnalyzer.jsx
// import { Mountain, Shovel, Wheat, Worm } from "lucide-react";
// import { useEffect } from "react";
// import useSoilAnalysis from "../../../hooks/useSoilAnalysis.js";
// import Button from "../shared/Button.jsx";
// import { CircleLoaderSpinner } from "../shared/Spinner.jsx";
// import DiagnosticResults from "./DiagnosticResults.jsx";
// import SoilCharts from "./SoilCharts.jsx";
// import SoilIndicators from "./SoilIndicators.jsx";

// const allColumns = [
//   "BNS",
//   "BS",
//   "Air",
//   "Eau",
//   "MOT",
//   "MO(C)",
//   "MO(N)",
//   "Nit",
//   "Al3+",
//   "Foss",
//   "Less",
//   "Ero",
//   "Sali",
//   "BP",
//   "BK",
//   "AB+",
//   "AB-",
//   "Poll",
// ];

// const SoilAnalyzer = ({
//   selectedPlants,
//   selectedCoverages,
//   selectedCoefficients,
//   selectedFormData,
//   selectedContext,
//   onAnalysisComplete,
//   // sortedResultsColumns,
//   onNextStep,
// }) => {
//   // console.log(
//   //   "Inputs: ",
//   //   selectedPlants,
//   //   selectedCoverages,
//   //   selectedCoefficients,
//   //   selectedFormData
//   // );

//   const {
//     loading,
//     error,
//     analysisResults,
//     compositesResults,
//     recommendations,
//     sortedColumns,
//     showResults,
//     detailedReport,
//     generateAnalysisResults,
//     resetAnalysis,
//     getSortedResults,
//   } = useSoilAnalysis(
//     selectedPlants,
//     selectedCoefficients,
//     allColumns,
//     selectedContext
//   );

//   const handleSoilAnalysis = () => {
//     generateAnalysisResults(selectedPlants, selectedCoefficients);
//   };

//   // const sortedResultsColumns = analysisResults
//   //   ? getSortedResults(allColumns)
//   //   : null;

//   useEffect(() => {
//     if (analysisResults) {
//       onAnalysisComplete(
//         analysisResults,
//         sortedColumns,
//         compositesResults,
//         recommendations,
//         detailedReport
//         // selectedContext
//       );
//     }
//   }, [analysisResults]);

//   // useEffect(() => {
//   //   if (analysisResults) {
//   //     onAnalysisComplete(analysisResults);
//   //   }
//   // }, [analysisResults, onAnalysisComplete]);

//   return (
//     <div className="soil-analyzer">
//       {!showResults ? (
//         <div className="soil-analyzer__resume">
//           <h2>Etape 4: Analyse du sol</h2>
//           <div className="soil-analyzer__collectedDatas">
//             <h3>Données collectées</h3>
//             <div className="soil-analyzer__collectedDatas__container">
//               <div className="soil-analyzer__collectedDatas__plants">
//                 <h4>Plantes identifiées</h4>
//                 <div className="soil-analyzer__collectedDatas__plants__chart">
//                   <SoilCharts
//                     chartType="bar"
//                     selectedPlants={selectedPlants}
//                     selectedCoverages={selectedCoverages}
//                     selectedCoefficients={selectedCoefficients}
//                   />
//                 </div>
//               </div>
//               <div className="soil-analyzer__collectedDatas__soil-parameters">
//                 <SoilIndicators selectedFormData={selectedFormData} />
//               </div>
//             </div>
//             <div className="soil-analyzer__collectedDatas__history">
//               <h4>Historique de la parcelle</h4>
//               <ul>
//                 <li>
//                   <Wheat color="#FFE666" strokeWidth="1.5" /> Culture
//                   précédente: {selectedFormData.history.soilHistory}
//                 </li>
//                 <li>
//                   <Shovel color="#676767" strokeWidth="1.5" />
//                   Travail du sol: {selectedFormData.history.soilWork}
//                 </li>
//               </ul>
//               <ul>
//                 <li>
//                   <Worm color="#987654" strokeWidth="1.5" />
//                   Amendement récent: {selectedFormData.history.soilAmendement}
//                 </li>
//                 <li>
//                   <Mountain />
//                   Texture du sol: {selectedFormData.soil.soilTexture}
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="soil-analyzer__collectedDatas__action">
//             {!loading && (
//               <Button
//                 onClick={() => {
//                   handleSoilAnalysis();
//                 }}
//               >
//                 Lancer l'analyse
//               </Button>
//             )}
//             {loading && (
//               <div className="loading-spinner">
//                 <p className="loading-spinner__text">
//                   L'analyse peut prendre quelques secondes. Merci de patienter.
//                 </p>
//                 <CircleLoaderSpinner />
//               </div>
//             )}
//             {error && <p>Erreur: {error}</p>}
//           </div>
//         </div>
//       ) : (
//         <div className="soil-analyzer__preliminary-results">
//           <h3>Aperçu des résultats de l'analyse</h3>
//           <DiagnosticResults
//             selectedPlants={selectedPlants}
//             selectedCoefficients={selectedCoefficients}
//             analysisResults={analysisResults}
//             compositesResults={compositesResults}
//             recommendations={recommendations}
//             selectedContext={selectedContext}
//             detailedReport={detailedReport}
//             isPreview={true}
//             sortedResultsColumns={sortedColumns}
//           />
//           <div className="soil-analyzer__preliminary-results__action">
//             <Button variant="primary" onClick={onNextStep}>
//               Voir l'analyse complète et les recommendations
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default SoilAnalyzer;
