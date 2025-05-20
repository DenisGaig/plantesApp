import { useEffect, useState } from "react";
import soilDiagnosticData from "../../../data/soilDiagnosticData.js";
import usePlantImpact from "../../../hooks/usePlantImpact";
import useSoilAnalysis from "../../../hooks/useSoilAnalysis";
// import "./CalibrationTester.scss"; // Import du fichier SCSS

const CalibrationTester = () => {
  // État pour les contextes et ensembles de test
  const [selectedContext, setSelectedContext] = useState("maraichageBio");
  const [selectedBiotope, setSelectedBiotope] = useState(null);
  const [selectedTestSet, setSelectedTestSet] = useState(null);
  const [availableBiotopes, setAvailableBiotopes] = useState([]);
  const [testSets, setTestSets] = useState({});
  const [thresholdProposals, setThresholdProposals] = useState({});
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationResults, setCalibrationResults] = useState(null);

  const [selectedBiotopeForStats, setSelectedBiotopeForStats] = useState(null);

  // Import des hooks
  const plantImpact = usePlantImpact();
  const soilAnalysis = useSoilAnalysis(
    selectedTestSet?.plants || [],
    selectedTestSet?.plants
      ? Object.fromEntries(selectedTestSet.plants.map((p) => [p.id, p.density]))
      : {},
    Object.keys(soilDiagnosticData.indicators),
    selectedContext
  );

  // Constantes pour les contextes agricoles
  const contexts = [
    { id: "maraichageBio", name: "Maraîchage Biologique" },
    { id: "grandes_cultures", name: "Grandes Cultures" },
    { id: "viticulture", name: "Viticulture" },
    { id: "arboriculture", name: "Arboriculture" },
    { id: "prairies", name: "Prairies Permanentes" },
  ];

  const MIN_PLANTS_PER_BIOTOPE = 10;

  // Critères de fertilité du sol
  const FERTILITY_CRITERIA = [
    "complexeArgiloHumique",
    "equilibreCN",
    "matiereOrganique",
    "structurePorosite",
    "vieMicrobienne",
  ];

  // Initialisation des données d'impact des plantes
  useEffect(() => {
    const fetchData = async () => {
      const calibrationData = await plantImpact.analyzeAllPlants();
      if (calibrationData) {
        setAvailableBiotopes(Object.keys(calibrationData));
        if (Object.keys(calibrationData).length > 0) {
          setSelectedBiotope(Object.keys(calibrationData)[0]);
        }
      }
    };

    fetchData();
  }, []);

  // Mise à jour des ensembles de test lorsque le biotope change
  useEffect(() => {
    if (
      selectedBiotope &&
      plantImpact.calibrationSets &&
      plantImpact.calibrationSets[selectedBiotope]
    ) {
      const biotopeData = plantImpact.calibrationSets[selectedBiotope];

      // Format pour l'interface utilisateur
      const formattedSets = {
        equilibrated: biotopeData.equilibrated,
        imbalances: Object.values(biotopeData.imbalances),
      };

      setTestSets(formattedSets);

      // Sélectionner le premier ensemble par défaut
      if (formattedSets.equilibrated && !selectedTestSet) {
        setSelectedTestSet(formattedSets.equilibrated);
      }
    }
  }, [selectedBiotope, plantImpact.calibrationSets]);

  // Déclenchement de l'analyse du sol lorsqu'un ensemble de test est sélectionné
  useEffect(() => {
    if (selectedTestSet?.plants?.length > 0) {
      // Réinitialiser l'analyse
      soilAnalysis.resetAnalysis();
      // Démarrer une nouvelle analyse
      setTimeout(() => {
        soilAnalysis.generateAnalysisResults();
      }, 100);
    }
  }, [selectedTestSet, selectedContext]);

  // Déclencher la calibration
  const startCalibration = () => {
    setIsCalibrating(true);

    // Structure pour stocker les résultats des tests par contexte
    const results = {};

    // Pour chaque contexte
    contexts.forEach((context) => {
      results[context.id] = {
        equilibratedResults: {},
        imbalanceResults: {},
      };
    });

    // Délai pour permettre l'affichage de l'état de chargement
    setTimeout(() => {
      calibratePlagesAndThresholds();
    }, 100);
  };

  // Fonction principale de calibration
  const calibratePlagesAndThresholds = () => {
    try {
      // Résultats pour les plages de tous les contextes
      const allContextRanges = {};
      const criteriaThresholds = {};

      // Pour chaque critère de fertilité
      Object.keys(soilDiagnosticData.formules).forEach((criterion) => {
        criteriaThresholds[criterion] = {
          deficit: { leger: 0, modere: 0 },
          exces: { leger: 0, modere: 0 },
        };

        // Pour chaque contexte agricole
        contexts.forEach((context) => {
          if (!allContextRanges[context.id]) {
            allContextRanges[context.id] = {};
          }

          // Tests pour les ensembles équilibrés
          let equilibriumValues = [];

          // Tests pour les ensembles de déséquilibre (excès et déficit)
          let excessValues = [];
          let deficitValues = [];

          // Simuler l'analyse pour chaque ensemble de test
          // Note: Dans une implémentation réelle, ces valeurs proviendraient de tests multiples
          // Ici nous utilisons des approximations basées sur l'ensemble sélectionné et le contexte

          // Pour l'équilibre: basé sur les plantes équilibrantes
          const baseValue = Math.random() * 0.2 + 0.4; // Entre 0.4 et 0.6 comme base
          const contextModifier = {
            maraichageBio: 1.0,
            grandes_cultures: 0.9,
            viticulture: 1.1,
            arboriculture: 1.05,
            prairies: 0.95,
          };

          // Simuler des valeurs d'équilibre avec une certaine variation
          for (let i = 0; i < 5; i++) {
            const variation = Math.random() * 0.3 - 0.15; // Variation de ±0.15
            equilibriumValues.push(
              baseValue * contextModifier[context.id] + variation
            );
          }

          // Simuler des valeurs d'excès avec une variation plus grande
          for (let i = 0; i < 3; i++) {
            const excessBase = baseValue * 1.8; // Valeur d'excès ~80% au-dessus de la base
            const variation = Math.random() * 0.5; // Variation positive uniquement
            excessValues.push(excessBase + variation);
          }

          // Simuler des valeurs de déficit
          for (let i = 0; i < 3; i++) {
            const deficitBase = baseValue * 0.3; // Valeur de déficit ~70% en dessous de la base
            const variation = Math.random() * 0.2; // Variation positive uniquement
            deficitValues.push(deficitBase + variation);
          }

          // Calculer les moyennes pour définir les plages
          const avgEquilibrium =
            equilibriumValues.reduce((sum, val) => sum + val, 0) /
            equilibriumValues.length;
          const stdDevEquilibrium = Math.sqrt(
            equilibriumValues.reduce(
              (sum, val) => sum + Math.pow(val - avgEquilibrium, 2),
              0
            ) / equilibriumValues.length
          );

          // Définir les plages min/max pour ce critère et ce contexte
          allContextRanges[context.id][criterion] = {
            min: Math.max(0, avgEquilibrium - stdDevEquilibrium),
            max: avgEquilibrium + stdDevEquilibrium,
            optimal: avgEquilibrium,
            description: `Plage optimale pour ${criterion} en ${context.id}`,
          };

          // Calculer les seuils de déficit et d'excès
          // Note: Nous accumulons ces valeurs pour calculer une moyenne globale ensuite
          const avgDeficit =
            deficitValues.reduce((sum, val) => sum + val, 0) /
            deficitValues.length;
          const distanceToMinimum =
            allContextRanges[context.id][criterion].min - avgDeficit;

          criteriaThresholds[criterion].deficit.leger +=
            distanceToMinimum * 0.3;
          criteriaThresholds[criterion].deficit.modere +=
            distanceToMinimum * 0.6;

          const avgExcess =
            excessValues.reduce((sum, val) => sum + val, 0) /
            excessValues.length;
          const distanceToMaximum =
            avgExcess - allContextRanges[context.id][criterion].max;

          criteriaThresholds[criterion].exces.leger += distanceToMaximum * 0.3;
          criteriaThresholds[criterion].exces.modere += distanceToMaximum * 0.6;
        });

        // Calculer les moyennes des seuils sur tous les contextes
        criteriaThresholds[criterion].deficit.leger /= contexts.length;
        criteriaThresholds[criterion].deficit.modere /= contexts.length;
        criteriaThresholds[criterion].exces.leger /= contexts.length;
        criteriaThresholds[criterion].exces.modere /= contexts.length;
      });

      // Mettre à jour l'état avec les résultats de calibration
      setCalibrationResults({
        contextRanges: allContextRanges,
        thresholds: criteriaThresholds,
      });

      // Générer les propositions de modification pour soilDiagnosticData.js
      generateThresholdProposals(allContextRanges, criteriaThresholds);
    } catch (error) {
      console.error("Erreur lors de la calibration:", error);
    } finally {
      setIsCalibrating(false);
    }
  };

  // Générer les propositions de modification pour le fichier soilDiagnosticData.js
  const generateThresholdProposals = (contextRanges, thresholds) => {
    // Format pour le code JavaScript à insérer dans soilDiagnosticData.js
    const plagesOptimalesCode = `// Plages optimales par contexte agricole
export const plagesOptimales = ${JSON.stringify(contextRanges, null, 2)};`;

    const seuilsEcartsCode = `// Seuils pour les écarts (déficit et excès)
export const seuilsEcarts = ${JSON.stringify(thresholds, null, 2)};`;

    setThresholdProposals({
      plagesOptimalesCode,
      seuilsEcartsCode,
    });
  };

  // Exporter les résultats de calibration
  const exportCalibrationResults = () => {
    if (!calibrationResults) return;

    const dataStr = JSON.stringify(calibrationResults, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "soil_calibration_results.json");
    linkElement.click();
  };

  // Visualiser les résultats d'analyse du sol pour l'ensemble de test courant
  const renderSoilAnalysisResults = () => {
    if (!soilAnalysis.results) return null;

    return (
      <div className="analysis-results">
        <h3 className="analysis-results__title">
          Résultats de l'analyse pour l'ensemble de test actuel
        </h3>

        <table className="analysis-results__table">
          <thead>
            <tr>
              <th className="analysis-results__header">Critère</th>
              <th className="analysis-results__header">Valeur</th>
              <th className="analysis-results__header">Interprétation</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(soilAnalysis.results.indicators).map((criterion) => (
              <tr key={criterion} className="analysis-results__row">
                <td className="analysis-results__cell">{criterion}</td>
                <td className="analysis-results__cell">
                  {soilAnalysis.results.indicators[criterion].value.toFixed(2)}
                </td>
                <td className="analysis-results__cell">
                  {soilAnalysis.results.indicators[criterion].interpretation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Affichage des biotopes disponibles
  const renderBiotopesSelector = () => {
    if (availableBiotopes.length === 0) {
      return (
        <p className="biotopes-selector__loading">Chargement des biotopes...</p>
      );
    }

    return (
      <div className="biotopes-selector">
        <label className="biotopes-selector__label">
          Sélectionner un biotope:
        </label>
        <select
          className="biotopes-selector__select"
          value={selectedBiotope || ""}
          onChange={(e) => setSelectedBiotope(e.target.value)}
        >
          {availableBiotopes.map((biotope) => (
            <option key={biotope} value={biotope}>
              {biotope}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Affichage des ensembles de test disponibles pour le biotope sélectionné
  const renderTestSetsSelector = () => {
    if (!selectedBiotope || !testSets.equilibrated) {
      return (
        <p className="test-sets-selector__loading">
          Aucun ensemble de test disponible
        </p>
      );
    }

    return (
      <div className="test-sets-selector">
        <h3 className="test-sets-selector__title">
          Ensembles de test disponibles
        </h3>

        <div className="test-sets-selector__grid">
          {/* Ensemble équilibré */}
          <div
            className={`test-sets-selector__item ${
              selectedTestSet?.name === testSets.equilibrated.name
                ? "test-sets-selector__item--selected"
                : ""
            }`}
            onClick={() => setSelectedTestSet(testSets.equilibrated)}
          >
            <h4 className="test-sets-selector__item-title">
              {testSets.equilibrated.name}
            </h4>
            <p className="test-sets-selector__item-description">
              {testSets.equilibrated.description}
            </p>
            <p className="test-sets-selector__item-plants">
              {testSets.equilibrated.plants.length} plantes
            </p>
          </div>

          {/* Ensembles de déséquilibre */}
          {testSets.imbalances &&
            testSets.imbalances.map((set) => (
              <div
                key={set.name}
                className={`test-sets-selector__item ${
                  selectedTestSet?.name === set.name
                    ? "test-sets-selector__item--selected"
                    : ""
                }`}
                onClick={() => setSelectedTestSet(set)}
              >
                <h4 className="test-sets-selector__item-title">{set.name}</h4>
                <p className="test-sets-selector__item-description">
                  {set.description}
                </p>
                <p className="test-sets-selector__item-plants">
                  {set.plants.length} plantes
                </p>
              </div>
            ))}
        </div>
      </div>
    );
  };

  // Affichage des détails de l'ensemble de test sélectionné
  const renderSelectedTestSetDetails = () => {
    if (!selectedTestSet) return null;

    return (
      <div className="selected-test-set-details">
        <h3 className="selected-test-set-details__title">
          Détails de l'ensemble: {selectedTestSet.name}
        </h3>

        <table className="selected-test-set-details__table">
          <thead>
            <tr>
              <th className="selected-test-set-details__header">Plante</th>
              <th className="selected-test-set-details__header">Nom commun</th>
              <th className="selected-test-set-details__header">Densité</th>
            </tr>
          </thead>
          <tbody>
            {selectedTestSet.plants.map((plant) => (
              <tr key={plant.id} className="selected-test-set-details__row">
                <td className="selected-test-set-details__cell italic">
                  {Array.isArray(plant.scientificName)
                    ? plant.scientificName[0]
                    : plant.scientificName}
                </td>
                <td className="selected-test-set-details__cell">
                  {Array.isArray(plant.commonName)
                    ? plant.commonName[0]
                    : plant.commonName}
                </td>
                <td className="selected-test-set-details__cell">
                  {plant.density}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Affichage du contexte agricole
  const renderContextSelector = () => {
    return (
      <div className="context-selector">
        <label className="context-selector__label">Contexte agricole:</label>
        <select
          className="context-selector__select"
          value={selectedContext}
          onChange={(e) => setSelectedContext(e.target.value)}
        >
          {contexts.map((context) => (
            <option key={context.id} value={context.id}>
              {context.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Affichage des résultats de calibration
  const renderCalibrationResults = () => {
    if (!calibrationResults) return null;

    return (
      <div className="calibration-results">
        <h3 className="calibration-results__title">
          Résultats de la calibration
        </h3>

        <div className="calibration-results__grid">
          {/* Plages optimales */}
          <div className="calibration-results__optimal-ranges">
            <h4 className="calibration-results__optimal-ranges-title">
              Plages optimales par contexte
            </h4>

            {Object.keys(calibrationResults.contextRanges).map((contextId) => (
              <details
                key={contextId}
                className="calibration-results__optimal-ranges-details"
              >
                <summary className="calibration-results__optimal-ranges-summary">
                  {contexts.find((c) => c.id === contextId)?.name || contextId}
                </summary>
                <div className="calibration-results__optimal-ranges-content">
                  {Object.entries(
                    calibrationResults.contextRanges[contextId]
                  ).map(([criterion, range]) => (
                    <div
                      key={criterion}
                      className="calibration-results__optimal-ranges-item"
                    >
                      <p className="calibration-results__optimal-ranges-criterion">
                        {criterion}
                      </p>
                      <p className="calibration-results__optimal-ranges-values">
                        Min: {range.min.toFixed(2)} | Optimal:{" "}
                        {range.optimal.toFixed(2)} | Max: {range.max.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>

          {/* Seuils des écarts */}
          <div className="calibration-results__thresholds">
            <h4 className="calibration-results__thresholds-title">
              Seuils pour les écarts
            </h4>

            {Object.entries(calibrationResults.thresholds).map(
              ([criterion, thresholds]) => (
                <details
                  key={criterion}
                  className="calibration-results__thresholds-details"
                >
                  <summary className="calibration-results__thresholds-summary">
                    {criterion}
                  </summary>
                  <div className="calibration-results__thresholds-content">
                    <div className="calibration-results__thresholds-deficit">
                      <p className="calibration-results__thresholds-deficit-title">
                        Déficit
                      </p>
                      <p className="calibration-results__thresholds-deficit-value">
                        Léger: {thresholds.deficit.leger.toFixed(2)}
                      </p>
                      <p className="calibration-results__thresholds-deficit-value">
                        Modéré: {thresholds.deficit.modere.toFixed(2)}
                      </p>
                    </div>
                    <div className="calibration-results__thresholds-excess">
                      <p className="calibration-results__thresholds-excess-title">
                        Excès
                      </p>
                      <p className="calibration-results__thresholds-excess-value">
                        Léger: {thresholds.exces.leger.toFixed(2)}
                      </p>
                      <p className="calibration-results__thresholds-excess-value">
                        Modéré: {thresholds.exces.modere.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </details>
              )
            )}
          </div>
        </div>

        <div className="calibration-results__code">
          <h4 className="calibration-results__code-title">
            Code à utiliser dans soilDiagnosticData.js
          </h4>

          <div className="calibration-results__code-block">
            <pre className="calibration-results__code-pre">
              {thresholdProposals.plagesOptimalesCode}
            </pre>
          </div>

          <div className="calibration-results__code-block">
            <pre className="calibration-results__code-pre">
              {thresholdProposals.seuilsEcartsCode}
            </pre>
          </div>

          <button
            className="calibration-results__export-button"
            onClick={exportCalibrationResults}
          >
            Exporter les résultats
          </button>
        </div>
      </div>
    );
  };

  // Affichage des résultats des stats des biotopes
  const renderBiotopeStats = (biotopeStats) => {
    if (!biotopeStats || !selectedBiotopeForStats) return null;

    const data = biotopeStats[selectedBiotopeForStats];
    if (!data || data.plants.length < MIN_PLANTS_PER_BIOTOPE) return null;

    return (
      <div className="biotope-stats">
        {/* <div key={biotope}> */}
        <h3>
          {selectedBiotopeForStats} (n={data.plants.length})
          {/* {biotope} (n={data.plants.length}) */}
        </h3>
        <table>
          <thead>
            <tr>
              <th>Critère</th>
              <th>Moyenne</th>
              <th>Écart-type</th>
              <th>Seuil bas (&lt;10 %)</th>
              <th>Seuil moyen (10 - 90 %)</th>
              <th>Seuil haut (&gt;90 %)</th>
            </tr>
          </thead>
          <tbody>
            {FERTILITY_CRITERIA.map((criterion) => (
              <tr key={criterion}>
                <td>{criterion}</td>
                <td>{data.criteria[criterion].avg.toFixed(2)}</td>
                <td>{data.criteria[criterion].stdDev.toFixed(2)}</td>
                <td>{data.criteria[criterion].percentiles.p10.toFixed(2)}</td>
                <td>{data.criteria[criterion].percentiles.p50.toFixed(2)}</td>
                <td>{data.criteria[criterion].percentiles.p90.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getColorForImpact = (impact, p10, p50, p90) => {
    if (impact < p10) return "red";
    if (impact < p50) return "orange";
    if (impact < p90) return "lightgreen";
    if (impact > p90) return "darkgreen";
    return "yellow";
  };

  const renderClassifiedPlantsByImpact = (classifiedPlants, biotopeStats) => {
    if (!classifiedPlants) return null;
    const data = classifiedPlants[selectedBiotopeForStats];
    const dataStat = biotopeStats[selectedBiotopeForStats];
    console.log(
      "Render classified - selected Biotope",
      selectedBiotopeForStats,
      data
    );
    return (
      <div className="classified-plants">
        <h3>
          Plantes équilibrées par impact - Total: {data?.equilibrated.length}
        </h3>
        {selectedBiotopeForStats && (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Plantes</th>
                  <th>CAH</th>
                  <th>CN</th>
                  <th>MO</th>
                  <th>StPo</th>
                  <th>MB</th>
                </tr>
              </thead>
              <tbody>
                {data.equilibrated.map((plant, index) => (
                  <tr key={index}>
                    <td>{plant.scientificName}</td>
                    {FERTILITY_CRITERIA.map((criterion) => (
                      <td
                        key={criterion}
                        style={{
                          backgroundColor: getColorForImpact(
                            plant.compositeImpact[criterion],
                            dataStat.criteria[criterion].percentiles.p10,
                            dataStat.criteria[criterion].percentiles.p50,
                            dataStat.criteria[criterion].percentiles.p90
                          ),
                        }}
                      >
                        {plant.compositeImpact[criterion].toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderBiotopeSelector = (biotopeStats) => {
    if (!biotopeStats) return null;

    return (
      <div className="biotope-selector">
        <label className="biotope-selector__label">
          Sélectionner un biotope pour les statistiques:
        </label>
        <select
          className="biotope-selector__select"
          value={selectedBiotopeForStats || ""}
          onChange={(e) => setSelectedBiotopeForStats(e.target.value)}
        >
          <option value="">Sélectionner un biotope</option>
          {Object.entries(biotopeStats)
            .filter(
              ([_, stats]) => stats.plants.length >= MIN_PLANTS_PER_BIOTOPE
            )
            .map(([biotope]) => (
              <option key={biotope} value={biotope}>
                {biotope}
              </option>
            ))}
        </select>
      </div>
    );
  };

  return (
    <div className="calibration-tester">
      {renderBiotopeSelector(plantImpact.biotopeStats)}
      {renderBiotopeStats(plantImpact.biotopeStats)}
      {renderClassifiedPlantsByImpact(
        plantImpact.referenceGroups,
        plantImpact.biotopeStats
      )}
      <h1 className="calibration-tester__title">
        Calibration des plages et seuils d'interprétation
      </h1>

      <div className="calibration-tester__grid">
        <div className="calibration-tester__config">
          <h2 className="calibration-tester__config-title">Configuration</h2>

          {renderContextSelector()}
          {renderBiotopesSelector()}

          <div className="calibration-tester__calibrate-button-container">
            <button
              className="calibration-tester__calibrate-button"
              onClick={startCalibration}
              disabled={isCalibrating || !selectedBiotope}
            >
              {isCalibrating
                ? "Calibration en cours..."
                : "Lancer la calibration"}
            </button>
          </div>
        </div>

        <div className="calibration-tester__test-sets">
          <h2 className="calibration-tester__test-sets-title">
            Ensembles de test
          </h2>

          {renderTestSetsSelector()}
          {renderSelectedTestSetDetails()}
          {renderSoilAnalysisResults()}
        </div>
      </div>

      {renderCalibrationResults()}
    </div>
  );
};

export default CalibrationTester;
