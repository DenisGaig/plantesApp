import { ChartBar, Sprout, ThumbsUp } from "lucide-react";
import { useState } from "react";
import CollapsibleCard from "../shared/CollapsibleCard.jsx";
import Recommendations from "./Recommendations.jsx";

// Couleurs et seuils pour chaque indicateur (à adapter selon vos besoins) pour Tooltips et descriptions
const indicatorDescriptions = {
  BNS: {
    colors: ["#B2EBE0", "#66C7B4", "#218F78"],
    thresholds: [4, 8], // Seuils pour faible, moyen, élevé
    category: "Bases minérales",
    negativeColor: "#B2EBE0AA",
    description: {
      positive: "Bases sous forme minérale non solubles",
      negative: "Sol géologiquement privé de bases",
    },
  },
  BS: {
    colors: ["#A8D5E2", "#5EADC2", "#1E788A"],
    thresholds: [3, 6],
    category: "Bases minérales",
    negativeColor: "#A8D5E2AA",
    description: {
      positive:
        "Richesse en bases solubles. ! Devient bactéricide à trop forte concentration",
      negative: "Les bases solubles ont été lessivé",
    },
  },
  Air: {
    colors: ["#A6D8F5", "#6FAED0", "#3A6889"],
    thresholds: [3, 6],
    category: "Structure physique",
    negativeColor: "#A6D8F5AA",
    description: {
      positive: "Sol avec une bonne porosité",
      negative: "Sol asphyxié",
    },
  },
  Eau: {
    colors: ["#BDD7ED", "#6496C8", "#2D5DA2"],
    thresholds: [3, 6],
    category: "Structure physique",
    negativeColor: "#BDD7EDAA",
    description: {
      positive: "Engorgement du sol en eau",
      negative: "Très faible rétention en eau du sol",
    },
  },
  MOT: {
    colors: ["#E0CCAE", "#B89D77", "#846C47"],
    thresholds: [5, 10],
    category: "Matière organique",
    negativeColor: "#E0CCAEAA",
    description: {
      positive: "Matière organique totale équilibrée",
      negative: "Déséquilibre de matière organique",
    },
  },
  "MO(C)": {
    colors: ["#E9D3A2", "#C7A96E", "#9C7A37"],
    thresholds: [3, 6],
    category: "Matière organique",
    negativeColor: "#E9D3A2AA",
    description: {
      positive: "Bon taux de matière organique carbonée",
      negative: "Déficit en matière organique carbonée",
    },
  },
  "MO(N)": {
    colors: ["#C9D4A3", "#98A668", "#677542"],
    thresholds: [3, 6],
    category: "Matière organique",
    negativeColor: "#C9D4A3AA",
    description: {
      positive: "Bonne proportion de matière organique azotée",
      negative: "Carence en matière organique animale/azotée",
    },
  },
  Nit: {
    colors: ["#E5B8CC", "#CF7AA3", "#A43F71"],
    thresholds: [3, 6],
    category: "Déséquilibres chimiques",
    description: {
      positive: "Présence de nitrites ou de monoxyde d'azote",
      negative: "",
    },
  },
  "Al3+": {
    colors: ["#CABDCE", "#9685A0", "#65546F"],
    thresholds: [3, 6],
    category: "Déséquilibres chimiques",
    description: {
      positive: "Libération d'ion aluminium par des anaérobioses",
      negative: "",
    },
  },
  Foss: {
    colors: ["#C2B8AE", "#948A81", "#6A5E53"],
    thresholds: [5, 10],
    category: "Matière organique",
    description: {
      positive: "Matière organique fossile ou en cours de fossilisation",
      negative: "",
    },
  },
  Less: {
    colors: ["#F8E9BC", "#EDD278", "#D7B740"],
    thresholds: [2, 5],
    category: "Dégradation",

    description: {
      positive: "Perte par lessivage des éléments nutritifs",
      negative: "",
    },
  },
  Ero: {
    colors: ["#F0D4A2", "#D9AC69", "#B88339"],
    thresholds: [2, 5],
    category: "Dégradation",
    description: {
      positive: "Erosion physique des sols - mort du sol",
      negative: "",
    },
  },
  Sali: {
    colors: ["#E6E6E6", "#C2C2C2", "#9E9E9E"],
    thresholds: [2, 4],
    category: "Toxicité/pollution",
    description: {
      positive: "Augmentation de la salinité du sol",
      negative: "",
    },
  },
  BP: {
    colors: ["#FFCBA4", "#FF9A57", "#E36414"],
    thresholds: [2, 4],
    category: "Déséquilibres chimiques",
    description: {
      positive: "Blocage du Phosphore",
      negative: "",
    },
  },
  BK: {
    colors: ["#FFDBC5", "#FFB38A", "#FF8C51"],
    thresholds: [2, 4],
    category: "Déséquilibres chimiques",
    description: {
      positive: "Blocage du Potassium",
      negative: "",
    },
  },
  "AB+": {
    colors: ["#B7E5B4", "#7BC378", "#40A03C"],
    thresholds: [2, 5],
    category: "Activité biologique",
    description: {
      positive: "Bonne activité microbienne aérobie",
      negative: "",
    },
  },
  "AB-": {
    colors: ["#B4C2B3", "#869A85", "#5C6E5B"],
    thresholds: [3, 6],
    category: "Activité biologique",
    description: {
      positive: "",
      negative: "Activité biologique bloquée",
    },
  },
  Poll: {
    colors: ["#D8BFD8", "#B385B3", "#884E88"],
    thresholds: [2, 4],
    category: "Toxicité/pollution",
    description: {
      positive: "",
      negative: "Sol pollué",
    },
  },
};

// Fonction pour déterminer la couleur en fonction de la valeur et des seuils
const getColorForValue = (indicator, value) => {
  const config = indicatorDescriptions[indicator] || {
    colors: ["#B7E5B4", "#7BC378", "#40A03C"], // Couleurs par défaut
    thresholds: [3, 6], // Seuils par défaut
  };

  if (value <= config.thresholds[0]) {
    return config.colors[0]; // Faible
  } else if (value <= config.thresholds[1]) {
    return config.colors[1]; // Moyen
  } else {
    return config.colors[2]; // Élevé
  }
};

const DiagnosticResults = ({
  selectedPlants,
  selectedCoefficients,
  analysisResults,
  compositesResults,
  recommendations,
  selectedContext,
  detailedReport,
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

  const handleMouseEnter = (event, indicator, isPositive) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const description = isPositive
      ? indicatorDescriptions[indicator].description.positive
      : indicatorDescriptions[indicator].description.negative;
    const value = isPositive
      ? analysisResults[indicator].positive
      : analysisResults[indicator].negative;

    setTooltip({
      visible: true,
      indicator: indicator,
      value: value,
      content: description,
      category: indicatorDescriptions[indicator].category,
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

  const maxValue = Math.max(
    ...sortedResultsColumns.map((c) => analysisResults[c].total)
  );
  const resultData = sortedResultsColumns || analysisResults;

  // Si c'est un aperçu, on affiche seulement les 4 premiers résultats
  const displayResults = isPreview ? resultData.slice(0, 5) : resultData;

  return (
    <div className="diagnostic-results">
      <div className="diagnostic-results__header">
        <h2>Résultats de l'analyse</h2>
        <button>← Revenir à la sélection</button>
      </div>
      <CollapsibleCard
        title="Plantes analysées"
        icon={<Sprout size={20} />}
        defaultOpen={true}
      >
        <div className="diagnostic-results__plants-section">
          <ul>
            {selectedPlants.map((plant) => (
              <li key={plant.id}>{formatPlantName(plant)}</li>
            ))}
          </ul>
        </div>
      </CollapsibleCard>

      {isPreview ? (
        <div className="diagnostic-results__preview">
          <h2>Prévisualisation des résultats</h2>
          <div className="diagnostic-results__chart-container">
            <h3 className="chart-title">
              Les 5 premiers critères les plus significatifs :
            </h3>
            <div className="chart">
              {displayResults.map((indicator) => {
                const totalValue = analysisResults[indicator].total;
                const positiveValue = analysisResults[indicator].positive;
                const negativeValue = analysisResults[indicator].negative;

                // Calculer les largeurs en pourcentage
                const positiveWidth = (positiveValue / maxValue) * 100;
                const negativeWidth = (negativeValue / maxValue) * 100;

                const positiveColor = getColorForValue(
                  indicator,
                  positiveValue
                );
                const negativeColor =
                  indicatorDescriptions[indicator]?.negativeColor || "#A43F71";
                return (
                  <div key={indicator} className="chart-row">
                    <div className="chart-label">{indicator}</div>
                    <div className="chart-bar-container">
                      {analysisResults[indicator]?.positive > 0 && (
                        <div
                          className="chart-bar-positive"
                          style={{
                            width: `${positiveWidth}%`,
                            backgroundColor: positiveColor,
                          }}
                          onMouseEnter={(e) =>
                            handleMouseEnter(e, indicator, true)
                          }
                          onMouseLeave={handleMouseLeave}
                        />
                      )}
                      {analysisResults[indicator]?.negative > 0 && (
                        <div
                          className="chart-bar-negative"
                          style={{
                            width: `${negativeWidth}%`,
                            backgroundColor: negativeColor,
                          }}
                          onMouseEnter={(e) =>
                            handleMouseEnter(e, indicator, false)
                          }
                          onMouseLeave={handleMouseLeave}
                        />
                      )}
                    </div>
                    <div className="chart-value">
                      {analysisResults[indicator]?.total}
                    </div>
                    <div className="chart-details">
                      <span className="positive-text">
                        +{analysisResults[indicator].positive}
                      </span>
                      {analysisResults[indicator].negative > 0 && (
                        <span className="negative-text">
                          {" "}
                          -{analysisResults[indicator].negative}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>{" "}
        </div>
      ) : (
        <div className="diagnostic-results__complete">
          {/* <CollapsibleCard
            title="Résultats détaillés des indicateurs"
            icon={<Table size={20} />}
            defaultOpen={false}
          >
            <div className="diagnostic-results__table">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Facteurs</th>
                    <th>Caractère indicateur positif </th>
                    <th>Caractère indicateur négatif </th>
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
          </CollapsibleCard> */}
          <CollapsibleCard
            title="Tous les indicateurs en graphique"
            icon={<ChartBar size={20} />}
            defaultOpen={false}
          >
            <div className="diagnostic-results__chart-container">
              {/* <h3 className="chart-title">Tous les critères :</h3> */}
              <div className="chart">
                {displayResults.map((indicator) => {
                  const totalValue = analysisResults[indicator].total;
                  const positiveValue = analysisResults[indicator].positive;
                  const negativeValue = analysisResults[indicator].negative;

                  // Calculer les largeurs en pourcentage
                  const positiveWidth = (positiveValue / maxValue) * 100;
                  const negativeWidth = (negativeValue / maxValue) * 100;

                  const positiveColor = getColorForValue(
                    indicator,
                    positiveValue
                  );
                  const negativeColor =
                    indicatorDescriptions[indicator]?.negativeColor ||
                    "#A43F71";

                  return (
                    <div key={indicator} className="chart-row">
                      <div className="chart-label">{indicator}</div>
                      <div className="chart-bar-container">
                        {positiveValue > 0 && (
                          <div
                            className="chart-bar-positive"
                            style={{
                              width: `${positiveWidth}%`,
                              backgroundColor: positiveColor,
                            }}
                            onMouseEnter={(e) =>
                              handleMouseEnter(e, indicator, true)
                            }
                            onMouseLeave={handleMouseLeave}
                          />
                        )}
                        {negativeValue > 0 && (
                          <div
                            className="chart-bar-negative"
                            style={{
                              width: `${negativeWidth}%`,
                              backgroundColor: negativeColor,
                            }}
                            onMouseEnter={(e) =>
                              handleMouseEnter(e, indicator, false)
                            }
                            onMouseLeave={handleMouseLeave}
                          />
                        )}
                      </div>
                      <div className="chart-value">
                        {analysisResults[indicator]?.total}
                      </div>
                      <div className="chart-details">
                        <span className="positive-text">
                          +{analysisResults[indicator].positive}
                        </span>
                        {analysisResults[indicator].negative > 0 && (
                          <span className="negative-text">
                            {" "}
                            -{analysisResults[indicator].negative}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Légende des couleurs par catégorie */}
              <div className="color-legend">
                <h4>Légende</h4>
                <div className="legend-categories">
                  <div className="legend-category">
                    <h5>Bases minérales</h5>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#66C7B4" }}
                      ></div>
                      <span className="legend-label">
                        BNS (Bases non solubles)
                      </span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#5EADC2" }}
                      ></div>
                      <span className="legend-label">BS (Bases solubles)</span>
                    </div>
                  </div>

                  <div className="legend-category">
                    <h5>Structure physique</h5>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#6FAED0" }}
                      ></div>
                      <span className="legend-label">Air (Porosité)</span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#6496C8" }}
                      ></div>
                      <span className="legend-label">
                        Eau (Régime hydrique)
                      </span>
                    </div>
                  </div>

                  <div className="legend-category">
                    <h5>Matière organique</h5>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#B89D77" }}
                      ></div>
                      <span className="legend-label">
                        MOT (Matière organique totale)
                      </span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#C7A96E" }}
                      ></div>
                      <span className="legend-label">
                        MO(C) (Matière organique C)
                      </span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#98A668" }}
                      ></div>
                      <span className="legend-label">
                        MO(N) (Matière organique N)
                      </span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#948A81" }}
                      ></div>
                      <span className="legend-label">Foss (Fossilisation)</span>
                    </div>
                  </div>

                  <div className="legend-category">
                    <h5>Activité biologique</h5>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#7BC378" }}
                      ></div>
                      <span className="legend-label">
                        AB+ (Activité microbienne aérobie)
                      </span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#869A85" }}
                      ></div>
                      <span className="legend-label">
                        AB- (Activité bloquée)
                      </span>
                    </div>
                  </div>

                  <div className="legend-category">
                    <h5>Dégradation et déséquilibres</h5>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#EDD278" }}
                      ></div>
                      <span className="legend-label">Less (Lessivage)</span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#D9AC69" }}
                      ></div>
                      <span className="legend-label">Ero (Érosion)</span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#CF7AA3" }}
                      ></div>
                      <span className="legend-label">Nit (Nitrites)</span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#9685A0" }}
                      ></div>
                      <span className="legend-label">Al3+ (Aluminium)</span>
                    </div>
                  </div>

                  <div className="legend-category">
                    <h5>Toxicité/pollution</h5>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#C2C2C2" }}
                      ></div>
                      <span className="legend-label">Sali (Salinisation)</span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: "#B385B3" }}
                      ></div>
                      <span className="legend-label">Poll (Pollution)</span>
                    </div>
                  </div>
                </div>

                <div className="legend-patterns">
                  <div className="legend-item">
                    <div className="legend-pattern">
                      <div className="legend-color legend-color-solid"></div>
                    </div>
                    <span className="legend-label">Valeur positive (+)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-pattern">
                      <div className="legend-color legend-color-hatched"></div>
                    </div>
                    <span className="legend-label">Valeur négative (-)</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleCard>
          <CollapsibleCard
            title="Rapport d'analyse & Recommandations"
            icon={<ThumbsUp size={20} />}
            defaultOpen={false}
          >
            <div className="diagnostic-results__recommendations">
              <Recommendations
                compositesResults={compositesResults}
                recommendations={recommendations}
                selectedContext={selectedContext}
                detailedReport={detailedReport}
              />
            </div>
          </CollapsibleCard>
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
            borderRadius: "5px",
            pointerEvents: "none",
            transform: "translateY(-100%)",
            zIndex: 1000,
            width: "auto",
            maxWidth: "300px",
          }}
        >
          <h4>{tooltip.indicator}</h4>
          <p>
            <strong>Catégorie: </strong>
            {tooltip.category}
          </p>
          <p>
            <strong>Valeur: </strong>
            {tooltip.value}
          </p>
          {tooltip.content}
        </div>
      )}
    </div>
  );
};
export default DiagnosticResults;
