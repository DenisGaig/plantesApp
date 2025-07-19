mon-projet/
├── src/
│ ├── components/ # Composants de l'application
│ │ ├── App.jsx # Composant principal
│ │ ├── app/ # Composants React
│ │ │ ├── shared/ # Composants réutilisables
│ │ │ ├── identification/ # Fonctionnalité d'identification
| │ │ ├── cameraComponent.jsx # Composant de la caméra  
│ │ │ ├── profile/ # Profils de plantes
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
│ │ ├── Identification.jsx
│ │ ├── PlantDatabase.jsx
│ │ └── Diagnostic.jsx
│ │ └── Home.jsx
│ ├── styles/ # Styles globaux
│ │ ├── index.scss
│ │ └── variables.scss
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
