import { Activity, Bug, Home } from "lucide-react";
import { useEffect, useState } from "react";
import useSoilAnalysis from "../../../hooks/useSoilAnalysis.js";
import CollapsibleCard from "../shared/CollapsibleCard.jsx";

const columnDescriptions = {
  BNS: "Bases non solubles",
  BS: "Bases solubles",
  Air: "Porosité du sol",
  Eau: "Drainage du sol",
  MOT: "Matière organique",
  "MO(C)": "Matière organique carbonée",
  "MO(N)": "Matière organique animale ou azotée",
  Nit: "Nitrites",
  "Al3+": "Libération d'aluminium",
  Foss: "Fossilisation",
  Less: "Lessivage",
  Ero: "Érosion",
  Sali: "Salinisation",
  BP: "Blocage du Phosphore",
  BK: "Blocage du Potassium",
  "AB+": "Bonne activité microbienne",
  "AB-": "Activité biologique bloquée",
  Poll: "Pollution",
};

const PlantBioIndicators = ({ plant }) => {
  // const [indicators, setIndicators] = useState([]);
  const [mainIndicators, setMainIndicators] = useState([]);
  const { getPlantIndicatorsByScientificName } = useSoilAnalysis();

  useEffect(() => {
    const plantIndicators = getPlantIndicatorsByScientificName(
      plant.scientificName[0]
    );
    console.log("PlantBioIndicators - Plant Indicators:", plantIndicators);

    if (plantIndicators) {
      let indicatorsWithDescriptions = [];
      // Remplace les abréviations des caractères fortement indicateurs par les descriptions complètes
      const strongIndicators = Object.entries(plantIndicators)
        .filter(([_, value]) => value == "--" || value == "++")
        .map(([key, _]) => columnDescriptions[key] || key);

      // Si des indicateurs forts sont trouvés, utilise-les uniquement
      if (strongIndicators.length > 0) {
        indicatorsWithDescriptions = strongIndicators;
      } else {
        // Sinon, utilise les indicateurs normaux
        indicatorsWithDescriptions = Object.entries(plantIndicators)
          .filter(([_, value]) => value === "+" || value === "-")
          .map(([key, _]) => columnDescriptions[key] || key);
      }

      console.log(
        "PlantBioIndicators - Indicators with descriptions:",
        indicatorsWithDescriptions
      );
      // Met à jour les indicateurs principaux avec les descriptions complètes
      setMainIndicators(indicatorsWithDescriptions);
    }
  }, [plant, getPlantIndicatorsByScientificName]);

  if (mainIndicators.length === 0) {
    return <div>Pas d'indicateur découvert pour cette plante.</div>;
  }

  return (
    <div className="plant-bio-indicators">
      <CollapsibleCard
        title="Ses habitats"
        icon={<Home size={20} />}
        defaultOpen={true}
      >
        <div className="habitats">
          {plant.primaryHabitat && (
            <div className="habitats-item">
              <h4>Habitat d'origine</h4>
              <p>
                {plant.primaryHabitat.map((habitat, index) => (
                  <li key={index} className="habitats-item__list">
                    {habitat}
                  </li>
                ))}
              </p>
            </div>
          )}

          {plant.secondaryHabitat && (
            <div className="habitats-item">
              <h4>Où on la trouve aujourd'hui ?</h4>
              <p>
                {plant.secondaryHabitat.map((habitat, index) => (
                  <li key={index} className="habitats-item__list">
                    {habitat}
                  </li>
                ))}
              </p>
            </div>
          )}
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title="Ce qu'elle indique"
        icon={<Activity size={20} />}
        defaultOpen={true}
      >
        <div className="plant-indicator-value">
          <div className="plant-indicator-value__header">
            {/* Affiche les 3 premiers caractères fortement indicateurs */}
            {mainIndicators.slice(0, 4).map((indicator, index) => (
              <li key={index} className="plant-indicator-value__header-list">
                {indicator}
              </li>
            ))}
          </div>
          {plant.indicatorTraits && (
            <div className="indicator-item">
              <p>
                {plant.indicatorTraits?.map((indicator, index) => (
                  <li key={index} className="indicator-item__list">
                    {indicator}
                  </li>
                ))}
              </p>
              <div className="indicator-rating">
                <strong>Indice de dégradation:</strong> {plant.soilCondition}/3
                <div className="indicator-bar">
                  <div
                    className="indicator-fill"
                    style={{
                      width: `${(plant.soilCondition / 3) * 100}%`,
                      backgroundColor:
                        plant.soilCondition > 2
                          ? "#e74c3c"
                          : plant.soilCondition > 1
                          ? "#f39c12"
                          : "#2ecc71",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title="Ses interactions écologiques"
        icon={<Bug size={20} />}
        defaultOpen={false}
      >
        <div className="plant-ecology">
          {plant.ecology && <p>{plant.ecology}</p>}
        </div>
      </CollapsibleCard>

      {/* <div className="plant-bio-indicators__content">
        <div className="plant-bio-indicators__content__title">
          <Trees />
          <h4>Mon habitat d'origine</h4>
        </div>
        <p>
          {plant["primaryHabitat"].map((habitat, index) => (
            <li key={index} className="plant-bio-indicators__content__item">
              {habitat}
            </li>
          ))}
        </p>
        <div className="plant-bio-indicators__content__title">
          <Sprout />
          <h4>Ce que je peux indiquer</h4>
        </div>
        <p>
          {plant["indicatorTraits"].map((indicator, index) => (
            <li key={index} className="plant-bio-indicators__content__item">
              {indicator}
            </li>
          ))}
        </p>
        <div className="plant-bio-indicators__content__title">
          <Binoculars />
          <h4>Où m'observer ?</h4>
        </div>
        <p>
          {plant["secondaryHabitat"].map((habitat, index) => (
            <li key={index} className="plant-bio-indicators__content__item">
              {habitat}
            </li>
          ))}
        </p>
      </div> */}
    </div>
  );
};
export default PlantBioIndicators;
