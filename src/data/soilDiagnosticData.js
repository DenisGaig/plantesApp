// soilDiagnosticData.js
const soilDiagnosticData = {
  // Formules pour calculer les indices
  formules: {
    vieMicrobienne: {
      facteurs: [
        { indicateur: "AB+", coefficient: 2 },
        { indicateur: "AB-", coefficient: 1.5 },
        { indicateur: "MOT", coefficient: 1 },
        { indicateur: "Sali", coefficient: -1.2 },
        { indicateur: "Poll", coefficient: -2 },
      ],
      interactions: [
        {
          indicateurs: ["Air", "Eau"],
          coefficient: 1,
          operation: "airWaterBalance",
        },
      ],
      diviseur: 8.2,
    },
    complexeArgiloHumique: {
      facteurs: [
        { indicateur: "BS", coefficient: 1.8 },
        { indicateur: "BNS", coefficient: -1.2 },
        { indicateur: "MOT", coefficient: 1.2 },
        { indicateur: "MO(C)", coefficient: 0.8 },
        { indicateur: "Nit", coefficient: -1 },
        { indicateur: "Al3+", coefficient: -1.5 },
        { indicateur: "BP", coefficient: -0.8 },
        { indicateur: "BK", coefficient: -0.8 },
        { indicateur: "Sali", coefficient: -1 },
        { indicateur: "Poll", coefficient: -1 },
        { indicateur: "Less", coefficient: -1 },
      ],
      interactions: [
        {
          indicateurs: ["Nit", "Al3+"],
          coefficient: -0.5,
          operation: "multiply",
        },
        {
          indicateurs: ["Air", "Eau"],
          coefficient: 1,
          operation: "airWaterEffect",
        },
      ],
      diviseur: 12,
    },
    matiereOrganique: {
      facteurs: [
        { indicateur: "MOT", coefficient: 2 },
        { indicateur: "MO(C)", coefficient: 1 },
        { indicateur: "MO(N)", coefficient: -1 },
        { indicateur: "Foss", coefficient: -3 },
      ],
      diviseur: 7,
    },
    equilibreCN: {
      type: "special", // Nouveau champ pour identifier les formules spéciales
      facteurs: [
        { indicateur: "MO(C)", coefficient: 1 },
        { indicateur: "MO(N)", coefficient: -1 },
      ],
      diviseur: 2,
    },
    structurePorosite: {
      facteurs: [
        { indicateur: "Air", coefficient: 3.5 },
        { indicateur: "MO(C)", coefficient: 1 },
        { indicateur: "Eau", coefficient: -1.5 },
        { indicateur: "Ero", coefficient: -2 },
        { indicateur: "Less", coefficient: -2 },
        { indicateur: "Foss", coefficient: -1.5 },
        { indicateur: "Sali", coefficient: -2 },
        { indicateur: "Poll", coefficient: -2.5 },
      ],
      diviseur: 15,
    },
  },

  // Plages optimales selon les différents contextes
  plagesOptimales: {
    maraichageBio: {
      vieMicrobienne: {
        min: 4.41,
        max: 5.35,
        description: "Activité biologique intense",
      },
      complexeArgiloHumique: {
        min: 3.61,
        max: 4.61,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 4.43,
        max: 5.31,
        description: "Riche en matière organique",
      },
      equilibreCN: {
        min: 23.5,
        max: 28.35,
        description: "Légèrement riche en azote",
      },
      structurePorosite: {
        min: 3.57,
        max: 4.21,
        description: "Bonne aération et drainage",
      },
    },
    jardinage: {
      vieMicrobienne: {
        min: 4.38,
        max: 5.23,
        description: "Activité biologique intense",
      },
      complexeArgiloHumique: {
        min: 3.83,
        max: 4.47,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 4.49,
        max: 5.22,
        description: "Riche en matière organique ",
      },
      equilibreCN: {
        min: 24.32,
        max: 33.44,
        description: "Légèrement riche en azote",
      },
      structurePorosite: {
        min: 3.39,
        max: 4.07,
        description: "Bonne aération et drainage",
      },
    },
    grandesCultures: {
      vieMicrobienne: {
        min: 3.98,
        max: 5.15,
        description: "Activité biologique intense",
      },
      complexeArgiloHumique: {
        min: 3.65,
        max: 4.79,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 3.89,
        max: 4.98,
        description: "Riche en matière organique ",
      },
      equilibreCN: {
        min: 23.64,
        max: 33.44,
        description: "Légèrement riche en azote",
      },
      structurePorosite: {
        min: 3.24,
        max: 4.42,
        description: "Bonne aération et drainage",
      },
    },
    prairiesAgricoles: {
      vieMicrobienne: {
        min: 4.94,
        max: 5.94,
        description: "Activité biologique intense",
      },
      complexeArgiloHumique: {
        min: 4.54,
        max: 5.15,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 4.37,
        max: 5.28,
        description: "Riche en matière organique ",
      },
      equilibreCN: {
        min: 25.75,
        max: 35.47,
        description: "Légèrement riche en azote",
      },
      structurePorosite: {
        min: 3.83,
        max: 4.7,
        description: "Bonne aération et drainage",
      },
    },
    viticulture: {
      vieMicrobienne: {
        min: 4.58,
        max: 5.52,
        description: "Activité biologique intense",
      },
      complexeArgiloHumique: {
        min: 4,
        max: 4.93,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 4.21,
        max: 4.95,
        description: "Riche en matière organique ",
      },
      equilibreCN: {
        min: 27.03,
        max: 36.42,
        description: "Bon équilibre carbone-azote",
      },
      structurePorosite: {
        min: 3.59,
        max: 4.57,
        description: "Bonne aération et drainage",
      },
    },
    arboriculture: {
      vieMicrobienne: {
        min: 4.26,
        max: 5.46,
        description: "Activité biologique intense",
      },
      complexeArgiloHumique: {
        min: 3.59,
        max: 4.96,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 3.99,
        max: 5,
        description: "Riche en matière organique ",
      },
      equilibreCN: {
        min: 26.36,
        max: 34.32,
        description: "Equilibre carbone-azote optimal",
      },
      structurePorosite: {
        min: 3.43,
        max: 5.46,
        description: "Bonne aération et drainage",
      },
    },
    agroforesterie: {
      vieMicrobienne: {
        min: 4.68,
        max: 5.65,
        description: "Activité biologique intense",
      },
      complexeArgiloHumique: {
        min: 4.22,
        max: 4.94,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 4.12,
        max: 5,
        description: "Riche en matière organique ",
      },
      equilibreCN: {
        min: 24.32,
        max: 35.81,
        description: "Equilibre carbone-azote optimal",
      },
      structurePorosite: {
        min: 3.63,
        max: 4.34,
        description: "Bonne aération et drainage",
      },
    },
    permaculture: {
      vieMicrobienne: {
        min: 3.9,
        max: 6.83,
        description: "Activité biologique intense",
      },
      complexeArgiloHumique: {
        min: 3.83,
        max: 5.22,
        description: "Bon équilibre argile-humus",
      },
      matiereOrganique: {
        min: 4.05,
        max: 6.43,
        description: "Riche en matière organique ",
      },
      equilibreCN: {
        min: 20,
        max: 30,
        description: "Légèrement riche en azote",
      },
      structurePorosite: {
        min: 3,
        max: 5.33,
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
    maraichageBio: {
      complexeArgiloHumique: {
        deficit: {
          leger: 0.12,
          modere: 0.24,
          important: 0.37,
        },
        exces: {
          leger: 0.09,
          modere: 0.17,
          important: 0.26,
        },
      },
      equilibreCN: {
        deficit: {
          leger: 0.99,
          modere: 1.97,
          important: 2.96,
        },
        exces: {
          leger: 0.49,
          modere: 0.98,
          important: 1.47,
        },
      },
      matiereOrganique: {
        deficit: {
          leger: 0.11,
          modere: 0.22,
          important: 0.33,
        },
        exces: {
          leger: 0.11,
          modere: 0.22,
          important: 0.33,
        },
      },
      structurePorosite: {
        deficit: {
          leger: 0.07,
          modere: 0.14,
          important: 0.21,
        },
        exces: {
          leger: 0.08,
          modere: 0.17,
          important: 0.25,
        },
      },
      vieMicrobienne: {
        deficit: {
          leger: 0.11,
          modere: 0.23,
          important: 0.34,
        },
        exces: {
          leger: 0.09,
          modere: 0.18,
          important: 0.27,
        },
      },
    },
    jardinage: {
      complexeArgiloHumique: {
        deficit: {
          leger: 0.08,
          modere: 0.16,
          important: 0.25,
        },
        exces: {
          leger: 0.07,
          modere: 0.14,
          important: 0.21,
        },
      },
      equilibreCN: {
        deficit: {
          leger: 1.08,
          modere: 2.16,
          important: 3.25,
        },
        exces: {
          leger: 0.8,
          modere: 1.61,
          important: 2.41,
        },
      },
      matiereOrganique: {
        deficit: {
          leger: 0.08,
          modere: 0.15,
          important: 0.23,
        },
        exces: {
          leger: 0.1,
          modere: 0.2,
          important: 0.29,
        },
      },
      structurePorosite: {
        deficit: {
          leger: 0.07,
          modere: 0.15,
          important: 0.22,
        },
        exces: {
          leger: 0.08,
          modere: 0.17,
          important: 0.25,
        },
      },
      vieMicrobienne: {
        deficit: {
          leger: 0.07,
          modere: 0.13,
          important: 0.2,
        },
        exces: {
          leger: 0.13,
          modere: 0.27,
          important: 0.4,
        },
      },
    },
    grandesCultures: {
      complexeArgiloHumique: {
        deficit: {
          leger: 0.16,
          modere: 0.32,
          important: 0.47,
        },
        exces: {
          leger: 0.09,
          modere: 0.17,
          important: 0.26,
        },
      },
      equilibreCN: {
        deficit: {
          leger: 1.12,
          modere: 2.24,
          important: 3.36,
        },
        exces: {
          leger: 1.12,
          modere: 2.25,
          important: 3.37,
        },
      },
      matiereOrganique: {
        deficit: {
          leger: 0.14,
          modere: 0.28,
          important: 0.42,
        },
        exces: {
          leger: 0.09,
          modere: 0.18,
          important: 0.26,
        },
      },
      structurePorosite: {
        deficit: {
          leger: 0.14,
          modere: 0.28,
          important: 0.43,
        },
        exces: {
          leger: 0.11,
          modere: 0.22,
          important: 0.34,
        },
      },
      vieMicrobienne: {
        deficit: {
          leger: 0.12,
          modere: 0.23,
          important: 0.35,
        },
        exces: {
          leger: 0.14,
          modere: 0.27,
          important: 0.41,
        },
      },
    },
    prairiesAgricoles: {
      complexeArgiloHumique: {
        deficit: {
          leger: 0.1,
          modere: 0.2,
          important: 0.31,
        },
        exces: {
          leger: 0.06,
          modere: 0.11,
          important: 0.17,
        },
      },
      equilibreCN: {
        deficit: {
          leger: 1.12,
          modere: 2.23,
          important: 3.35,
        },
        exces: {
          leger: 0.82,
          modere: 1.63,
          important: 2.45,
        },
      },
      matiereOrganique: {
        deficit: {
          leger: 0.1,
          modere: 0.2,
          important: 0.29,
        },
        exces: {
          leger: 0.08,
          modere: 0.16,
          important: 0.24,
        },
      },
      structurePorosite: {
        deficit: {
          leger: 0.09,
          modere: 0.17,
          important: 0.26,
        },
        exces: {
          leger: 0.08,
          modere: 0.16,
          important: 0.24,
        },
      },
      vieMicrobienne: {
        deficit: {
          leger: 0.11,
          modere: 0.21,
          important: 0.32,
        },
        exces: {
          leger: 0.09,
          modere: 0.18,
          important: 0.27,
        },
      },
    },
    viticulture: {
      complexeArgiloHumique: {
        deficit: {
          leger: 0.16,
          modere: 0.31,
          important: 0.47,
        },
        exces: {
          leger: 0.05,
          modere: 0.11,
          important: 0.16,
        },
      },
      equilibreCN: {
        deficit: {
          leger: 1.2,
          modere: 2.4,
          important: 3.6,
        },
        exces: {
          leger: 0.96,
          modere: 1.92,
          important: 2.88,
        },
      },
      matiereOrganique: {
        deficit: {
          leger: 0.13,
          modere: 0.25,
          important: 0.38,
        },
        exces: {
          leger: 0.06,
          modere: 0.12,
          important: 0.19,
        },
      },
      structurePorosite: {
        deficit: {
          leger: 0.08,
          modere: 0.17,
          important: 0.25,
        },
        exces: {
          leger: 0.11,
          modere: 0.23,
          important: 0.34,
        },
      },
      vieMicrobienne: {
        deficit: {
          leger: 0.1,
          modere: 0.19,
          important: 0.29,
        },
        exces: {
          leger: 0.11,
          modere: 0.22,
          important: 0.33,
        },
      },
    },
    arboriculture: {
      complexeArgiloHumique: {
        deficit: {
          leger: 0.24,
          modere: 0.49,
          important: 0.73,
        },
        exces: {
          leger: 0.1,
          modere: 0.19,
          important: 0.29,
        },
      },
      equilibreCN: {
        deficit: {
          leger: 0.78,
          modere: 1.57,
          important: 2.35,
        },
        exces: {
          leger: 1.04,
          modere: 2.07,
          important: 3.11,
        },
      },
      matiereOrganique: {
        deficit: {
          leger: 0.12,
          modere: 0.23,
          important: 0.35,
        },
        exces: {
          leger: 0.12,
          modere: 0.24,
          important: 0.36,
        },
      },
      structurePorosite: {
        deficit: {
          leger: 0.1,
          modere: 0.19,
          important: 0.29,
        },
        exces: {
          leger: 0.13,
          modere: 0.26,
          important: 0.39,
        },
      },
      vieMicrobienne: {
        deficit: {
          leger: 0.11,
          modere: 0.22,
          important: 0.33,
        },
        exces: {
          leger: 0.15,
          modere: 0.3,
          important: 0.45,
        },
      },
    },
    agroforesterie: {
      complexeArgiloHumique: {
        deficit: {
          leger: 0.1,
          modere: 0.21,
          important: 0.31,
        },
        exces: {
          leger: 0.08,
          modere: 0.15,
          important: 0.23,
        },
      },
      equilibreCN: {
        deficit: {
          leger: 1.4,
          modere: 2.8,
          important: 4.2,
        },
        exces: {
          leger: 1.14,
          modere: 2.29,
          important: 3.43,
        },
      },
      matiereOrganique: {
        deficit: {
          leger: 0.13,
          modere: 0.27,
          important: 0.4,
        },
        exces: {
          leger: 0.14,
          modere: 0.27,
          important: 0.41,
        },
      },
      structurePorosite: {
        deficit: {
          leger: 0.09,
          modere: 0.18,
          important: 0.27,
        },
        exces: {
          leger: 0.06,
          modere: 0.12,
          important: 0.18,
        },
      },
      vieMicrobienne: {
        deficit: {
          leger: 0.1,
          modere: 0.2,
          important: 0.3,
        },
        exces: {
          leger: 0.11,
          modere: 0.22,
          important: 0.32,
        },
      },
    },
    permaculture: {
      complexeArgiloHumique: {
        deficit: {
          leger: 0.16,
          modere: 0.32,
          important: 0.47,
        },
        exces: {
          leger: 0.09,
          modere: 0.17,
          important: 0.26,
        },
      },
      equilibreCN: {
        deficit: {
          leger: 1.12,
          modere: 2.24,
          important: 3.36,
        },
        exces: {
          leger: 1.12,
          modere: 2.25,
          important: 3.37,
        },
      },
      matiereOrganique: {
        deficit: {
          leger: 0.14,
          modere: 0.28,
          important: 0.42,
        },
        exces: {
          leger: 0.09,
          modere: 0.18,
          important: 0.26,
        },
      },
      structurePorosite: {
        deficit: {
          leger: 0.14,
          modere: 0.28,
          important: 0.43,
        },
        exces: {
          leger: 0.11,
          modere: 0.22,
          important: 0.34,
        },
      },
      vieMicrobienne: {
        deficit: {
          leger: 0.12,
          modere: 0.23,
          important: 0.35,
        },
        exces: {
          leger: 0.14,
          modere: 0.27,
          important: 0.41,
        },
      },
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
