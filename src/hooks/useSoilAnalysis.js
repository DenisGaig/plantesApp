import { useCallback, useEffect, useState } from "react";
import plantsIndicators from "../data/bioindicators_plants.json";
import soilDiagnosticData from "../data/soilDiagnosticData.js";
import { normalizeString } from "../utils.ts";

const useSoilAnalysis = (
  selectedPlants,
  selectedCoefficients,
  allColumns,
  selectedContext = "maraichageBio"
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

  // Nouveau état pour le rapport détaillé
  const [detailedReport, setDetailedReport] = useState(null);

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

  // Calcul des indices composites basé sur les résultats des indicateurs
  const calculateCompositeIndices = (results) => {
    console.log("Hook - calculateCompositeIndices called");
    const composites = {};

    // Calcul pour chaque indice composite selon les formules définies
    Object.keys(soilDiagnosticData.formules).forEach((indiceKey) => {
      const formule = soilDiagnosticData.formules[indiceKey];
      let result;

      // Cas spécial pour l'équilibre C/N
      if (indiceKey === "equilibreCN") {
        // Conversion explicite des symboles
        const getNumericValue = (indicator) => {
          if (!results[indicator]) return 0;
          return results[indicator].positive - results[indicator].negative;
        };

        const MO_C = getNumericValue("MO(C)");
        const MO_N = getNumericValue("MO(N)");

        // --------------------------
        // Protection contre les divisions extrêmes
        const safeMO_N = Math.max(MO_N, 0.1); // Évite division par zéro

        // Calcul de base
        let cnRatio = MO_C / safeMO_N;

        // Transformation logarithmique pour compresser l'échelle
        cnRatio = Math.sign(cnRatio) * Math.log1p(Math.abs(cnRatio));

        // Normalisation pour correspondre aux plages C/N agronomiques
        const normalizedCN = cnRatio * 3.5 + 25; // Centre autour de 20-30

        result = Math.max(5, Math.min(normalizedCN, 40));

        // Applique la formule hybride
        // result = (MO_C / Math.max(MO_N, 0.1)) * 0.3;
        // console.log("Hook - Calcul équilibre C/N: ", result);
      } else {
        // 1. Calcul standard des termes principaux pour les autres indices
        let sum = 0;
        formule.facteurs.forEach((facteur) => {
          const indicateur = facteur.indicateur;
          const coefficient = facteur.coefficient;

          // Récupérer la valeur nette de l'indicateur (positif - négatif)
          const indicateurValue = results[indicateur]
            ? results[indicateur].positive - results[indicateur].negative
            : 0;

          sum += indicateurValue * coefficient;
        });

        // 2. Gestion des interactions (cas spécial pour Nit*Al3+)
        if (formule.interactions) {
          formule.interactions.forEach((interaction) => {
            const val1 = results[interaction.indicateurs[0]]
              ? results[interaction.indicateurs[0]].positive -
                results[interaction.indicateurs[0]].negative
              : 0;
            const val2 = results[interaction.indicateurs[1]]
              ? results[interaction.indicateurs[1]].positive -
                results[interaction.indicateurs[1]].negative
              : 0;

            if (interaction.operation === "multiply") {
              sum += val1 * val2 * interaction.coefficient;
            }
            // Ajoutez d'autres opérations si nécessaire (ex: addition)
          });
        }

        // 3. Division finale de la somme par le diviseur défini dans la formule
        result = sum / formule.diviseur;
        console.log(`Hook - Calculated ${indiceKey}:`, result);
        console.log(`Hook - Formula used:`, formule);
      }

      composites[indiceKey] = result;
    });
    return composites;
  };

  // Génération des recommandations basé sur les indices composites et le contexte sélectionné
  const generateRecommendations = (composites, selectedContext) => {
    console.log("Hook - generateRecommendations called");
    const recommendations = {};
    const plagesContext = soilDiagnosticData.plagesOptimales[selectedContext];
    const deficit = soilDiagnosticData.seuilsEcarts.deficit;
    const exces = soilDiagnosticData.seuilsEcarts.exces;

    Object.keys(composites).forEach((indiceKey) => {
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

  const generateAnalysisResults = () => {
    setLoading(true);
    console.log("Hook - Loading set to true");
    setTimeout(() => {
      try {
        setError(null);

        // Logique pour générer les résultats d'analyse
        console.log("Hook - Analyse du sol en cours...");
        console.log("Hook - Selected plants:", selectedPlants);
        console.log("Hook - Selected coefficients:", selectedCoefficients);

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
          console.log(
            "Hook - Densité de la plante",
            plant.scientificName,
            ":",
            density,
            "%"
          );

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

        // Calculer les indices composites
        const composites = calculateCompositeIndices(results);
        setCompositesResults(composites);
        console.log("Hook - Indices composites calculés:", composites);

        // Générer les recommandations
        const recommendationsResults = generateRecommendations(
          composites,
          selectedContext
        );
        setRecommendations(recommendationsResults);
        console.log("Hook - Recommandations générées:", recommendationsResults);

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
        return results; // Retourne les résultats pour les tests unitaires
      } catch (err) {
        setError("Erreur lors de l'analyse du sol");
        console.error("Hook - Erreur lors de l'analyse du sol:", err);
      } finally {
        setLoading(false);
      }
    }, 2000); // Simule un délai de 2 secondes pour l'analyse);
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
    generateAnalysisResults,
    resetAnalysis,
    getSortedResults,
    getPlantIndicatorsByScientificName,
  };
};
export default useSoilAnalysis;
