mon-projet/
├── src/
│ ├── components/ # Composants de l'application
│ │ ├── app/ # Composants React
│ │ │ ├── shared/ # Composants réutilisables
│ │ │ ├── identification/ # Fonctionnalité d'identification
| │ │ ├── cameraComponent.jsx # Composant de la caméra  
│ │ │ ├── PlantNetCard.jsx # Carte de plante
│ │ │ ├── PlantNetResult.jsx # Résultat d'identification
│ │ │ ├── profile/ # Profils de plantes
│ │ │ │ ├── plantProfile.jsx # Profil d'une plante
│ │ │ │ ├── plantDetails.jsx # Détails d'une plante
│ │ │ │ ├── plantImages.jsx # Images d'une plante
│ │ │ │ └── bioIndicators.jsx # Indicateurs biologiques
│ │ │ ├── database/ # Base de données des plantes
│ │ │ └── diagnostic/ # Diagnostic de sol
│ │ └── blog/ # Composants Astro pour le blog
│ │
│ ├── content/ # Contenu géré par Astro
│ │ ├── blog/ # Articles de blog
│ │ └── config.ts # Configuration des collections
│ │
│ ├── data/ # Données statiques
│ │ ├── plantes.json # Base de données des plantes
│ │ ├── soilConditions.json # Conditions de sol
│ │ └── site.json # Configuration du site
│ │
│ ├── hooks/ # Hooks React personnalisés
│ │ ├── usePlantIdentification.js
│ │ ├── usePlantDatabase.js
│ │ └── useSoilAnalysis.js
│ │
│ ├── context/ # Contextes React
│ │ ├── PlantsContext.jsx
│ │ └── DiagnosticContext.jsx
│ │
│ ├── layouts/ # Mises en page
│ │ ├── BaseLayout.astro
│ │ ├── BlogLayout.astro
│ │ └── AppLayout.astro
│ │
│ ├── pages/ # Pages du site
│ │ ├── index.astro # Page d'accueil
│ │ ├── blog/ # Section blog
│ │ └── app/ # Application React
│ │ ├── App.jsx # Composant principal
│ │ ├── identification.jsx
│ │ ├── plants.jsx
│ │ └── diagnostic.jsx
│ │
│ └── services/ # Utilitaires
│ ├── storageService.js # Fonctions d'API génériques
│ ├── plantNetService.js # Service pour l'API PlantNet
│ └── soilAnalysisService.js# Service d'analyse de sol
│
├── public/ # Ressources statiques
│ ├── images/
│ └── fonts/
│
└── astro.config.mjs # Configuration Astro
