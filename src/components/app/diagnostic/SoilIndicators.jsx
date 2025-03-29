const SoilIndicators = ({ selectedFormData }) => {
  console.log("Data passed to SoilIndicators:", selectedFormData);
  const convertToScore = (category, value) => {
    const scoresMap = {
      soilDrainage: {
        rapide: 8,
        bon: 6,
        lent: 4,
        tresLent: 2,
      },
      soilWorkability: {
        facile: 8,
        moyen: 5,
        difficile: 2,
      },
      soilOrganisms: {
        forte: 8,
        moderee: 6,
        faible: 4,
        aucune: 2,
      },
    };

    return scoresMap[category]?.[value] || 0;
  };

  const drainageScore = convertToScore(
    "soilDrainage",
    selectedFormData.soil.soilDrainage
  );
  const workabilityScore = convertToScore(
    "soilWorkability",
    selectedFormData.soil.soilWorkability
  );
  const organismsScore = convertToScore(
    "soilOrganisms",
    selectedFormData.soil.soilOrganisms
  );

  console.log("scores", drainageScore, workabilityScore, organismsScore);

  return (
    <div className="soil-indicators">
      <h4>Paramètres du sol</h4>
      <div className="soil-indicators__parameter">
        <div className="soil-indicators__label">Drainage :</div>
        <div className="soil-indicators__barContainer">
          <div
            className="soil-indicators__bar"
            style={{ width: `${(drainageScore / 10) * 100}%` }}
          ></div>
        </div>
        <div className="soil-indicators__score">{drainageScore}/10</div>
      </div>

      <div className="soil-indicators__parameter">
        <div className="soil-indicators__label">Compaction :</div>
        <div className="soil-indicators__barContainer">
          <div
            className="soil-indicators__bar"
            style={{ width: `${(workabilityScore / 10) * 100}%` }}
          ></div>
        </div>
        <div className="soil-indicators__score">{drainageScore}/10</div>
      </div>

      <div className="soil-indicators__parameter">
        <div className="soil-indicators__label">
          Activité <br /> biologique :
        </div>
        <div className="soil-indicators__barContainer">
          <div
            className="soil-indicators__bar"
            style={{ width: `${(organismsScore / 10) * 100}%` }}
          ></div>
        </div>
        <div className="soil-indicators__score">{drainageScore}/10</div>
      </div>
    </div>
  );
};
export default SoilIndicators;
