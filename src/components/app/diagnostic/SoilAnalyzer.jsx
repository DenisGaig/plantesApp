import { Mountain, Shovel, Wheat, Worm } from "lucide-react";
import Button from "../shared/Button.jsx";
import SoilCharts from "./SoilCharts.jsx";
import SoilIndicators from "./SoilIndicators.jsx";

const SoilAnalyzer = ({
  selectedPlants,
  selectedCoverages,
  selectedCoefficients,
  selectedFormData,
}) => {
  console.log(
    "Inputs: ",
    selectedPlants,
    selectedCoverages,
    selectedCoefficients,
    selectedFormData
  );

  return (
    <div className="soil-analyzer">
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
              <Wheat color="#FFE666" strokeWidth="1.5" /> Culture précédente:{" "}
              {selectedFormData.history.soilHistory}
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
        <Button onClick={() => {}}>Lancer l'analyse</Button>
      </div>
    </div>
  );
};
export default SoilAnalyzer;
