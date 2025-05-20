// soilDiagnosticData.js
const soilDiagnosticData = {
  // Formules pour calculer les indices
  formules: {
    vieMicrobienne: {
      facteurs: [
        { indicateur: "AB+", coefficient: 2 },
        { indicateur: "AB-", coefficient: 1.5 },
        { indicateur: "MOT", coefficient: 1 },
        { indicateur: "Eau", coefficient: -1.5 },
        { indicateur: "Air", coefficient: 1.5 },
        { indicateur: "Sali", coefficient: -1.2 },
        { indicateur: "Poll", coefficient: -2 },
      ],
      diviseur: 8.2,
    },
    complexeArgiloHumique: {
      facteurs: [
        { indicateur: "BS", coefficient: 1.5 },
        { indicateur: "BNS", coefficient: -2 },
        { indicateur: "MOT", coefficient: 0.8 },
        { indicateur: "Nit", coefficient: -1 },
        { indicateur: "Al3+", coefficient: -1.5 },
        { indicateur: "BP", coefficient: -1 },
        { indicateur: "BK", coefficient: -1 },
        { indicateur: "Sali", coefficient: -1 },
        { indicateur: "Poll", coefficient: -1 },
      ],
      interactions: [
        {
          indicateurs: ["Nit", "Al3+"],
          coefficient: -0.5,
          operation: "multiply",
        },
      ],
      diviseur: 10.8,
    },
    matiereOrganique: {
      facteurs: [
        { indicateur: "MOT", coefficient: 2 },
        { indicateur: "MO(C)", coefficient: 1 },
        { indicateur: "MO(N)", coefficient: 1 },
        { indicateur: "Foss", coefficient: -2 },
      ],
      diviseur: 5,
    },
    equilibreCN: {
      type: "special", // Nouveau champ pour identifier les formules spéciales
      specialFormula: "(MO_C / (MO_N + 0.1)) * 0.3", // Nouveau champ pour la formule hybride
      facteurs: [
        { indicateur: "MO(C)", coefficient: 1 },
        { indicateur: "MO(N)", coefficient: -1 },
      ],
      diviseur: 2,
    },
    structurePorosite: {
      facteurs: [
        { indicateur: "Air", coefficient: 4 },
        { indicateur: "Eau", coefficient: -1.5 },
        { indicateur: "Ero", coefficient: -2 },
        { indicateur: "Less", coefficient: -2 },
        { indicateur: "Foss", coefficient: -1.5 },
        { indicateur: "Sali", coefficient: -2 },
        { indicateur: "Poll", coefficient: -2.5 },
      ],
      diviseur: 15.5,
    },
  },

  // Plages optimales selon les différents contextes
  plagesOptimales: {
    maraichageBio: {
      vieMicrobienne: {
        min: 0.8,
        max: 2.0,
        description: "Activité biologique intense",
      },
      complexeArgiloHumique: {
        min: 0.5,
        max: 1.5,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 0.8,
        max: 1.8,
        description: "Riche en matière organique",
      },
      equilibreCN: {
        min: 20,
        max: 30,
        description: "Légèrement riche en azote",
      },
      structurePorosite: {
        min: 0.7,
        max: 1.5,
        description: "Bonne aération et drainage",
      },
    },
    // Ajoutez les autres contextes ici (grandesCultures, prairiePermanente, etc.)
    potager: {
      vieMicrobienne: {
        min: 0.8,
        max: 2.0,
        description: "Activité biologique intense nécessaire",
      },
      complexeArgiloHumique: {
        min: 0.5,
        max: 1.5,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 0.8,
        max: 1.8,
        description: "Riche en matière organique ",
      },
      equilibreCN: {
        min: -0.3,
        max: 0.5,
        description: "Légèrement riche en azote",
      },
      structurePorosite: {
        min: 0.7,
        max: 1.5,
        description: "Bonne aération et drainage",
      },
    },
  },

  // Recommandations selon les écarts observés
  recommandations: {
    vieMicrobienne: {
      deficit: {
        leger:
          "Augmentez légèrement les apports de matière organique fraîche et diversifiée.",
        modere:
          "Incorporez régulièrement du compost jeune et envisagez l'utilisation d'engrais verts.",
        important:
          "Restructuration nécessaire: apports réguliers de compost, engrais verts, réduction du travail du sol.",
      },
      exces: {
        leger: "Équilibrez avec plus de matière carbonée (paille, BRF).",
        modere:
          "Réduisez temporairement les apports de matière organique azotée.",
        important:
          "Rééquilibrez avec des apports très carbonés et réduisez fortement les apports azotés.",
      },
    },
    // Ajoutez les autres recommandations ici
  },

  // Seuils pour catégoriser les écarts
  seuilsEcarts: {
    deficit: {
      leger: 0.2,
      modere: 0.5,
    },
    exces: {
      leger: 0.2,
      modere: 0.5,
    },
  },

  // Analyse des indicateurs du sol
  indicators: {
    BNS: {
      description:
        "Bases non solubles, indiquant la présence de bases sous forme minérale.",
      low_threshold: 1,
      high_threshold: 3,
      analysis: {
        low: "Le sol est géologiquement privé de bases, ce qui peut affecter la disponibilité des nutriments.",
        high: "Les bases sont présentes sous forme minérale, nécessitant une action microbienne pour les rendre solubles.",
      },
    },
    BS: {
      description:
        "Bases solubles, pouvant être bactéricides à haute concentration.",
      low_threshold: 1,
      high_threshold: 3,
      analysis: {
        low: "Les carbonates de calcaire ont été lessivés, indiquant une perte de matière organique.",
        high: "Les bases solubles peuvent être bactéricides, réduisant l'activité microbienne.",
      },
    },
    Air: {
      description: "Indicateur de la porosité du sol et de l'aération.",
      low_threshold: 2,
      high_threshold: 4,
      analysis: {
        low: "Le sol présente un tassement, ce qui impacte la porosité et la vie microbienne.",
        high: "Le sol a une bonne porosité, favorisant les échanges gazeux.",
      },
    },
    Eau: {
      description: "Indicateur de l'engorgement ou de la sécheresse du sol.",
      high_threshold: 3,
      analysis: {
        high: "Le sol est engorgé en eau, ce qui peut réduire l'activité microbienne aérobie.",
      },
    },
    MOT: {
      description: "Indicateur de la matière organique totale dans le sol.",
      low_threshold: 2,
      high_threshold: 4,
      analysis: {
        low: "Le sol est pauvre en matière organique, ce qui affecte la structure et la fertilité.",
        high: "Le sol est riche en matière organique, favorisant une bonne structure.",
      },
    },
    "MO(C)": {
      description:
        "Matière organique riche en carbone, indiquant un sol équilibré en C/N.",
      low_threshold: 2,
      high_threshold: 4,
      analysis: {
        low: "Le sol est pauvre en matière organique équilibrée C/N.",
        high: "Le sol est riche en matière organique équilibrée C/N, favorisant une bonne minéralisation.",
      },
    },
    "MO(N)": {
      description:
        "Matière organique riche en azote, indiquant un sol riche en MO animale.",
      low_threshold: 2,
      high_threshold: 4,
      analysis: {
        low: "Le sol présente une carence en matière organique animale riche en azote.",
        high: "Le sol est riche en matière organique animale, ce qui peut entraîner un excès d'azote.",
      },
    },
    Nit: {
      description:
        "Nitrites, produits par des pratiques agricoles ou l'activité humaine.",
      high_threshold: 1,
      analysis: {
        high: "Les nitrites indiquent des conditions anaérobies, nuisibles aux micro-organismes aérobies.",
      },
    },
    "Al3+": {
      description:
        "Aluminium échangeable, libéré par des conditions anaérobies.",
      high_threshold: 1,
      analysis: {
        high: "La libération d'aluminium ionique peut déstructurer les argiles, affectant le complexe argilo-humique.",
      },
    },
    Foss: {
      description:
        "Matière organique en cours de fossilisation, indiquant un excès de carbone.",
      high_threshold: 1,
      analysis: {
        high: "Le sol est engorgé en matière organique d'origine végétale en cours de fossilisation.",
      },
    },
    Less: {
      description: "Lessivage, indiquant une perte d'éléments fertilisants.",
      high_threshold: 1,
      analysis: {
        high: "Le sol subit un lessivage des éléments fertilisants, indiquant une carence en argile et en humus.",
      },
    },
    Ero: {
      description:
        "Érosion, indiquant une perte de sol par entraînement mécanique.",
      high_threshold: 1,
      analysis: {
        high: "Le sol subit une érosion, entraînant une perte de matière organique et de nutriments.",
      },
    },
    Sali: {
      description: "Salinisation, indiquant un excès de sels solubles.",
      high_threshold: 1,
      analysis: {
        high: "Le sol présente une salinisation, ce qui peut réduire l'activité microbienne.",
      },
    },
    BP: {
      description:
        "Blocage du phosphore, indiquant une indisponibilité du phosphore.",
      high_threshold: 1,
      analysis: {
        high: "Le sol présente un blocage du phosphore, affectant la disponibilité de ce nutriment.",
      },
    },
    BK: {
      description:
        "Blocage de la potasse, indiquant une indisponibilité de la potasse.",
      high_threshold: 1,
      analysis: {
        high: "Le sol présente un blocage de la potasse, affectant la disponibilité de ce nutriment.",
      },
    },
    "AB+": {
      description:
        "Activité biologique favorable, indiquant une bonne minéralisation.",
      low_threshold: 2,
      high_threshold: 4,
      analysis: {
        low: "L'activité biologique est bloquée, affectant la minéralisation.",
        high: "Le sol présente une bonne activité biologique aérobie, favorisant la minéralisation.",
      },
    },
    "AB-": {
      description:
        "Activité biologique bloquée, indiquant une faible minéralisation.",
      high_threshold: 1,
      analysis: {
        high: "L'activité biologique est bloquée, réduisant la minéralisation.",
      },
    },
    Poll: {
      description: "Pollution, indiquant la présence de contaminants.",
      high_threshold: 1,
      analysis: {
        high: "Le sol est pollué, ce qui peut nuire à la vie microbienne et à la fertilité.",
      },
    },
  },

  // Exemples de rapports de diagnostic
  reportTemplates: {
    introduction:
      "L'analyse de votre sol révèle des caractéristiques uniques qui influencent sa fertilité et sa structure. En nous basant sur les indicateurs fournis par les plantes bio-indicatrices présentes, nous avons évalué cinq critères clés : la vie microbienne aérobie, le complexe argilo-humique, la matière organique, l'équilibre C/N, et la structure et porosité du sol.",
    indicatorAnalysis: {
      engorgementEau:
        "Les plantes de votre sol indiquent un engorgement en eau, avec un indicateur \"Eau\" dépassant le seuil de {threshold}. Cet excès d'eau chasse l'air du sol, réduisant ainsi l'activité microbienne aérobie. Cela peut entraîner des hydromorphismes toxiques, nuisibles à la vie microbienne et à la structure du sol.",
      tassementSol:
        'L\'indicateur "Air" est en dessous du seuil optimal, signalant un tassement du sol. Ce tassement, probablement dû à un compactage mécanique ou à des conditions humides, limite les échanges gazeux nécessaires à une vie microbienne saine. Cela impacte négativement la porosité et la capacité de rétention en eau de votre sol.',
      carenceMatiereOrganique:
        'Le sol est pauvre en matière organique, avec un indicateur "MOT" en dessous du seuil de {threshold}. Cela affecte la structure et la fertilité du sol, réduisant sa capacité à retenir les nutriments et l\'eau.',
      excesBasesSolubles:
        'Les bases solubles sont en excès, avec un indicateur "BS" dépassant le seuil de {threshold}. Cela peut être bactéricide et réduire l\'activité microbienne du sol.',
    },
    criteriaDescriptions: {
      vieMicrobienne:
        "L'activité biologique de votre sol est actuellement {state}, avec un indice de {index}. {additional_info}",
      complexeArgiloHumique:
        "Votre sol présente un {state} équilibre argile-humus, avec un indice de {index}. {additional_info}",
      matiereOrganique:
        "La teneur en matière organique de votre sol est {state}, avec un indice de {index}. {additional_info}",
      equilibreCN:
        "L'équilibre carbone-azote de votre sol est {state}, avec un indice de {index}. {additional_info}",
      structurePorosite:
        "La structure et la porosité de votre sol sont {state}, avec un indice de {index}. {additional_info}",
    },
    recommendationsIntro:
      "Pour améliorer la qualité de votre sol, nous recommandons les actions suivantes :",
    recommendationsList: {
      reduceEngorgement:
        "Réduire l'Engorgement en Eau : Améliorez le drainage du sol par des pratiques culturales adaptées, comme le labour minimal ou l'ajout de matières organiques pour augmenter la porosité.",
      improvePorosity:
        "Améliorer la Porosité : Évitez le compactage mécanique et favorisez les pratiques qui augmentent l'aération, comme l'incorporation de compost ou l'utilisation d'engrais verts.",
      increaseOrganicMatter:
        "Augmenter la Matière Organique : Incorporez régulièrement du compost ou du fumier bien décomposé pour améliorer la structure du sol et sa capacité de rétention en eau.",
      balanceCN:
        "Équilibrer le C/N : Ajoutez des matières organiques équilibrées en carbone et en azote pour favoriser une minéralisation optimale.",
      reduceCompaction:
        "Réduire le Tassement : Évitez de travailler le sol lorsqu'il est humide et réduisez le trafic mécanique pour préserver la structure du sol.",
      manageSalinity:
        "Gérer la Salinité : Évitez les excès d'engrais minéraux et assurez un bon drainage pour prévenir l'accumulation de sels.",
      enhanceBiologicalActivity:
        "Améliorer l'Activité Biologique : Utilisez des engrais verts et des rotations culturales pour stimuler la vie microbienne du sol.",
      monitorPollution:
        "Surveiller la Pollution : Évitez l'utilisation de produits chimiques nocifs et surveillez les sources potentielles de contamination.",
    },
  },
};

export default soilDiagnosticData;
