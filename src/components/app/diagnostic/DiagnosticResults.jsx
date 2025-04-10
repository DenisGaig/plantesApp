import { useState } from "react";
import Recommendations from "./Recommendations.jsx";

// const columnDescriptions = {
//   BNS: "Bases non solubles",
//   BS: "Bases solubles",
//   Air: "Air - porosité du sol",
//   Eau: "Eau - drainage du sol",
//   MOT: "Matière organique totale",
//   "MO(C)": "Matière organique carbonée",
//   "MO(N)": "Matière organique animale ou azotée",
//   Nit: "Nitrites",
//   "Al3+": "Ions Aluminium",
//   Foss: "Fossilisation de la matière organique",
//   Less: "Lessivage du sol",
//   Ero: "Érosion du sol",
//   Sali: "Salinisation du sol",
//   BP: "Blocage du Phosphore",
//   BK: "Blocage du Potassium",
//   "AB+": "Bonne activité biologique microbienne",
//   "AB-": "Activité biologique bloquée",
//   Poll: "Pollution du sol",
// };
const columnDescriptions = {
  BNS: {
    positive: "Bases sous forme minérale non solubles",
    negative: "Sol privé de bases",
  },
  BS: {
    positive: "Richesse en bases solubles",
    negative: "Absence de bases solubles",
  },
  Air: {
    positive: "Sol avec une bonne porosité",
    negative: "Sol asphyxié",
  },
  Eau: {
    positive: "Engorgement du sol en eau",
    negative: "Très faible rétention en eau du sol",
  },
  MOT: {
    positive: "Matière organique totale équilibrée",
    negative: "Déséquilibre de matière organique",
  },
  "MO(C)": {
    positive: "Bon taux de matière organique carbonée",
    negative: "Déficit en matière organique carbonée",
  },
  "MO(N)": {
    positive: "Bonne proportion de matière organique azotée",
    negative: "Carence en matière organique animale/azotée",
  },
  Nit: {
    positive: "Présence de nitrites ou de monoxyde d'azote",
    negative: "",
  },
  "Al3+": {
    positive: "Libération d'ion aluminium",
    negative: "",
  },
  Foss: {
    positive: "Matière organique fossile ou en cours de fossilisation",
    negative: "",
  },
  Less: {
    positive: "Perte par lessivage des éléments nutritifs",
    negative: "",
  },
  Ero: {
    positive: "Erosion physique des sols - mort du sol",
    negative: "",
  },
  Sali: {
    positive: "Augmentation de la salinité du sol",
    negative: "",
  },
  BP: {
    positive: "Blocage du Phosphore",
    negative: "",
  },
  BK: {
    positive: "Blocage du Potassium",
    negative: "",
  },
  "AB+": {
    positive: "Bonne activité microbienne aérobie",
    negative: "",
  },
  "AB-": {
    positive: "",
    negative: "Activité biologique bloquée",
  },
  Poll: {
    positive: "",
    negative: "Sol pollué",
  },
};
const DiagnosticResults = ({
  selectedPlants,
  selectedCoefficients,
  analysisResults,
  sortedResultsColumns,
  isPreview,
}) => {
  console.log("DiagnosticResults bien monté");
  console.log("Plantes sélectionnées :", selectedPlants);
  // console.log("Analyse des résultats :", analysisResults);
  // console.log("Résultats triés :", sortedResultsColumns);
  // console.log("Object entries", Object.entries(analysisResults));
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    position: { x: 0, y: 0 },
  });

  const handleMouseEnter = (event, columnKey, isPositive) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const description = isPositive
      ? columnDescriptions[columnKey].positive
      : columnDescriptions[columnKey].negative;

    setTooltip({
      visible: true,
      content: description,
      position: {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY - 20,
      },
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: "", position: { x: 0, y: 0 } });
  };

  const formatPlantName = (plant) => {
    const density = selectedCoefficients[plant.id] || "?";
    return `${plant.commonName} - densité ${density}`;
  };

  const resultData = sortedResultsColumns || analysisResults;

  // Si c'est un aperçu, on affiche seulement les 4 premiers résultats

  const displayResults = isPreview ? resultData.slice(0, 5) : resultData;

  return (
    <div className="diagnostic-results">
      <div className="diagnostic-results__header">
        <h2>Résultats de l'analyse</h2>
        <button>← Revenir à la sélection</button>
      </div>
      <div className="diagnostic-results__plants-section">
        <h3>Plantes analysées :</h3>
        <ul>
          {selectedPlants.map((plant) => (
            <li key={plant.id}>{formatPlantName(plant)}</li>
          ))}
        </ul>
      </div>

      {isPreview ? (
        <div className="diagnostic-results__preview">
          <h2>Prévisualisation des résultats</h2>
          {/* <p>Voici les résultats de votre diagnostic.</p> */}
          <div className="diagnostic-results__chart-container">
            <h3 className="chart-title">
              Les 5 premiers critères les plus significatifs :
            </h3>
            <div className="chart">
              {displayResults.map((col) => (
                <div key={col} className="chart-row">
                  <div className="chart-label">{col}</div>
                  <div className="chart-bar-container">
                    {analysisResults[col]?.positive > 0 && (
                      <div
                        className="chart-bar-positive"
                        style={{
                          width: `${
                            (analysisResults[col].positive /
                              Math.max(
                                ...sortedResultsColumns.map(
                                  (c) => analysisResults[c].total
                                )
                              )) *
                            100
                          }%`,
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, col, true)}
                        onMouseLeave={handleMouseLeave}
                      />
                    )}
                    {analysisResults[col]?.negative > 0 && (
                      <div
                        className="chart-bar-negative"
                        style={{
                          width: `${
                            (analysisResults[col].negative /
                              Math.max(
                                ...sortedResultsColumns.map(
                                  (c) => analysisResults[c].total
                                )
                              )) *
                            100
                          }%`,
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, col, false)}
                        onMouseLeave={handleMouseLeave}
                      />
                    )}
                  </div>
                  <div className="chart-value">
                    {analysisResults[col]?.total}
                  </div>
                  <div className="chart-details">
                    <span className="positive-text">
                      +{analysisResults[col].positive}
                    </span>
                    {analysisResults[col].negative > 0 && (
                      <span className="negative-text">
                        {" "}
                        -{analysisResults[col].negative}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>{" "}
        </div>
      ) : (
        <div className="diagnostic-results__complete">
          <div className="diagnostic-results__table">
            <h3 className="table-title">Scores par caractéristiques :</h3>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Caractéristiques</th>
                  <th>Indicateurs + (favorable)</th>
                  <th>Indicateurs - (limitant)</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedResultsColumns.map((col) => (
                  <tr key={col}>
                    <td>{col}</td>
                    <td className="positive-value">
                      {analysisResults[col].positive > 0
                        ? analysisResults[col].positive
                        : "-"}
                    </td>
                    <td className="negative-value">
                      {analysisResults[col].negative > 0
                        ? analysisResults[col].negative
                        : "-"}
                    </td>
                    <td className="total-value">
                      {analysisResults[col].total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="diagnostic-results__chart-container">
            <h3 className="chart-title">Tous les critères :</h3>
            <div className="chart">
              {displayResults.map((col) => (
                <div key={col} className="chart-row">
                  <div className="chart-label">{col}</div>
                  <div className="chart-bar-container">
                    {analysisResults[col]?.positive > 0 && (
                      <div
                        className="chart-bar-positive"
                        style={{
                          width: `${
                            (analysisResults[col].positive /
                              Math.max(
                                ...sortedResultsColumns.map(
                                  (c) => analysisResults[c].total
                                )
                              )) *
                            100
                          }%`,
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, col, true)}
                        onMouseLeave={handleMouseLeave}
                      />
                    )}
                    {analysisResults[col]?.negative > 0 && (
                      <div
                        className="chart-bar-negative"
                        style={{
                          width: `${
                            (analysisResults[col].negative /
                              Math.max(
                                ...sortedResultsColumns.map(
                                  (c) => analysisResults[c].total
                                )
                              )) *
                            100
                          }%`,
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, col, false)}
                        onMouseLeave={handleMouseLeave}
                      />
                    )}
                  </div>
                  <div className="chart-value">
                    {analysisResults[col]?.total}
                  </div>
                  <div className="chart-details">
                    <span className="positive-text">
                      +{analysisResults[col].positive}
                    </span>
                    {analysisResults[col].negative > 0 && (
                      <span className="negative-text">
                        {" "}
                        -{analysisResults[col].negative}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="diagnostic-results__recommendations">
            <Recommendations />
          </div>
        </div>
      )}
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            left: tooltip.position.x,
            top: tooltip.position.y,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "3px",
            pointerEvents: "none",
            transform: "translateY(-100%)",
            zIndex: 1000,
            width: "auto",
            maxWidth: "250px",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};
export default DiagnosticResults;
