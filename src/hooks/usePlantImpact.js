import { useCallback, useState } from "react";
import plantsIndicators from "../data/bioindicators_plants.json";
import plantProfiles from "../data/fiches_plantes.json"; // Import des fiches détaillées de plantes
import secondaryHabitat from "../data/secondary_habitats.json";
import soilDiagnosticData from "../data/soilDiagnosticData.js";
import { average, calculatePercentiles, standardDeviation } from "../utils.js";

/**
 * Hook pour calculer et analyser l'impact individuel des plantes bio-indicatrices
 */
const usePlantImpact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plantsImpact, setPlantsImpact] = useState(null); // Stocke l'impact unitaire de chaque plante
  const [plantsWithBiotope, setPlantsWithBiotope] = useState(null); // Plantes avec biotope secondaire
  const [referenceGroups, setReferenceGroups] = useState(null); // Groupes de plantes de référence
  const [calibrationSets, setCalibrationSets] = useState(null); // Ensembles pour calibration
  const [biotopeStats, setBiotopeStats] = useState(null); // Statistiques des biotopes secondaires

  // Constantes par défaut pour la calibration
  const IMPACT_THRESHOLDS = {
    LOW: 0.3,
    MEDIUM: 0.7,
    HIGH: 1.0,
  };

  // Nombre minimum de plantes par biotope pour le classement
  const MIN_PLANTS_PER_BIOTOPE = 10; // Seuil ajustable

  // Critères de fertilité du sol
  const FERTILITY_CRITERIA = [
    "vieMicrobienne",
    "complexeArgiloHumique",
    "matiereOrganique",
    "equilibreCN",
    "structurePorosite",
  ];

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
        minValue: 10,
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
  const calculateEquilibreCN = (moC, moN) => {
    // Calcul de l'écart (C - N)
    // Écart positif = plus de carbone relatif = ratio C/N plus élevé
    // Écart négatif = plus d'azote relatif = ratio C/N plus bas
    const ecart = moC - moN;

    // Cas particuliers : carences simultanées
    if (moC < 0 && moN < 0) {
      // Sol carencé en C ET N : ratio dégradé même si "équilibré"
      const severite = Math.abs(moC + moN) / 2; // Moyenne des carences
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
  /**
   * Calcule l'impact unitaire de chaque plante de la base de données
   */
  const calculatePlantsUnitaryImpact = useCallback(() => {
    console.log("🌱 Calcul de l'impact unitaire des plantes...");
    setLoading(true);
    try {
      // Structure pour stocker les résultats
      const impacts = {};

      // Pour chaque plante de la base de données
      plantsIndicators.forEach((plant) => {
        const scientificName = plant.scientificName;
        const commonName = plant.commonName;
        const indicators = plant.caracteristiques;
        const id = plant.id;

        // Initialiser la structure de résultat pour cette plante
        impacts[scientificName] = {
          id,
          scientificName,
          commonName,
          rawIndicators: { ...indicators }, // Copie des indicateurs bruts
          compositeImpact: {}, // Va contenir l'impact sur les 5 critères composites
        };

        // Simuler une analyse avec cette plante unique à densité 1
        const simulatedResults = {};

        // Initialiser tous les indicateurs à 0
        Object.keys(soilDiagnosticData.formules).forEach((criterion) => {
          soilDiagnosticData.formules[criterion].facteurs.forEach((factor) => {
            const indicator = factor.indicateur;
            if (!simulatedResults[indicator]) {
              simulatedResults[indicator] = {
                positive: 0,
                negative: 0,
                total: 0,
              };
            }
          });
        });

        // Remplir les valeurs d'indicateurs pour cette plante
        if (indicators) {
          Object.entries(indicators).forEach(([column, value]) => {
            if (!simulatedResults[column]) {
              simulatedResults[column] = { positive: 0, negative: 0, total: 0 };
            }

            if (value === "+" || value === "+K" || value === "++") {
              // Densité 1 pour l'impact unitaire
              const impact = value === "++" ? 2 : 1; // ++ compte double
              simulatedResults[column].positive += impact;
            } else if (value === "-" || value === "--") {
              // Valeurs négatives
              const impact = value === "--" ? 2 : 1; // -- compte double négatif
              simulatedResults[column].negative += impact;
            }

            simulatedResults[column].total =
              simulatedResults[column].positive +
              simulatedResults[column].negative;
          });
        }

        // Calculer l'impact composite pour les 5 critères de fertilité
        FERTILITY_CRITERIA.forEach((criterion) => {
          const formula = soilDiagnosticData.formules[criterion];
          let sum = 0;

          // Calculer la somme pondérée des indicateurs
          const getNumericValue = (indicator) => {
            if (!simulatedResults[indicator]) return 0;
            return (
              simulatedResults[indicator].positive -
              simulatedResults[indicator].negative
            );
          };

          // Cas spécial pour l'équilibre C/N
          if (criterion === "equilibreCN") {
            let CN_result = null;

            const MO_C = getNumericValue("MO(C)");
            const MO_N = getNumericValue("MO(N)");

            CN_result = calculateEquilibreCN(MO_C, MO_N);

            impacts[scientificName].compositeImpact[criterion] = CN_result;
          } else {
            formula.facteurs.forEach((factor) => {
              const indicator = factor.indicateur;
              const coefficient = factor.coefficient;

              const indicatorValue = getNumericValue(indicator);

              sum += indicatorValue * coefficient;
            });

            // Gestion des interactions (cas spécial pour Nit*Al3+)
            if (formula.interactions) {
              formula.interactions.forEach((interaction) => {
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

            // Normalisation pour avoir une échelle de 0 à 10
            const rawScore = sum / formula.diviseur;

            // Diviser par le diviseur défini dans la formule
            // impacts[scientificName].compositeImpact[criterion] =
            //   sum / formula.diviseur;
            impacts[scientificName].compositeImpact[criterion] = normalizeScore(
              rawScore,
              criterion
            );
          }
        });
      });

      console.log("Hook usePlantImpact - Impacts calculés:", impacts);

      setPlantsImpact(impacts);
      return impacts;
    } catch (err) {
      setError("Erreur lors du calcul de l'impact des plantes: " + err.message);
      console.error("Hook usePlantImpact - Erreur:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Enrichit les données d'impact avec les informations de biotope et calcule les statistiques
   */
  const enrichWithHabitatData = (impacts) => {
    if (!impacts) return null;

    const enrichedData = { ...impacts };
    let stats = {};

    // Parcourir les fiches détaillées des plantes pour extraire les biotopes
    plantProfiles.data.forEach((profile) => {
      const scientificName = Array.isArray(profile.scientificName)
        ? profile.scientificName[0]
        : profile.scientificName;

      if (enrichedData[scientificName] && profile.secondaryHabitat) {
        enrichedData[scientificName].primaryHabitat =
          profile.primaryHabitat || [];
        enrichedData[scientificName].secondaryHabitat =
          profile.secondaryHabitat || [];
      }
    });

    console.log("Hook usePlantImpact - Données enrichies:", enrichedData);

    setPlantsWithBiotope(enrichedData);

    // Calcul des statistiques par biotope et par critère d'impact
    stats = calculateBiotopeStats(enrichedData);
    setBiotopeStats(stats);
    console.log("Hook usePlantImpact - Stats par biotope:", stats);

    return { enrichedData, stats };
  };

  /**
   * Vérifie si une phrase contient des mots-clés de biotope.
   * Retourne une liste des biotopes correspondants.
   */
  function findBiotopesInPhrase(phrase, biotopeKeywords) {
    const foundBiotopes = new Set();

    // 1. Parcourir chaque catégorie de biotope et ses mots-clés et ajouter les catégories trouvées dans foundBiotopes
    // Object.entries(biotopeKeywords).forEach(([biotope, keywords]) => {
    //           const hasKeyword = keywords.some((keyword) =>
    //     phrase.toLowerCase().includes(keyword.toLowerCase())
    //   );
    //   if (hasKeyword) {
    //     foundBiotopes.add(biotope);
    //   }
    // });

    // 2. Parcourir chaque catégorie de biotope et ses mots-clés et ajouter les mots-clés trouvés dans foundBiotopes
    Object.values(biotopeKeywords).forEach((keywords) => {
      // Vérifier si un mot-clé de la catégorie est présent dans la phrase
      keywords.forEach((keyword) => {
        if (phrase.toLowerCase().includes(keyword.toLowerCase())) {
          foundBiotopes.add(keyword);
        }
      });
    });

    return Array.from(foundBiotopes);
  }

  /**
   * Calcule les statistiques par biotope et par critère d'impact
   */
  const calculateBiotopeStats = (enrichedData) => {
    const stats = {};

    // Groupement par biotope
    Object.values(enrichedData).forEach((plant) => {
      plant.secondaryHabitat?.forEach((habitat) => {
        const foundBiotopes = findBiotopesInPhrase(
          habitat,
          secondaryHabitat.secondaryHabitat
        );
        // console.log("Hook usePlantImpact - Biotopes trouvés:", foundBiotopes);

        foundBiotopes.forEach((habitat) => {
          if (!stats[habitat]) stats[habitat] = { plants: [], criteria: {} };
          stats[habitat].plants.push(plant);
        });
      });
    });

    // Calcul des moyennes, écarts-types et percentiles par critère
    Object.entries(stats).forEach(([biotope, data]) => {
      FERTILITY_CRITERIA.forEach((criterion) => {
        const values = data.plants.map((p) => p.compositeImpact[criterion]);
        data.criteria[criterion] = {
          avg: average(values),
          stdDev: standardDeviation(values),
          percentiles: calculatePercentiles(values, [10, 50, 90]),
        };
      });
    });

    return stats;
  };

  /**
   * Obtient les seuils dynamiques pour chaque critère et biotope
   */
  const getDynamicThresholds = (biotope, criterion, stats) => {
    // Vérification complète de l'existence des propriétés à chaque niveau
    if (
      !stats ||
      !stats[biotope] ||
      !stats[biotope].criteria ||
      !stats[biotope].criteria[criterion] ||
      !stats[biotope].criteria[criterion].percentiles
    ) {
      console.warn(
        `Statistiques manquantes pour biotope=${biotope}, critère=${criterion}. Utilisation des seuils par défaut.`
      );
      return IMPACT_THRESHOLDS; // Valeurs par défaut
    }
    const { p10, p50, p90 } =
      stats[biotope]?.criteria[criterion]?.percentiles || {};

    if (p10 === undefined || p50 === undefined || p90 === undefined) {
      console.warn(
        `Percentiles incomplets pour biotope=${biotope}, critère=${criterion}. Utilisation des seuils par défaut.`
      );
      return IMPACT_THRESHOLDS;
    }

    // const criterionStats = biotopeStats?.[biotope]?.criteria?.[criterion];
    // if (!criterionStats) return IMPACT_THRESHOLDS;
    return {
      // Seuils positifs (pour impact >=)
      POSITIVE: {
        LOW: p10,
        MEDIUM: p50,
        HIGH: p90,
      },
      // Seuils négatifs (pour impact <=)
      NEGATIVE: {
        LOW: -p10, // Note: p10 peut être négatif !
        MEDIUM: -p50,
        HIGH: -p90,
      },
    };
  };

  /**
   * Groupe les plantes par niveau d'impact sur chaque critère, en tenant compte de tous les biotopes
   * @param {Object} plantsWithImpact - Les plantes avec leurs données d'impact
   * @returns {Object} - Classification des plantes par critère et par niveau d'impact
   */
  const classifyPlantsByImpact = (plantsWithImpact, stats) => {
    if (!plantsWithImpact || !stats) {
      console.warn("Données manquantes pour la classification des plantes");
      return null;
    }

    const classificationByBiotope = {};

    // console.log("Biotope stats", biotopeStats);

    // Filtrer les biotopes avec assez de données
    const availableBiotopes = Object.entries(stats)
      .filter(([_, stats]) => {
        return (
          stats && stats.plants && stats.plants.length >= MIN_PLANTS_PER_BIOTOPE
        );
      })
      .map(([biotope]) => biotope);

    if (availableBiotopes.length === 0) {
      console.warn("Aucun biotope n'a suffisamment de plantes pour l'analyse");
      return null;
    }
    // Initialiser la structure de classification pour chaque biotope
    availableBiotopes.forEach((biotope) => {
      classificationByBiotope[biotope] = {};

      // Pour chaque critère de fertilité
      FERTILITY_CRITERIA.forEach((criterion) => {
        classificationByBiotope[biotope][criterion] = {
          highPositive: [],
          mediumPositive: [],
          // lowPositive: [],
          neutral: [],
          // lowNegative: [],
          mediumNegative: [],
          highNegative: [],
        };
      });

      // Ajouter une catégorie "equilibrated" pour les plantes équilibrantes par biotope
      classificationByBiotope[biotope].equilibrated = [];
    });

    // Pour chaque plante, analyser son impact dans chacun de ses biotopes
    Object.values(plantsWithImpact).forEach((plant) => {
      if (!plant.secondaryHabitat || plant.secondaryHabitat.length === 0) {
        // Si la plante n'a pas de biotope défini, on passe
        return;
      }

      // Identifier tous les biotopes associés à cette plante
      const foundBiotopes = plant.secondaryHabitat.flatMap((habitat) =>
        findBiotopesInPhrase(habitat, secondaryHabitat.secondaryHabitat)
      );

      // Si aucun biotope n'est trouvé, passer à la plante suivante
      if (foundBiotopes.length === 0) return;

      // Pour chaque biotope trouvé, classer la plante
      foundBiotopes.forEach((biotope) => {
        if (!classificationByBiotope[biotope]) {
          // Si le biotope n'est pas dans notre liste d'intérêt, on passe
          return;
        }

        // Variables pour le calcul d'équilibre dans ce biotope
        let equilibriumScore = 0;
        let extremeCount = 0;

        // Pour chaque critère, classer la plante selon les seuils spécifiques à ce biotope
        FERTILITY_CRITERIA.forEach((criterion) => {
          const impact =
            plant.compositeImpact && plant.compositeImpact[criterion];

          // Si l'impact est undefined ou null, on passe au critère suivant
          if (impact === undefined || impact === null) {
            console.warn(
              `Impact manquant pour plante=${plant.scientificName}, critère=${criterion}`
            );
            return;
          }

          try {
            // Obtenir les seuils dynamiques pour ce biotope et ce critère
            const thresholds = getDynamicThresholds(biotope, criterion, stats);

            // console.log("THRESHOLDS", thresholds.POSITIVE);

            // *****************************

            // Classification selon les seuils avec prise en compte des scores normalisés entre 0 et 10 (sauf pour C/N)
            // Si l'impact est > à p90 => impact très positif
            // Si l'impact est > à p50 => impact positif
            // Si l'impact est > à p10 => impact négatif
            // Si l'impact est < à p10 => impact très négatif (extrême)
            // Si l'impact est = à p50 => impact neutre

            if (impact >= thresholds.POSITIVE.HIGH) {
              classificationByBiotope[biotope][criterion].highPositive.push(
                plant
              );
            } else if (impact >= thresholds.POSITIVE.MEDIUM) {
              classificationByBiotope[biotope][criterion].mediumPositive.push(
                plant
              );
              equilibriumScore++; // Ajouter à l'équilibre pour ce critère
            } else if (impact > thresholds.POSITIVE.LOW) {
              classificationByBiotope[biotope][criterion].mediumNegative.push(
                plant
              );
            } else if (impact <= thresholds.POSITIVE.LOW) {
              classificationByBiotope[biotope][criterion].highNegative.push(
                plant
              );
              extremeCount++;
            } else {
              classificationByBiotope[biotope][criterion].neutral.push(plant);
            }
          } catch (error) {
            console.error(
              `Erreur lors de la classification de ${plant.scientificName} pour ${criterion} dans ${biotope}:`,
              error
            );
            // En cas d'erreur, on considère la plante comme neutre pour ce critère
            classificationByBiotope[biotope][criterion].neutral.push(plant);
          }
        });

        // Une plante est considérée comme équilibrante dans ce biotope si:
        // - Elle a un impact positif moyen sur au moins 3 critères
        // - Elle n'a pas d'impacts extrêmes négatifs
        if (equilibriumScore >= 3 && extremeCount === 0) {
          classificationByBiotope[biotope].equilibrated.push(plant);
        }
      });
    });

    console.log(
      "🏡 Classification des plantes par biotope:",
      classificationByBiotope
    );

    setReferenceGroups(classificationByBiotope);
    return classificationByBiotope;
  };

  /**
   * Génère des ensembles de plantes pour la calibration par biotope et par contexte agricole
   * @param {Object} plantsData - Les données des plantes avec impact
   * @param {Object} classification - Classification des plantes par biotope
   * @returns {Object} - Ensembles de calibration
   */
  const generateCalibrationSets = (classification) => {
    // const generateCalibrationSets = (plantsData, classification) => {
    if (!classification) return null;

    console.log("Génération des ensembles de calibration...");

    const biotopes = [
      "maraîchages",
      "jardins",
      "cultures",
      "prairies",
      "vergers",
      "vignes",
      "haies",
    ];

    const equilibratedCategories = [
      { coefficient: 1, density: 10, probability: 0.1 },
      { coefficient: 2, density: 25, probability: 0.3 },
      { coefficient: 3, density: 50, probability: 0.4 },
      { coefficient: 4, density: 75, probability: 0.15 },
      { coefficient: 5, density: 100, probability: 0.05 },
    ];

    const imbalancedCategories = [
      { coefficient: 1, density: 10, probability: 0.4 },
      { coefficient: 2, density: 25, probability: 0.2 },
      { coefficient: 3, density: 50, probability: 0.1 },
      { coefficient: 4, density: 75, probability: 0.15 },
      { coefficient: 5, density: 100, probability: 0.15 },
    ];

    // Fonction pour choisir une catégorie basée sur les probabilités
    function getRandomCategory(categories) {
      const random = Math.random();
      let cumulativeProbability = 0;

      for (const category of categories) {
        cumulativeProbability += category.probability;
        if (random < cumulativeProbability) {
          return category;
        }
      }

      // Retourner la dernière catégorie par défaut (ne devrait normalement pas arriver)
      return categories[categories.length - 1];
    }

    // Structure pour les ensembles de calibration
    const calibrationSets = {};

    // Pour chaque biotope
    biotopes.forEach((biotope) => {
      // Vérifier si on a des classifications pour ce biotope
      if (
        !classification[biotope] ||
        !classification[biotope].equilibrated ||
        classification[biotope].equilibrated.length < 3
      ) {
        console.log(
          `Pas assez de plantes pour générer des ensembles pour le biotope ${biotope}`
        );
        return;
      }

      calibrationSets[biotope] = {
        equilibrated: {
          name: `Équilibre - ${biotope}`,
          description: `Ensemble de plantes pour tester les conditions d'équilibre dans ${biotope}`,
          plants: [],
        },
        imbalances: {},
      };

      // Ajouter aléatoirement toutes les (jusqu'à 5) plantes équilibrantes de ce biotope
      const shuffledPlants = [...classification[biotope].equilibrated].sort(
        () => 0.5 - Math.random()
      );
      // shuffledPlants.slice(0, 5).forEach((p) => {
      shuffledPlants.forEach((p) => {
        const { coefficient, density } = getRandomCategory(
          equilibratedCategories
        );

        calibrationSets[biotope].equilibrated.plants.push({
          scientificName: [p.scientificName],
          commonName: [p.commonName],
          id: p.id,
          // Ajout des indicateurs bruts
          rawIndicators: p.rawIndicators,
          coefficient: coefficient,
          density: density,
        });
      });

      // Pour chaque critère, créer des ensembles pour tester les déséquilibres
      FERTILITY_CRITERIA.forEach((criterion) => {
        // Ensemble pour tester l'excès
        if (classification[biotope][criterion].highPositive.length >= 2) {
          calibrationSets[biotope].imbalances[`exces_${criterion}`] = {
            name: `Excès - ${criterion} - ${biotope}`,
            description: `Ensemble de plantes pour tester l'excès de ${criterion} dans ${biotope}`,
            plants: [],
          };

          // Ajouter toutes les (jusqu'à 3) plantes à fort impact positif sur ce critère
          const shuffledPlantsHighPositive = [
            ...classification[biotope][criterion].highPositive,
          ].sort(() => 0.5 - Math.random());

          // shuffledPlantsHighPositive.slice(0, 3).forEach((p) => {
          shuffledPlantsHighPositive.forEach((p) => {
            // Calculer un coefficient et une densité aléatoires pour chaque plante
            const { coefficient, density } =
              getRandomCategory(imbalancedCategories);

            calibrationSets[biotope].imbalances[
              `exces_${criterion}`
            ].plants.push({
              scientificName: [p.scientificName],
              commonName: [p.commonName],
              id: p.id,
              // Ajout des indicateurs bruts
              rawIndicators: p.rawIndicators,
              coefficient: coefficient,
              density: density,
            });
          });
        }

        // Ensemble pour tester le déficit
        if (classification[biotope][criterion].highNegative.length >= 2) {
          calibrationSets[biotope].imbalances[`deficit_${criterion}`] = {
            name: `Déficit - ${criterion} - ${biotope}`,
            description: `Ensemble de plantes pour tester le déficit de ${criterion} dans ${biotope}`,
            plants: [],
          };

          // Ajouter toutes les (jusqu'à 3) plantes à fort impact positif sur ce critère
          const shuffledPlantsHighNegative = [
            ...classification[biotope][criterion].highNegative,
          ].sort(() => 0.5 - Math.random());

          // shuffledPlantsHighNegative.slice(0, 3).forEach((p) => {
          shuffledPlantsHighNegative.forEach((p) => {
            const { coefficient, density } =
              getRandomCategory(imbalancedCategories);

            calibrationSets[biotope].imbalances[
              `deficit_${criterion}`
            ].plants.push({
              scientificName: [p.scientificName],
              commonName: [p.commonName],
              id: p.id,
              rawIndicators: p.rawIndicators,
              coefficient: coefficient,
              density: density,
            });
          });
        }
      });

      // Filtrer les ensembles avec trop peu de plantes
      if (Object.keys(calibrationSets[biotope].imbalances).length < 3) {
        console.log(
          `Pas assez d'ensembles de déséquilibre pour le biotope ${biotope}`
        );
        delete calibrationSets[biotope];
      }

      // console.log(`Calibration set for ${biotope}:`, calibrationSets[biotope]);
    });

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

    // Créer des ensembles supplémentaires pour les contextes agricoles spécifiques en combinant les plantes des biotopes correspondants
    agricultureContexts.forEach((context) => {
      const contextBiotopes = context.biotopes.filter(
        (b) => calibrationSets[b] && calibrationSets[b].equilibrated
      );
      // console.log(`Context biotopes for ${context.id}:`, contextBiotopes);

      if (contextBiotopes.length === 0) {
        console.log(
          `Pas de biotopes disponibles pour le contexte ${context.id}`
        );
        return;
      }

      // Créer un ensemble de calibration pour ce contexte agricole
      calibrationSets[context.id] = {
        equilibrated: {
          name: `Équilibre - ${context.id}`,
          description: `Ensemble de plantes pour tester les conditions d'équilibre en ${context.id}`,
          plants: [],
        },
        imbalances: {},
      };

      // Collecter toutes les plantes équilibrantes des biotopes associés à ce contexte
      const equilibratedPlants = new Set();
      contextBiotopes.forEach((biotope) => {
        if (calibrationSets[biotope] && calibrationSets[biotope].equilibrated) {
          calibrationSets[biotope].equilibrated.plants.forEach((plant) => {
            equilibratedPlants.add(JSON.stringify(plant)); // Utiliser JSON pour éviter les doublons
          });
        }
      });

      // console.log(
      //   `Plantes équilibrantes trouvées pour ${context.id}:`,
      //   equilibratedPlants.size
      // );

      // Convertir de nouveau en objets (et limiter à 5 plantes)
      Array.from(equilibratedPlants)
        .map((p) => JSON.parse(p))
        // .slice(0, 5)
        .forEach((plant) => {
          calibrationSets[context.id].equilibrated.plants.push(plant);
        });

      // Pour chaque critère, créer des ensembles de déséquilibre pour ce contexte
      FERTILITY_CRITERIA.forEach((criterion) => {
        // Ensemble pour tester l'excès
        const excessPlants = new Set();
        contextBiotopes.forEach((biotope) => {
          if (
            calibrationSets[biotope] &&
            calibrationSets[biotope].imbalances &&
            calibrationSets[biotope].imbalances[`exces_${criterion}`]
          ) {
            calibrationSets[biotope].imbalances[
              `exces_${criterion}`
            ].plants.forEach((plant) => {
              excessPlants.add(JSON.stringify(plant));
            });
          }
        });

        if (excessPlants.size >= 2) {
          calibrationSets[context.id].imbalances[`exces_${criterion}`] = {
            name: `Excès - ${criterion} - ${context.id}`,
            description: `Ensemble de plantes pour tester l'excès de ${criterion} en ${context.id}`,
            plants: Array.from(excessPlants).map((p) => JSON.parse(p)),
            // .slice(0, 3),
          };
        }

        // Ensemble pour tester le déficit
        const deficitPlants = new Set();
        contextBiotopes.forEach((biotope) => {
          if (
            calibrationSets[biotope] &&
            calibrationSets[biotope].imbalances &&
            calibrationSets[biotope].imbalances[`deficit_${criterion}`]
          ) {
            calibrationSets[biotope].imbalances[
              `deficit_${criterion}`
            ].plants.forEach((plant) => {
              deficitPlants.add(JSON.stringify(plant));
            });
          }
        });

        if (deficitPlants.size >= 2) {
          calibrationSets[context.id].imbalances[`deficit_${criterion}`] = {
            name: `Déficit - ${criterion} - ${context.id}`,
            description: `Ensemble de plantes pour tester le déficit de ${criterion} en ${context.id}`,
            plants: Array.from(deficitPlants).map((p) => JSON.parse(p)),
            // .slice(0, 3),
          };
        }
      });

      // console.log(`Ensembles créés pour ${context.id}:`, {
      //   equilibrated: calibrationSets[context.id].equilibrated.plants.length,
      //   imbalances: Object.keys(calibrationSets[context.id].imbalances).length,
      // });

      // Supprimer les contextes sans assez d'ensembles de déséquilibre
      if (Object.keys(calibrationSets[context.id].imbalances).length < 3) {
        console.log(
          `Suppression du contexte ${context.id} - Ensembles insuffisants:`,
          {
            imbalances: Object.keys(calibrationSets[context.id].imbalances)
              .length,
            equilibrated:
              calibrationSets[context.id].equilibrated.plants.length,
          }
        );

        delete calibrationSets[context.id];
      }
    });

    console.log("Ensembles de calibration générés:", calibrationSets);
    setCalibrationSets(calibrationSets);
    return calibrationSets;
  };

  /**
   * Export des données d'impact pour usage externe
   */
  const exportPlantsImpactData = () => {
    return {
      plantsImpact,
      plantsWithBiotope,
      referenceGroups,
      calibrationSets,
    };
  };

  /**
   * Sauvegarde les données dans un fichier JSON (dans un environnement non-React)
   */
  const saveDataToJson = () => {
    if (
      !plantsImpact ||
      !plantsWithBiotope ||
      !referenceGroups ||
      !calibrationSets
    ) {
      throw new Error("Données incomplètes pour l'export");
    }

    const exportData = {
      plantsImpact,
      referenceGroups: {
        equilibrated: referenceGroups.equilibrated.map((p) => p.scientificName),
      },
      calibrationSets,
    };

    // Pour chaque critère, exporter les plantes les plus significatives
    FERTILITY_CRITERIA.forEach((criterion) => {
      exportData.referenceGroups[`${criterion}_positive`] = referenceGroups[
        criterion
      ].highPositive.map((p) => p.scientificName);
      exportData.referenceGroups[`${criterion}_negative`] = referenceGroups[
        criterion
      ].highNegative.map((p) => p.scientificName);
    });

    // Dans un environnement navigateur, ceci téléchargerait le fichier
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "plants_impact_calibration.json");
    linkElement.click();

    return exportData;
  };

  /**
   * Initialise tout le processus d'analyse
   */
  const analyzeAllPlants = () => {
    const impacts = calculatePlantsUnitaryImpact();
    if (!impacts) return null;

    const enrichedResults = enrichWithHabitatData(impacts);
    if (!enrichedResults) return null;

    const { enrichedData, stats } = enrichedResults;

    const classified = classifyPlantsByImpact(enrichedData, stats);
    if (!classified) return null;

    const calibration = generateCalibrationSets(classified);
    // const calibration = generateCalibrationSets(enrichedData, classified);
    return calibration;
  };

  return {
    loading,
    error,
    plantsImpact,
    plantsWithBiotope,
    referenceGroups,
    calibrationSets,
    biotopeStats,
    calculatePlantsUnitaryImpact,
    enrichWithHabitatData,
    classifyPlantsByImpact,
    generateCalibrationSets,
    analyzeAllPlants,
    exportPlantsImpactData,
    saveDataToJson,
  };
};

export default usePlantImpact;
