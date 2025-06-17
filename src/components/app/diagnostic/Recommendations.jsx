import { useState } from "react";
import SoilCharts from "./SoilCharts.jsx";
import SoilDetailedReport from "./SoilDetailedReport.jsx";

const Recommendations = ({
  compositesResults,
  recommendations,
  selectedContext,
  userProfile, // Profil utilisateur pour les recommandations personnalisées (optionnel)
  detailedReport,
}) => {
  // Etat pour suivre le critère de recommandation sélectionné
  const [selectedCriterion, setSelectedCriterion] = useState("null");

  const [selectedChartType, setSelectedChartType] = useState(() => {
    // Si un utilisateur existe, déterminez le type de graphique en fonction de son expertise
    if (userProfile) {
      return userProfile.expertise === "professional" ? "radar" : "pie";
    }
    // Sinon, utilisez le type de graphique par défaut
    return "pie";
  });

  if (!compositesResults || !recommendations)
    return (
      <div className="no-recommandations">
        Pas de recommandations disponibles
      </div>
    );

  const getStatusColor = (type) => {
    switch (type) {
      case "deficit":
        return "status-deficit";
      case "exces":
        return "status-exces";
      case "equilibre":
        return "status-equilibre";
      default:
        return "";
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case "deficit":
        return "↓";
      case "exces":
        return "↑";
      case "equilibre":
        return "✓";
      default:
        return "";
    }
  };

  // Fonction pour gérer le clic sur une section du graphique
  const handleSectionClick = (criterionKey) => {
    setSelectedCriterion(criterionKey);
  };

  // Fonction pour basculer entre les types de graphiques
  const toggleChartType = (type) => {
    setSelectedChartType(type);
    // Réinitialiser la sélection lors du changement de graphique
    setSelectedCriterion(null);
  };

  // Fonction pour afficher une carte de recommandation spécifique
  const renderRecommendationCard = (key) => {
    if (!recommendations[key]) return null;

    const rec = recommendations[key];
    const value = compositesResults[key]
      ? compositesResults[key].toFixed(2)
      : "N/A";
    const statusClass = getStatusColor(rec.type);
    const statusIcon = getStatusIcon(rec.type);

    // Déterminer si cette carte est sélectionnée
    const isSelected = selectedCriterion === key;
    const cardClass = isSelected
      ? "recommendations__card recommendations__card--selected"
      : "recommendations__card";

    return (
      <div key={key} className={cardClass}>
        <div className="recommendations__card__header">
          <h3 className="recommendations__card__header__title">
            {key === "vieMicrobienne" && "Vie Microbienne Aérobie"}
            {key === "complexeArgiloHumique" && "Complexe Argilo-Humique"}
            {key === "matiereOrganique" && "Matière Organique"}
            {key === "equilibreCN" && "Équilibre C/N"}
            {key === "structurePorosite" && "Structure et Porosité"}
          </h3>
          <span
            className={`recommendations__card__header__status ${statusClass}`}
          >
            {value} {statusIcon}
          </span>
        </div>
        <p className="recommendations__card__description">{rec.description}</p>
        {rec.type !== "equilibre" && (
          <p className="recommendations__card__intensity">
            <span className="recommendations__card__intensity__label">
              {rec.type === "deficit" ? "Déficit" : "Excès"} {rec.intensite}
            </span>
            {rec.ecart > 0 && ` (écart: ${rec.ecart.toFixed(2)})`}
          </p>
        )}
        <div className="recommendations__card__box">
          <p className="recommendations__card__box__text">
            {rec.recommandation}
          </p>
        </div>
      </div>
    );
  };

  // Vérifier quelles clés sont communes aux deux objets
  const validKeys = Object.keys(recommendations).filter(
    (key) => compositesResults[key] !== undefined
  );

  return (
    <div className="recommendations">
      <SoilDetailedReport
        detailedReport={detailedReport}
        selectedContext={selectedContext}
      />
      <h2 className="recommendations__title">
        En résumé pour{" "}
        {selectedContext === "maraichageBio" && "votre maraîchage bio"}
        {selectedContext === "grandesCultures" && "vos grandes cultures"}
        {selectedContext === "jardin" && "votre potager"}
        {selectedContext === "prairieAgricole" && "votre prairie permanente"}
        {selectedContext === "viticulture" && "votre vignoble"}
        {selectedContext === "arboriculture" && "votre verger"}
        {selectedContext === "agroforesterie" && "votre agroforesterie"}
        {selectedContext === "permaculture" && "votre parcelle en permaculture"}
      </h2>

      {/* Boutons pour basculer entre les types de graphiques */}
      <div className="recommendations__chart-toggle">
        <button
          className={selectedChartType === "pie" ? "active" : ""}
          onClick={() => toggleChartType("pie")}
        >
          Rosace interactive
        </button>
        <button
          className={selectedChartType === "radar" ? "active" : ""}
          onClick={() => toggleChartType("radar")}
        >
          Graphique radar
        </button>
      </div>

      {/* Section du graphique */}
      <div className="recommendations__visualization">
        <SoilCharts
          chartType={selectedChartType}
          compositesResults={compositesResults}
          recommendations={recommendations}
          onSectionClick={handleSectionClick}
        />
      </div>

      {/* Afficher soit la carte sélectionnée, soit toutes les cartes */}
      <div className="recommendations__grid">
        {selectedCriterion && recommendations[selectedCriterion]
          ? renderRecommendationCard(selectedCriterion)
          : validKeys.map((key) => renderRecommendationCard(key))}
      </div>

      {/* Message d'aide si aucun critère n'est sélectionné */}
      {!selectedCriterion && (
        <p className="recommendations__help-text">
          Cliquez sur une section du graphique pour afficher les détails
          correspondants
        </p>
      )}
    </div>
  );
};
export default Recommendations;
