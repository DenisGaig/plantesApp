import { useEffect, useState } from "react";
import soilDiagnosticData from "../../../data/soilDiagnosticData.js";
import usePlantImpact from "../../../hooks/usePlantImpact";
import useSoilAnalysis from "../../../hooks/useSoilAnalysis";
// import "./CalibrationTester.scss"; // Import du fichier SCSS
import {
  average,
  calculatePercentiles,
  standardDeviation,
} from "../../../utils.ts";

const CalibrationTester = () => {
  // État pour les contextes et ensembles de test
  const [mode, setMode] = useState("contexte"); // 'contexte' ou 'biotope'
  const [selectedContext, setSelectedContext] = useState("maraichageBio");
  const [selectedBiotope, setSelectedBiotope] = useState(null);
  const [selectedTestSet, setSelectedTestSet] = useState(null);
  const [availableBiotopes, setAvailableBiotopes] = useState([]);
  // const [testSets, setTestSets] = useState({});
  const [thresholdProposals, setThresholdProposals] = useState({});
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationResults, setCalibrationResults] = useState(null);

  // États supplémentaires
  const [calibrationStats, setCalibrationStats] = useState(null);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [numberOfTests, setNumberOfTests] = useState(10);

  const [selectedBiotopeForStats, setSelectedBiotopeForStats] = useState(null);

  // Import des hooks
  const plantImpact = usePlantImpact();
  // const soilAnalysis = useSoilAnalysis(
  //   selectedTestSet?.plants || [],
  //   selectedTestSet?.plants
  //     ? Object.fromEntries(selectedTestSet.plants.map((p) => [p.id, p.density]))
  //     : {},
  //   Object.keys(soilDiagnosticData.indicators),
  //   selectedContext,
  //   true
  // );
  const soilAnalysis = useSoilAnalysis(
    [],
    {},
    Object.keys(soilDiagnosticData.indicators),
    selectedContext,
    true
  );

  // Constantes pour les contextes agricoles
  const contexts = [
    { id: "maraichageBio", name: "Maraîchage Biologique" },
    { id: "jardinage", name: "Jardins" },
    { id: "grandesCultures", name: "Grandes Cultures" },
    { id: "prairiesAgricoles", name: "Prairies Permanentes" },
    { id: "viticulture", name: "Viticulture" },
    { id: "arboriculture", name: "Arboriculture" },
    { id: "agroforesterie", name: "Agroforesterie" },
    { id: "permaculture", name: "Permaculture" },
  ];

  // Contextes agricoles considérés
  const agricultureContexts = [
    { id: "maraichageBio", biotopes: ["maraîchages"] },
    { id: "jardinage", biotopes: ["jardins"] },
    { id: "grandesCultures", biotopes: ["cultures"] },
    { id: "prairiesAgricoles", biotopes: ["prairies"] },
    { id: "viticulture", biotopes: ["vignes"] },
    { id: "arboriculture", biotopes: ["vergers"] },
    { id: "agroforesterie", biotopes: ["haies", "cultures", "prairies"] },
    { id: "permaculture", biotopes: ["jardins", "maraîchages", "vergers"] },
  ];

  // Constantes pour les contextes agricoles
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
    const fetchData = () => {
      const calibrationData = plantImpact.analyzeAllPlants();

      if (calibrationData) {
        // Filtrer pour ne garder que les biotopes
        const biotopes = Object.keys(calibrationData).filter(
          (key) => !contexts.some((context) => context.id === key)
        );
        setAvailableBiotopes(biotopes);

        if (biotopes.length > 0) {
          setSelectedBiotope(biotopes[0]);
        }

        console.log("Nouvelle calibration :", calibrationData);
      }
    };

    fetchData();
  }, []);

  // ------ Partie: Génération des tests pour calibration ------

  // 1. Génère un ensemble de test aléatoire équilibré
  const getRandomTestSet = (calibrationSets, context, biotope) => {
    const { equilibrated, imbalances } =
      calibrationSets[mode === "contexte" ? context : biotope] || {};

    if (!equilibrated) {
      console.log("Aucun ensemble équilibré trouvé pour ce " + mode);
      return null;
    }

    // Fonction pour mélanger un tableau
    const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

    // Sélection aléatoire de 7 plantes équilibrées et 4 plantes déséquilibrées (2 excès et 2 déficits)

    const selectedEquilibratedPlants = shuffleArray(equilibrated.plants).slice(
      0,
      7
    );

    // Initialiser les tableaux pour les plantes en excès et en déficit
    const excessPlants = [];
    const deficitPlants = [];

    // Parcourir les imbalances pour séparer les plantes en excès et en déficit
    Object.values(imbalances).forEach((imbalance) => {
      if (imbalance.name.includes("Déficit")) {
        deficitPlants.push(...imbalance.plants);
      } else if (imbalance.name.includes("Excès")) {
        excessPlants.push(...imbalance.plants);
      }
    });

    // Sélection aléatoire de 2 plantes en excès et 2 en déficit
    const selectedExcessPlants = shuffleArray(excessPlants).slice(0, 2);
    const selectedDeficitPlants = shuffleArray(deficitPlants).slice(0, 2);

    // Combiner les plantes sélectionnées
    const selectedPlants = [
      ...selectedEquilibratedPlants,
      ...selectedExcessPlants,
      ...selectedDeficitPlants,
    ];

    // Construction synchronisée des densités
    const densities = selectedPlants.reduce(
      (acc, plant) => ({
        ...acc,
        [plant.id]: plant.density, // Garantit que chaque plante a sa densité correspondante
      }),
      {}
    );

    console.log("Start generating random test set ...");
    console.log("Selected plants:", selectedPlants);
    console.log("Densities:", densities);
    console.log("End generating random test set ...");

    return {
      name: `Test_${Date.now()}`,
      plants: selectedPlants,
      densities,
    };
  };

  // 2. Exécute un test unique
  const runSingleTest = async (testSet) => {
    // setCurrentTestSet(testSet);
    const startTime = performance.now();

    console.log(
      "Start running single test ...",
      Object.fromEntries(testSet.plants.map((p) => [p.id, p.coefficient]))
    );

    const compositesResults = await soilAnalysis.generateAnalysisResults(
      testSet.plants,
      Object.fromEntries(testSet.plants.map((p) => [p.id, p.coefficient]))
    );
    const duration = (performance.now() - startTime).toFixed(2);

    console.log("Résultats du single test:", compositesResults);

    return {
      ...testSet,
      results: compositesResults,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };
  };

  // 3. Exécute une série de tests
  const runMultipleTests = async (
    context,
    biotope,
    calibrationSets,
    numberOfTests = 10
  ) => {
    const allTestResults = [];
    for (let i = 0; i < numberOfTests; i++) {
      console.log(`Exécution du test ${i + 1}/${numberOfTests}`);

      const testSet = getRandomTestSet(calibrationSets, context, biotope);
      if (!testSet) {
        console.error("Hook - Failed to generate test", i + 1);
        continue;
      }

      const result = await runSingleTest(testSet);
      allTestResults.push(result);
      // setTestSeries((prev) => [...prev, result]);
    }
    return allTestResults;
  };

  // 4. Calcule les statistiques
  const calculateStatistics = (results) => {
    console.log("Calcul des statistiques pour:", results);

    return FERTILITY_CRITERIA.reduce((acc, criterion) => {
      const values = results.map((r) => r.results[criterion]).filter(Boolean);
      if (values.length === 0) return acc;

      // Calcul des percentiles d'abord
      const percentiles = calculatePercentiles(values, [10, 20, 50, 80, 90]);
      const stdDev = standardDeviation(values);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const meanValue = average(values);

      const medianValue = percentiles.p50;

      // Diviser les valeurs en deux groupes : Déficit et Excès
      const deficitValues = values.filter((v) => v <= medianValue);
      const excessValues = values.filter((v) => v >= medianValue);
      const stdDevDeficit = standardDeviation(deficitValues);
      const stdDevExcess = standardDeviation(excessValues);

      acc[criterion] = {
        mean: meanValue,
        stdDev: stdDev,
        min: minValue,
        max: maxValue,
        percentiles: percentiles,
        sampleSize: values.length,
        // Proposition de plages optimales basées sur les percentiles
        suggestedOptimalRange: {
          min: Number(percentiles.p10.toFixed(2)),
          max: Number(percentiles.p90.toFixed(2)),
        },
        // Proposition de seuils d'écart basés sur l'écart-type
        suggestedThresholds: {
          deficit: {
            leger: Number((stdDevDeficit * 0.5).toFixed(2)),
            modere: Number((stdDevDeficit * 1.0).toFixed(2)),
            important: Number((stdDevDeficit * 1.5).toFixed(2)),
          },
          exces: {
            leger: Number((stdDevExcess * 0.5).toFixed(2)),
            modere: Number((stdDevExcess * 1.0).toFixed(2)),
            important: Number((stdDevExcess * 1.5).toFixed(2)),
          },
        },
      };
      return acc;
    }, {});
  };

  // 5. Déclencher la calibration
  const startCalibration = async () => {
    console.log(
      "CalibrationTester - Starting calibration for " + mode + " ",
      mode === "contexte" ? selectedContext : selectedBiotope
    );

    if (!selectedContext || !selectedBiotope) {
      alert(
        `Veuillez sélectionner un ${
          mode === "contexte" ? "contexte agricole" : "biotope"
        } avant de lancer la calibration.`
      );
      return;
    }

    // Vérifier que les ensembles de calibration sont disponibles
    if (
      !plantImpact.calibrationSets ||
      !plantImpact.calibrationSets[selectedContext]
    ) {
      alert(
        `Aucun ensemble de calibration disponible pour ce ${
          mode === "contexte" ? "contexte agricole" : "biotope"
        }. Veuillez d'abord générer les groupes de référence.`
      );
      return;
    }

    try {
      setIsCalibrating(true);
      setCalibrationProgress(0);
      setCalibrationResults(null);
      setCalibrationStats(null);

      console.log(
        "CalibrationTester - Launching",
        numberOfTests,
        "tests for context or biotope:",
        mode === "contexte" ? selectedContext : selectedBiotope
      );

      // Lancer les tests multiples
      const testResults = await runMultipleTests(
        selectedContext,
        selectedBiotope,
        plantImpact.calibrationSets,
        numberOfTests
      );
      console.log("CalibrationTester - Tests terminés", testResults);

      const statistics = calculateStatistics(testResults);

      if (!statistics) {
        throw new Error("Impossible de calculer les statistiques");
      }

      console.log("CalibrationTester - Statistiques calculées:", statistics);

      setCalibrationProgress(90);
      setCalibrationStats(statistics);

      setCalibrationResults(testResults);
      // setCalibrationResults({context: selectedContext,
      // statistics: statistics,
      // testSets: tests,
      // generatedAt: new Date().toISOString(),});
      setCalibrationProgress(100);

      const proposals = generateThresholdProposals(statistics);
      setThresholdProposals(proposals);

      console.log("CalibrationTester - Calibration terminée avec succès");
    } finally {
      setIsCalibrating(false);
      setTimeout(() => {
        setCalibrationProgress(0);
      }, 2000);
    }
  };

  // 6. Générer les propositions de seuils
  const generateThresholdProposals = (statistics, context, biotope) => {
    console.log(
      "CalibrationTester - Génération des propositions de seuils pour le" + mode
    );

    const proposals = {
      context: mode === "biotope" ? biotope : context,
      generatedAt: new Date().toISOString(),
      numberOfTests: numberOfTests,
      criteria: {},
    };

    // Pour chaque critère, générer des propositions de seuils
    FERTILITY_CRITERIA.forEach((criterion) => {
      const stats = statistics[criterion];
      if (!stats) return;

      proposals.criteria[criterion] = {
        currentRange: soilDiagnosticData.plagesOptimales[context]?.[
          criterion
        ] || { min: 0, max: 10 },
        statistics: stats,
        proposedRange: {
          min: stats.suggestedOptimalRange.min,
          max: stats.suggestedOptimalRange.max,
          description: `Plage optimale basée sur les percentiles 10-90 (${numberOfTests} tests)`,
        },
        proposedThresholds: {
          deficit: stats.suggestedThresholds.deficit,
          exces: stats.suggestedThresholds.exces,
        },
        // Comparaison avec les valeurs actuelles
        comparison: {
          rangeShift: {
            min:
              stats.suggestedOptimalRange.min -
              (soilDiagnosticData.plagesOptimales[context]?.[criterion]?.min ||
                0),
            max:
              stats.suggestedOptimalRange.max -
              (soilDiagnosticData.plagesOptimales[context]?.[criterion]?.max ||
                10),
          },
        },
      };
    });
    return proposals;
  };

  // -------- Configuration et affichage des résultats --------
  /**
   * Fonction pour configurer le nombre de tests
   */
  const renderTestConfiguration = () => {
    return (
      <div className="calibration-tester__test-config">
        <h3>Configuration des tests</h3>
        <div className="calibration-tester__test-config-item">
          <label htmlFor="numberOfTests">Nombre de tests:</label>
          <select
            id="numberOfTests"
            value={numberOfTests}
            onChange={(e) => setNumberOfTests(parseInt(e.target.value))}
            disabled={isCalibrating}
          >
            <option value={5}>5 tests (rapide)</option>
            <option value={10}>10 tests (recommandé)</option>
            <option value={20}>20 tests (précis)</option>
            <option value={50}>50 tests (très précis)</option>
          </select>
        </div>
        {calibrationProgress > 0 && calibrationProgress < 100 && (
          <div
            className="calibration-tester__progress"
            data-stage={
              calibrationProgress < 20
                ? "generating"
                : calibrationProgress < 80
                ? "analyzing"
                : "calculating"
            }
          >
            <div className="calibration-tester__progress-bar">
              <div
                className="calibration-tester__progress-fill"
                style={{ width: `${calibrationProgress}%` }}
              ></div>
            </div>
            <span className="calibration-tester__progress-text">
              {calibrationProgress}% -{" "}
              {calibrationProgress < 20
                ? "Génération des tests..."
                : calibrationProgress < 80
                ? "Analyse en cours..."
                : "Calcul des statistiques..."}
            </span>
          </div>
        )}
      </div>
    );
  };

  /**
   * Fonction pour afficher les résultats de calibration
   */
  const renderCalibrationStatistics = () => {
    if (!calibrationStats) return null;

    return (
      <div className="calibration-tester__statistics">
        <h2>Résultats de calibration</h2>
        <div className="calibration-tester__statistics-summary">
          <p>
            <strong>{mode === "contexte" ? "Contexte:" : "Biotope:"}</strong>{" "}
            {mode === "contexte"
              ? contexts.find((c) => c.id === selectedContext)?.name
              : selectedBiotope}
          </p>
          <p>
            <strong>Nombre de tests:</strong> {numberOfTests}
          </p>
          <p>
            <strong>Date:</strong> {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="calibration-tester__criteria-stats">
          {FERTILITY_CRITERIA.map((criterion) => {
            const stats = calibrationStats[criterion];
            if (!stats) return null;

            return (
              <div
                key={criterion}
                className="calibration-tester__criterion-stats"
              >
                <h3>{getCriterionDisplayName(criterion)}</h3>
                <div className="calibration-tester__stats-grid">
                  <div className="calibration-tester__stats-basic">
                    <h4>Statistiques descriptives</h4>
                    <p>
                      <strong>Moyenne:</strong> {stats.mean.toFixed(2)}
                    </p>
                    <p>
                      <strong>Écart-type:</strong> {stats.stdDev.toFixed(2)}
                    </p>
                    <p>
                      <strong>Min - Max:</strong> {stats.min.toFixed(2)} -{" "}
                      {stats.max.toFixed(2)}
                    </p>
                  </div>
                  <div className="calibration-tester__stats-percentiles">
                    <h4>Percentiles</h4>
                    <p>
                      <strong>P10:</strong> {stats.percentiles.p10.toFixed(2)}
                    </p>
                    <p>
                      <strong>P50 (médiane):</strong>{" "}
                      {stats.percentiles.p50.toFixed(2)}
                    </p>
                    <p>
                      <strong>P90:</strong> {stats.percentiles.p90.toFixed(2)}
                    </p>
                  </div>
                  <div className="calibration-tester__stats-proposals">
                    <h4>Propositions</h4>
                    <p>
                      <strong>Plage optimale:</strong>{" "}
                      {stats.suggestedOptimalRange.min} -{" "}
                      {stats.suggestedOptimalRange.max}
                    </p>
                    <p>
                      <strong>Seuil déficit modéré:</strong>{" "}
                      {stats.suggestedThresholds.deficit.modere}
                    </p>
                    <p>
                      <strong>Seuil excès modéré:</strong>{" "}
                      {stats.suggestedThresholds.exces.modere}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Fonction utilitaire pour obtenir le nom d'affichage d'un critère
   */
  const getCriterionDisplayName = (criterion) => {
    const names = {
      vieMicrobienne: "Vie Microbienne Aérobie",
      complexeArgiloHumique: "Complexe Argilo-Humique",
      matiereOrganique: "Matière Organique",
      equilibreCN: "Équilibre C/N",
      structurePorosite: "Structure et Porosité",
    };
    return names[criterion] || criterion;
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

  const renderCalibrationResults = () => {
    if (!calibrationResults) return null;
    console.log("Rendering calibration results", calibrationResults);
    return (
      <div className="calibration-results">
        <h3 className="calibration-results__title">Résultats des tests</h3>
        {calibrationResults.map((result, index) => (
          <div key={index} className="calibration-results__item">
            <details key={index}>
              <summary>{result.name}</summary>
              <div>
                {result.plants.map((plant) => (
                  <li>
                    {plant.scientificName}
                    {plant.commonName && ` (${plant.commonName})`}
                    {plant.density && ` - Densité: ${plant.density}`}
                  </li>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>
    );
  };

  // Affichage des résultats de seuils de calibration
  const renderCalibrationThresholdResults = () => {
    if (!calibrationResults) return null;

    console.log("Rendering calibration results", calibrationResults);

    return (
      <div className="calibration-results">
        <h3 className="calibration-results__title">
          Résultats de la calibration
        </h3>

        <div className="calibration-results__grid">
          {/* Plages optimales */}
          <div className="calibration-results__optimal-ranges">
            <h4 className="calibration-results__optimal-ranges-title">
              Plages optimales pour le contexte sélectionné
            </h4>
            {Object.keys(thresholdProposals.criteria).map((criterion) => (
              <details key={criterion}>
                <summary>{criterion}</summary>
                <div
                  key={criterion}
                  className="calibration-results__optimal-ranges-item"
                >
                  <p className="calibration-results__optimal-ranges-criterion">
                    Plage:{" "}
                    {thresholdProposals.criteria[criterion].proposedRange.min}
                    {" : "}
                    {thresholdProposals.criteria[criterion].proposedRange.max}
                  </p>
                  <p className="calibration-results__optimal-ranges-value"></p>
                </div>
              </details>
            ))}
          </div>

          {/* Seuils des écarts */}
          <div className="calibration-results__thresholds">
            <h4 className="calibration-results__thresholds-title">
              Seuils pour les écarts
            </h4>
            {Object.keys(thresholdProposals.criteria).map((criterion) => (
              <details key={criterion}>
                <summary>{criterion}</summary>

                <div className="calibration-results__thresholds-content">
                  <div className="calibration-results__thresholds-deficit">
                    <p className="calibration-results__thresholds-deficit-title">
                      Déficit
                    </p>
                    <p className="calibration-results__thresholds-deficit-value">
                      Léger:{" "}
                      {thresholdProposals.criteria[
                        criterion
                      ].proposedThresholds.deficit.leger.toFixed(2)}
                      <br />
                      Modéré:{" "}
                      {thresholdProposals.criteria[
                        criterion
                      ].proposedThresholds.deficit.modere.toFixed(2)}
                      <br />
                      Important:{" "}
                      {thresholdProposals.criteria[
                        criterion
                      ].proposedThresholds.deficit.important.toFixed(2)}
                    </p>
                  </div>
                  <div className="calibration-results__thresholds-excess">
                    <p className="calibration-results__thresholds-excess-title">
                      Excès
                    </p>
                    <p className="calibration-results__thresholds-excess-value">
                      Léger:{" "}
                      {thresholdProposals.criteria[
                        criterion
                      ].proposedThresholds.exces.leger.toFixed(2)}
                      <br />
                      Modéré:{" "}
                      {thresholdProposals.criteria[
                        criterion
                      ].proposedThresholds.exces.modere.toFixed(2)}
                      <br />
                      Important:{" "}
                      {thresholdProposals.criteria[
                        criterion
                      ].proposedThresholds.exces.important.toFixed(2)}
                    </p>
                  </div>
                </div>
              </details>
            ))}
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

  // --------------------------------------------------------
  // ------ Affichage des résultats des stats unitaires des biotopes

  // Rend le sélecteur de biotopes, bridé par un nombre minimum de plantes, à partir des statistiques des biotopes
  const renderBiotopeSelector = (biotopeStats) => {
    if (!biotopeStats) return null;
    // console.log(
    //   "Rendering biotope selector with stats:",
    //   Object.keys(biotopeStats)
    // );

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

  const renderModeSelector = () => (
    <div className="mode-selector">
      <h3>Type de calibration :</h3>
      <button
        className={`mode-selector__button ${
          mode === "contexte" ? "active" : ""
        }`}
        onClick={() => setMode("contexte")}
      >
        Par Contexte Agricole
      </button>
      <button
        className={`mode-selector__button ${
          mode === "biotope" ? "active" : ""
        }`}
        onClick={() => setMode("biotope")}
      >
        Par Biotope
      </button>
    </div>
  );

  // 2. Affiche le sélecteur approprié
  const renderDynamicSelector = () => {
    switch (mode) {
      case "contexte":
        return renderContextSelector();
      case "biotope":
        return renderBiotopesSelector();
      default:
        return null;
    }
  };

  // 3. Indicateur de cible (version améliorée)
  const renderTargetIndicator = () => {
    const targetName =
      mode === "contexte"
        ? contexts.find((c) => c.id === selectedContext)?.name
        : selectedBiotope;

    return (
      <div className="target-indicator">
        <h3>🔎 Cible des tests :</h3>
        <div className="target-indicator__card">
          <strong>Mode :</strong>{" "}
          {mode === "contexte" ? "Contexte Agricole" : "Biotope"}
          <br />
          <strong>Element :</strong> {targetName || "Non sélectionné"}
          <br />
          {mode === "contexte" && (
            <small>
              Biotopes inclus :{" "}
              {agricultureContexts
                .find((c) => c.id === selectedContext)
                ?.biotopes.join(", ")}
            </small>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="calibration-tester">
      <div className="calibration-tester__header">
        <h1 className="calibration-tester__title">Statistiques par biotope</h1>
        {renderBiotopeSelector(plantImpact.biotopeStats)}
        {renderBiotopeStats(plantImpact.biotopeStats)}
        {renderClassifiedPlantsByImpact(
          plantImpact.referenceGroups,
          plantImpact.biotopeStats
        )}
      </div>

      <h1 className="calibration-tester__title">
        Calibration des plages et seuils d'interprétation
      </h1>

      <div className="calibration-tester__grid">
        <div className="calibration-tester__config">
          <h2 className="calibration-tester__config-title">Configuration</h2>

          {renderModeSelector()}

          {renderDynamicSelector()}
          <div className="selectors-grid">{renderTargetIndicator()}</div>

          {renderTestConfiguration()}

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
            Ensembles de tests
          </h2>
          {renderCalibrationResults()}
          {renderCalibrationThresholdResults()}
          {renderCalibrationStatistics()}
        </div>
      </div>
    </div>
  );
};

export default CalibrationTester;
