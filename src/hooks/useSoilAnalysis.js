import { useCallback, useEffect, useState } from "react";
import plantsIndicators from "../data/bioindicators_plants.json";
import soilDiagnosticData from "../data/soilDiagnosticData.js";
import { normalizeString } from "../utils.ts";

const useSoilAnalysis = (
  selectedPlants,
  selectedCoefficients,
  allColumns,
  selectedContext = "maraichageBio",
  isForCalibration = false // Nouveau paramètre pour la calibration
) => {
  const [indicatorsDatabase, setIndicatorsDatabase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [sortedColumns, setSortedColumns] = useState(null);

  // Ajouts pour l'analyse et les recommandations
  const [compositesResults, setCompositesResults] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  // Nouvel état pour le rapport détaillé
  const [detailedReport, setDetailedReport] = useState(null);

  // Nouvel état pour la calibration
  const [isCalibrating, setIsCalibrating] = useState(false);

  useEffect(() => {
    try {
      setIndicatorsDatabase(plantsIndicators);
      console.log("Hook - Bio-indicators plants bien chargés");
      setLoading(false);
      console.log("Hook - Loading set to false");
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  /**
   * Fonction de normalisation standard pour tous les critères de fertilité conçue pour être utilisée avec n'importe quel biotope
   * @param {number} rawScore  Valeur brute du score
   * @param {string} criterion Critère de fertilité
   * @param {number} totalDensity Densité totale des plantes
   * @param {number} plantCount Nombre de plantes dans le biotope
   * @returns Valeur normalisée entre 0 et 10
   */
  function normalizeScore(
    rawScore,
    criterion,
    totalDensity = null,
    plantCount = null
  ) {
    // Paramètres de normalisation par critère
    // Ces valeurs sont calibrées pour étaler les résultats sur toute l'échelle 0-10
    const normalizationParams = {
      vieMicrobienne: {
        outputMin: 0, // Valeur minimale souhaitée après normalisation
        outputMax: 10, // Valeur maximale souhaitée après normalisation
      },
      complexeArgiloHumique: {
        outputMin: 0,
        outputMax: 10,
      },
      matiereOrganique: {
        outputMin: 0,
        outputMax: 10,
      },
      structurePorosite: {
        outputMin: 0,
        outputMax: 10,
      },
      equilibreCN: {
        // Le C/N a une échelle spéciale, nous le traiterons séparément
        baseValue: 25,
        minValue: 5,
        maxValue: 40,
      },
    };

    // Cas spécial pour l'équilibre C/N (qui a son propre système d'échelle)
    if (criterion === "equilibreCN") {
      // Pas besoin de normalisation supplémentaire car déjà traité dans le hook
      return rawScore;
    }

    // Pour les autres critères, normalisation linéaire dynamique
    const params = normalizationParams[criterion];

    // Détermination dynamique des limites d'entrée en fonction du nombre de plantes et densités
    let inputMin, inputMax;

    if (totalDensity !== null && plantCount !== null) {
      // Pour les tests in-situ avec plusieurs plantes
      // La valeur maximale théorique serait la densité totale (si toutes les plantes contribuent positivement)
      // La valeur minimale théorique serait l'opposé de la densité totale (si toutes contribuent négativement)
      inputMax = totalDensity;
      inputMin = -totalDensity;
    } else {
      // Pour les tests unitaires (une seule plante)
      // On utilise la plage par défaut -2 à 2
      inputMax = 1.5;
      inputMin = -1.5;
    }

    // Application de la transformation linéaire
    // normalizedScore = (rawScore - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin
    const normalizedScore =
      ((rawScore - inputMin) * (params.outputMax - params.outputMin)) /
        (inputMax - inputMin) +
      params.outputMin;

    // S'assurer que le score est bien dans l'intervalle [outputMin, outputMax]
    return Math.max(
      params.outputMin,
      Math.min(params.outputMax, normalizedScore)
    );

    // return rawScore;

    // Formule de normalisation avec décalage, échelle et minimum
    // (rawScore + offset) * scale + minValue
    // Borne les résultats entre 0 et 10
    // const normalizedScore = Math.max(
    //   params.minValue,
    //   Math.min(10, (rawScore + params.offset) * params.scale + params.minValue)
    // );

    // return normalizedScore;
  }
  /**
   * Calcule l'équilibre C/N d'un sol à partir des valeurs de matière organique carbonée (moC) et matière organique azotée (moN).
   * @param {number} moC
   * @param {number} moN
   * @returns
   */
  const calculateEquilibreCN = (moC, moN, totalPlants = 1) => {
    // Calcul de l'écart (C - N)
    // Écart positif = plus de carbone relatif = ratio C/N plus élevé
    // Écart négatif = plus d'azote relatif = ratio C/N plus bas
    const moCNormalized = moC / totalPlants;
    const moNNormalized = moN / totalPlants;
    const ecart = moCNormalized - moNNormalized;

    // Cas particuliers : carences simultanées
    if (moCNormalized < 0 && moNNormalized < 0) {
      // Sol carencé en C ET N : ratio dégradé même si "équilibré"
      const severite = Math.abs(moCNormalized + moNNormalized) / 2; // Moyenne des carences
      const ratioDegrade = 25 - severite * 3; // Dégradation progressive
      return Math.max(
        8,
        Math.min(ratioDegrade + 15 * Math.tanh(ecart * 0.5), 40)
      );
    }
    // Transformation sigmoïde centrée sur 25 (ratio C/N idéal)
    // Formule: ratio = centre + amplitude * tanh(écart * sensibilité)
    const centre = 25; // Ratio C/N de référence (équilibré)
    const amplitude = 15; // Amplitude max (25 ± 15 = [10, 40])
    const sensibilite = 0.5; // Contrôle la pente de la courbe

    const ratio = centre + amplitude * Math.tanh(ecart * sensibilite);

    // Borner entre des valeurs réalistes
    return Math.max(8, Math.min(ratio, 40));
  };

  // Calcul des indices composites basé sur les résultats des indicateurs
  const calculateCompositeIndices = (results, selectedCoefficients) => {
    console.log("Hook - calculateCompositeIndices called");
    const composites = {};

    const totalDensity = Object.values(selectedCoefficients).reduce(
      (sum, coeff) => sum + coeff,
      0
    );
    const plantCount = Object.keys(selectedCoefficients).length;

    // console.log("Hook - Coefficients sélectionnés : ", selectedCoefficients);
    // console.log("Hook - Densité totale : ", totalDensity);
    // console.log("Hook - Nombre de plantes : ", plantCount);

    // Calcul pour chaque indice composite selon les formules définies
    Object.keys(soilDiagnosticData.formules).forEach((criterion) => {
      const formule = soilDiagnosticData.formules[criterion];
      let rawScore;

      // Fonction utilitaire pour récupérer la valeur numérique d'un indicateur
      const getNumericValue = (indicator) => {
        if (!results[indicator]) return 0;
        return results[indicator].positive - results[indicator].negative;
      };

      // Cas spécial pour l'équilibre C/N
      if (criterion === "equilibreCN") {
        const MO_C = getNumericValue("MO(C)");
        const MO_N = getNumericValue("MO(N)");

        rawScore = calculateEquilibreCN(MO_C, MO_N, plantCount);

        console.log("Hook Soil Analysis - Calcul équilibre C/N: ", rawScore);
      } else {
        // 1. Calcul standard des termes principaux pour les autres indices
        let sum = 0;
        formule.facteurs.forEach((facteur) => {
          const indicateur = facteur.indicateur;
          const coefficient = facteur.coefficient;

          // Récupérer la valeur nette de l'indicateur (positif - négatif)
          const indicateurValue = getNumericValue(indicateur);

          sum += indicateurValue * coefficient;
        });

        // 2. Gestion des interactions (cas spécial pour Nit*Al3+)
        if (formule.interactions) {
          formule.interactions.forEach((interaction) => {
            const val1 = getNumericValue(interaction.indicateurs[0]);
            const val2 = getNumericValue(interaction.indicateurs[1]);

            if (interaction.operation === "multiply") {
              sum += val1 * val2 * interaction.coefficient;
            }
            if (interaction.operation === "airWaterEffect") {
              sum +=
                0.8 * (Math.min(1, val1) - Math.max(0, val1)) -
                0.5 * Math.abs(val2) * interaction.coefficient;
            }
            if (interaction.operation === "airWaterBalance") {
              sum +=
                (1 - Math.abs(val1 - 0.5) - Math.max(0, val2)) *
                interaction.coefficient;
            }
            // Ajoutez d'autres opérations si nécessaire (ex: addition)
          });
        }

        // 3. Division finale de la somme par le diviseur défini dans la formule
        rawScore = sum / formule.diviseur;
        // console.log(`Hook - Calculated ${criterion}:`, rawScore);
        // console.log(`Hook - Formula used:`, formule);
      }

      composites[criterion] = normalizeScore(
        rawScore,
        criterion,
        totalDensity,
        plantCount
      );
    });
    return composites;
  };

  // Génération des recommandations basé sur les indices composites et le contexte sélectionné
  const generateRecommendations = (composites, selectedContext) => {
    console.log("Hook - generateRecommendations called");

    const recommendations = {};
    const plagesContext = soilDiagnosticData.plagesOptimales[selectedContext];

    Object.keys(composites).forEach((indiceKey) => {
      const deficit =
        soilDiagnosticData.seuilsEcarts[selectedContext][indiceKey].deficit;
      const exces =
        soilDiagnosticData.seuilsEcarts[selectedContext][indiceKey].exces;
      const valeur = composites[indiceKey];
      const plage = plagesContext[indiceKey];

      if (!plage) {
        console.warn(`Hook - No optimal range found for ${indiceKey}`);
        return;
      }
      if (valeur < plage.min) {
        // Déficit
        const ecart = plage.min - valeur;
        let intensite = "important";

        if (ecart < deficit.leger) {
          intensite = "leger";
        } else if (ecart < deficit.modere) {
          intensite = "modere";
        }
        recommendations[indiceKey] = {
          type: "deficit",
          intensite,
          ecart,
          description: plage.description,
          recommandation:
            soilDiagnosticData.recommandations[indiceKey]?.deficit?.[
              intensite
            ] ||
            "Améliorer ce paramètre selon les pratiques agricoles adaptées.",
        };
      } else if (valeur > plage.max) {
        // Excès
        const ecart = valeur - plage.max;
        let intensite = "important";
        if (ecart < exces.leger) {
          intensite = "leger";
        } else if (ecart < exces.modere) {
          intensite = "modere";
        }
        recommendations[indiceKey] = {
          type: "exces",
          intensite,
          ecart,
          description: plage.description,
          recommandation:
            soilDiagnosticData.recommandations[indiceKey]?.exces?.[intensite] ||
            "Réduire ce paramètre selon les pratiques agricoles adaptées.",
        };
      } else {
        // Dans la plage optimale
        recommendations[indiceKey] = {
          type: "equilibre",
          ecart: 0,
          description: plage.description,
          recommandation: "Ce paramètre est dans une plage optimale.",
        };
      }
    });
    return recommendations;
  };

  // Nouvelle fonction pour générer le rapport basé sur l'analyse
  const generateDetailedReport = (
    results,
    composites,
    recommendations,
    selectedContext
  ) => {
    console.log("Hook - generateDetailedReport called");

    if (!results || !composites || !recommendations) {
      console.error("Hook - Cannot generate report, missing data");
      return null;
    }

    // Initialisation du rapport avec l'introduction
    const report = {
      introduction: soilDiagnosticData.reportTemplates.introduction,
      indicatorAnalyses: [],
      criteriaStatuses: {},
      recommendations: [],
    };

    // Analyser les indicateurs clés et leurs seuils
    const indicators = soilDiagnosticData.indicators;

    // Vérifier les indicateurs critiques
    Object.keys(indicators).forEach((indicatorKey) => {
      const indicator = indicators[indicatorKey];
      const indicatorResult = results[indicatorKey];

      if (!indicatorResult) return; // Indicateur non présent dans les résultats

      // Calculer la valeur nette de l'indicateur
      const netValue = indicatorResult.positive - indicatorResult.negative;

      // Vérifier si l'indicateur dépasse les seuils
      if (indicator.high_threshold && netValue > indicator.high_threshold) {
        // Traitement spécial pour les indicateurs importants
        if (indicatorKey === "Eau") {
          const analysisText =
            soilDiagnosticData.reportTemplates.indicatorAnalysis.engorgementEau.replace(
              "{threshold}",
              indicator.high_threshold
            );
          report.indicatorAnalyses.push({
            title: "Engorgement en Eau",
            text: analysisText,
          });
        } else if (indicatorKey === "BS") {
          const analysisText =
            soilDiagnosticData.reportTemplates.indicatorAnalysis.excesBasesSolubles.replace(
              "{threshold}",
              indicator.high_threshold
            );
          report.indicatorAnalyses.push({
            title: "Excès de Bases Solubles",
            text: analysisText,
          });
        }
      }

      if (indicator.low_threshold && netValue < indicator.low_threshold) {
        // Traitement spécial pour les indicateurs avec des seuils bas
        if (indicatorKey === "Air") {
          report.indicatorAnalyses.push({
            title: "Tassement du Sol",
            text: soilDiagnosticData.reportTemplates.indicatorAnalysis
              .tassementSol,
          });
        } else if (indicatorKey === "MOT") {
          const analysisText =
            soilDiagnosticData.reportTemplates.indicatorAnalysis.carenceMatiereOrganique.replace(
              "{threshold}",
              indicator.low_threshold
            );
          report.indicatorAnalyses.push({
            title: "Carence en Matière Organique",
            text: analysisText,
          });
        }
      }
    });

    // Générer l'état des critères de fertilité
    Object.keys(composites).forEach((criterionKey) => {
      const indexValue = composites[criterionKey];
      const recommendation = recommendations[criterionKey];
      let state, additionalInfo;

      // Déterminer l'état qualitatif
      if (recommendation.type === "deficit") {
        state =
          recommendation.intensite === "leger"
            ? "légèrement déficitaire"
            : recommendation.intensite === "modere"
            ? "modérément déficitaire"
            : "fortement déficitaire";
      } else if (recommendation.type === "exces") {
        state =
          recommendation.intensite === "leger"
            ? "légèrement excessive"
            : recommendation.intensite === "modere"
            ? "modérément excessive"
            : "fortement excessive";
      } else {
        state = "optimale";
      }

      // Générer des informations additionnelles contextuelles
      additionalInfo = "";

      // Exemple de logique pour la vie microbienne
      if (criterionKey === "vieMicrobienne") {
        if (
          report.indicatorAnalyses.some((a) => a.title === "Engorgement en Eau")
        ) {
          additionalInfo =
            "Bien que dans la plage optimale pour un " +
            selectedContext +
            ", l'engorgement en eau nécessite une attention particulière pour maintenir une activité microbienne intense.";
        } else if (
          report.indicatorAnalyses.some((a) => a.title === "Tassement du Sol")
        ) {
          additionalInfo =
            "Le tassement du sol limite les échanges gazeux nécessaires à une vie microbienne saine. Une amélioration de la structure est recommandée.";
        } else {
          additionalInfo =
            "Cette activité est essentielle à la décomposition de la matière organique et à la libération des nutriments.";
        }
      }

      // Exemple pour le complexe argilo-humique
      else if (criterionKey === "complexeArgiloHumique") {
        if (
          report.indicatorAnalyses.some((a) => a.title === "Engorgement en Eau")
        ) {
          additionalInfo =
            "Cependant, l'excès d'eau peut à terme affecter la stabilité de ce complexe. Il est crucial de surveiller et d'ajuster les pratiques de gestion de l'eau.";
        } else {
          additionalInfo =
            "Ce complexe est essentiel pour la rétention des nutriments et la structure du sol.";
        }
      }

      // Exemple pour la matière organique
      else if (criterionKey === "matiereOrganique") {
        if (
          report.indicatorAnalyses.some(
            (a) => a.title === "Carence en Matière Organique"
          )
        ) {
          additionalInfo =
            "Une augmentation de la matière organique est nécessaire pour améliorer la structure et la fertilité du sol.";
        } else if (
          report.indicatorAnalyses.some((a) => a.title === "Engorgement en Eau")
        ) {
          additionalInfo =
            "Toutefois, un engorgement prolongé pourrait entraîner une perte de cette matière organique par lessivage.";
        } else {
          additionalInfo =
            "Cette teneur favorise une bonne structure et une activité biologique équilibrée.";
        }
      }

      // Exemple pour l'équilibre C/N
      else if (criterionKey === "equilibreCN") {
        if (recommendation.type === "exces") {
          additionalInfo =
            "Cela indique un excès d'azote, ce qui peut favoriser une minéralisation trop rapide et un risque de lessivage des nitrates.";
        } else if (recommendation.type === "deficit") {
          additionalInfo =
            "Cela indique un excès de carbone, ce qui peut ralentir la minéralisation et limiter la disponibilité des nutriments.";
        } else {
          additionalInfo =
            "Cet équilibre favorise une minéralisation optimale et une bonne disponibilité des nutriments.";
        }
      }

      // Exemple pour la structure et porosité
      else if (criterionKey === "structurePorosite") {
        if (
          report.indicatorAnalyses.some((a) => a.title === "Tassement du Sol")
        ) {
          additionalInfo =
            "Améliorer l'aération et réduire le compactage sont essentiels pour restaurer une bonne porosité et favoriser les échanges gazeux.";
        } else {
          additionalInfo =
            "Cette structure favorise un bon développement racinaire et une activité biologique équilibrée.";
        }
      }

      // Compléter le template avec les valeurs calculées
      const criteriaTemplate =
        soilDiagnosticData.reportTemplates.criteriaDescriptions[criterionKey];
      let criteriaText = criteriaTemplate
        .replace("{state}", state)
        .replace("{index}", indexValue.toFixed(1))
        .replace("{additional_info}", additionalInfo);

      report.criteriaStatuses[criterionKey] = {
        title:
          criterionKey === "vieMicrobienne"
            ? "Vie Microbienne Aérobie"
            : criterionKey === "complexeArgiloHumique"
            ? "Complexe Argilo-Humique"
            : criterionKey === "matiereOrganique"
            ? "Matière Organique"
            : criterionKey === "equilibreCN"
            ? "Équilibre C/N"
            : criterionKey === "structurePorosite"
            ? "Structure et Porosité"
            : criterionKey,
        text: criteriaText,
      };
    });

    // Générer les recommandations spécifiques
    const recommendationsTemplate =
      soilDiagnosticData.reportTemplates.recommendationsList;
    const recommendationsIntro =
      soilDiagnosticData.reportTemplates.recommendationsIntro;

    // Ajouter l'introduction des recommandations
    report.recommendationsIntro = recommendationsIntro;

    // Ajouter des recommandations spécifiques basées sur l'analyse
    if (
      report.indicatorAnalyses.some((a) => a.title === "Engorgement en Eau")
    ) {
      report.recommendations.push({
        title: "Réduire l'Engorgement en Eau",
        text: recommendationsTemplate.reduceEngorgement,
      });
    }

    if (report.indicatorAnalyses.some((a) => a.title === "Tassement du Sol")) {
      report.recommendations.push({
        title: "Améliorer la Porosité",
        text: recommendationsTemplate.improvePorosity,
      });

      report.recommendations.push({
        title: "Réduire le Tassement",
        text: recommendationsTemplate.reduceCompaction,
      });
    }

    if (
      report.indicatorAnalyses.some(
        (a) => a.title === "Carence en Matière Organique"
      )
    ) {
      report.recommendations.push({
        title: "Augmenter la Matière Organique",
        text: recommendationsTemplate.increaseOrganicMatter,
      });
    }

    // Recommandation générale pour l'équilibre C/N
    if (
      recommendations.equilibreCN &&
      recommendations.equilibreCN.type !== "equilibre"
    ) {
      report.recommendations.push({
        title: "Équilibrer le C/N",
        text: recommendationsTemplate.balanceCN,
      });
    }

    // Recommandation pour l'activité biologique
    if (
      recommendations.vieMicrobienne &&
      recommendations.vieMicrobienne.type !== "equilibre"
    ) {
      report.recommendations.push({
        title: "Améliorer l'Activité Biologique",
        text: recommendationsTemplate.enhanceBiologicalActivity,
      });
    }

    return report;
  };

  const getPlantIndicatorsByScientificName = useCallback(
    (scientificName) => {
      console.log("Hook - getPlantIndicatorsByScientificName called");

      const normalizedSearchName = normalizeString(scientificName);
      console.log("Hook - Normalized search name:", normalizedSearchName);

      // Recherche d'une correspondance exacte d'abord
      let plant = indicatorsDatabase.find(
        (plant) => plant.scientificName.toLowerCase() === normalizedSearchName
      );

      // Si aucune correspondance exacte n'est trouvée, rechercher une correspondance partielle
      if (!plant) {
        plant = indicatorsDatabase.find(
          (plant) =>
            plant.scientificName.toLowerCase().includes(normalizedSearchName) ||
            normalizedSearchName.includes(plant.scientificName.toLowerCase())
        );
      }
      return plant ? plant.caracteristiques : [];
    },
    [indicatorsDatabase]
  );

  const generateAnalysisResults = (
    selectedPlants = selectedPlants,
    selectedCoefficients = selectedCoefficients
  ) => {
    setIsCalibrating(isForCalibration);
    setLoading(true);
    console.log("Hook - Génération des résultats d'analyse...");
    // Logique pour générer les résultats d'analyse
    console.log("Hook - Analyse du sol en cours...");
    // console.log("Hook - Selected plants:", selectedPlants);
    // console.log("Hook - Selected coefficients:", selectedCoefficients);

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          setError(null);

          const results = {};
          // Initialiser les résultats avec des objets pour stocker les valeurs positives et négatives
          allColumns.forEach((column) => {
            results[column] = { positive: 0, negative: 0, total: 0 };
          });

          selectedPlants.forEach((plant) => {
            const plantData = indicatorsDatabase.find(
              (p) => p.scientificName === plant.scientificName[0]
            );

            // Récupérer la densité correspondante à partir de selectedCoefficients
            const density = selectedCoefficients[plant.id] || 0;

            if (!density) {
              console.warn(
                `Hook - Densité non trouvée pour la plante ${plant.scientificName}`
              );
              return;
            }

            // console.log(
            //   "Hook - Densité de la plante",
            //   plant.scientificName,
            //   ":",
            //   density,
            //   "%"
            // );

            if (plantData && plantData.caracteristiques) {
              Object.entries(plantData.caracteristiques).forEach(
                ([column, value]) => {
                  if (!results[column]) {
                    results[column] = { positive: 0, negative: 0, total: 0 };
                  }
                  if (value === "+" || value === "+K" || value === "++") {
                    results[column].positive += density;
                  } else if (value === "-" || value === "--") {
                    results[column].negative += density;
                  }
                  results[column].total =
                    results[column].positive + results[column].negative;
                }
              );
            }
          });

          setAnalysisResults(results);

          console.log("Hook - Résultats de l'analyse:", results);

          // Calculer les indices composites
          const composites = calculateCompositeIndices(
            results,
            selectedCoefficients
          );
          setCompositesResults(composites);
          console.log("Hook - Indices composites calculés:", composites);

          // Si c'est pour la calibration, on s'arrête ici
          if (isForCalibration) {
            resolve(composites); // Retourne seulement l'essentiel pour les tests
          }
          // Générer les recommandations
          const recommendationsResults = generateRecommendations(
            composites,
            selectedContext
          );
          setRecommendations(recommendationsResults);
          console.log(
            "Hook - Recommandations générées:",
            recommendationsResults
          );

          // Générer le rapport
          const report = generateDetailedReport(
            results,
            composites,
            recommendationsResults,
            selectedContext
          );
          setDetailedReport(report);
          console.log("Hook - Rapport détaillé généré:", report);

          setShowResults(true);
          console.log("Hook - Analyse du sol terminée", results);

          // Calculer et définir sortedColumns immédiatement
          const sortedResultsColumns = allColumns
            .filter((column) => results[column].total > 0)
            .sort((a, b) => {
              const totalA = results[a].total;
              const totalB = results[b].total;
              return totalB - totalA;
            });

          setSortedColumns(sortedResultsColumns);
          console.log(
            "Hook - Colonnes triées (immédiatement après analyse):",
            sortedResultsColumns
          );
          resolve(results); // Retourne les résultats pour les tests unitaires
        } catch (err) {
          setError("Erreur lors de l'analyse du sol");
          console.error("Hook - Erreur lors de l'analyse du sol:", err);
          resolve(null); // Retourne null en cas d'erreur pour les tests unitaires
        } finally {
          setIsCalibrating(false);
          setLoading(false);
        }
      }, 2000); // Simule un délai de 2 secondes pour l'analyse);
    });
  };

  // Fonction getSortedResults pour toute utilisation externe
  const getSortedResults = () => {
    if (!analysisResults) return [];

    return allColumns
      .filter((column) => analysisResults[column]?.total > 0)
      .sort((a, b) => {
        const totalA = analysisResults[a]?.total;
        const totalB = analysisResults[b]?.total;
        return totalB - totalA;
      });
  };

  const resetAnalysis = () => {
    setAnalysisResults(null);
    setShowResults(false);
    setSortedColumns([]);
    setLoading(false);
    setError(null);
    setCompositesResults(null);
    setRecommendations(null);
    setDetailedReport(null);
    console.log("Hook - Analyse du sol réinitialisée");
  };

  return {
    loading,
    error,
    analysisResults,
    compositesResults,
    recommendations,
    sortedColumns,
    showResults,
    detailedReport,
    isCalibrating,
    generateAnalysisResults,
    resetAnalysis,
    getSortedResults,
    getPlantIndicatorsByScientificName,
  };
};
export default useSoilAnalysis;
