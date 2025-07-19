import { useEffect, useState } from "react";

// Composant pour l'icône SVG de densité (à placer en dehors de CoverageEditor)
const DensityVisual = ({ level }) => {
  const svgs = {
    // Quelques pieds (0%)
    0: (
      <svg
        className="coverage-editor__density-visual-svg"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="4" fill="#16a34a" />
      </svg>
    ),
    // < 25%
    5: (
      <svg
        className="coverage-editor__density-visual-svg"
        viewBox="0 0 100 100"
      >
        <circle cx="30" cy="70" r="5" fill="#16a34a" />
        <circle cx="70" cy="50" r="6" fill="#16a34a" />
        <circle cx="50" cy="30" r="4" fill="#16a34a" />
      </svg>
    ),
    // 25%
    25: (
      <svg
        className="coverage-editor__density-visual-svg"
        viewBox="0 0 100 100"
      >
        <circle cx="20" cy="80" r="7" fill="#16a34a" />
        <circle cx="50" cy="60" r="9" fill="#16a34a" />
        <circle cx="80" cy="75" r="6" fill="#16a34a" />
        <circle cx="40" cy="40" r="5" fill="#16a34a" />
      </svg>
    ),
    // 50%
    50: (
      <svg
        className="coverage-editor__density-visual-svg"
        viewBox="0 0 100 100"
      >
        <circle cx="20" cy="80" r="8" fill="#16a34a" />
        <circle cx="50" cy="60" r="10" fill="#16a34a" />
        <circle cx="80" cy="75" r="7" fill="#16a34a" />
        <circle cx="40" cy="40" r="6" fill="#16a34a" />
        <circle cx="65" cy="25" r="5" fill="#16a34a" />
        <circle cx="15" cy="45" r="4" fill="#16a34a" />
      </svg>
    ),
    // 75%
    75: (
      <svg
        className="coverage-editor__density-visual-svg"
        viewBox="0 0 100 100"
      >
        <circle cx="20" cy="80" r="9" fill="#16a34a" />
        <circle cx="50" cy="60" r="11" fill="#16a34a" />
        <circle cx="80" cy="75" r="8" fill="#16a34a" />
        <circle cx="40" cy="40" r="7" fill="#16a34a" />
        <circle cx="65" cy="25" r="6" fill="#16a34a" />
        <circle cx="15" cy="45" r="5" fill="#16a34a" />
        <circle cx="85" cy="40" r="9" fill="#16a34a" />
        <circle cx="35" cy="20" r="8" fill="#16a34a" />
      </svg>
    ),
    // 100%
    100: (
      <svg
        className="coverage-editor__density-visual-svg"
        viewBox="0 0 100 100"
      >
        <circle cx="20" cy="80" r="10" fill="#16a34a" />
        <circle cx="50" cy="60" r="12" fill="#16a34a" />
        <circle cx="80" cy="75" r="9" fill="#16a34a" />
        <circle cx="40" cy="40" r="8" fill="#16a34a" />
        <circle cx="65" cy="25" r="7" fill="#16a34a" />
        <circle cx="15" cy="45" r="6" fill="#16a34a" />
        <circle cx="85" cy="40" r="10" fill="#16a34a" />
        <circle cx="35" cy="20" r="9" fill="#16a34a" />
        <circle cx="10" cy="60" r="7" fill="#16a34a" />
        <circle cx="90" cy="55" r="8" fill="#16a34a" />
      </svg>
    ),
  };
  return svgs[level];
};

const CoverageEditor = ({
  selectedPlants,
  onCoverageChange,
  initialCoverages,
}) => {
  const [coverages, setCoverages] = useState(initialCoverages || {});
  const [coefficients, setCoefficients] = useState({});

  const densityOptions = [
    { value: 0, label: "Quelques pieds", percentage: "0-1%", coefficient: 0 },
    { value: 5, label: "Rare", percentage: "1-10%", coefficient: 1 },
    { value: 25, label: "Peu dense", percentage: "10-25%", coefficient: 2 },
    {
      value: 50,
      label: "Moyennement dense",
      percentage: "25-50%",
      coefficient: 3,
    },
    { value: 75, label: "Dense", percentage: "50-75%", coefficient: 4 },
    { value: 100, label: "Très dense", percentage: "75-100%", coefficient: 5 },
  ];

  useEffect(() => {
    console.log("Selected Plants: ", selectedPlants);
    const initialCoverages = {};
    // Initialise les coverages avec 0 pour chaque plante sélectionnée
    selectedPlants.forEach((plant) => {
      // Utilise les coverages existants ou initialise à 0
      initialCoverages[plant.id] = coverages[plant.id] || 0;
    });
    console.log("Initial Coverages: ", initialCoverages);
    setCoverages(initialCoverages);
    // updateTotalCoverage(initialCoverages);
  }, [selectedPlants]);

  const handleDensityChange = (plantId, value) => {
    const newCoverages = { ...coverages, [plantId]: value };
    const option = densityOptions.find((opt) => opt.value === value);
    const coefficient = option ? option.coefficient : 0;
    const newCoefficient = { ...coefficients, [plantId]: coefficient };
    setCoefficients(newCoefficient);
    setCoverages(newCoverages);
    onCoverageChange(newCoverages, newCoefficient);
    console.log("New Coefficients: ", newCoefficient);
  };

  return (
    <div className="coverage-editor">
      <div className="coverage-editor__header">
        <h2>Étape 2: Attribution de la densité des espèces</h2>
        <p className="coverage-editor__header__description">
          Veuillez indiquer la densité de chaque espèce sur votre terrain en
          sélectionnant la carte qui correspond le mieux à votre observation.
        </p>
      </div>
      <div className="coverage-editor__plants-list">
        {selectedPlants.map((plant) => (
          <div key={plant.id} className="coverage-editor__plant-item">
            <div className="coverage-editor__plant-image">
              {plant.images && plant.images[0]?.url && (
                <img src={plant.images[0].url} alt={plant.commonName} />
              )}
            </div>
            <div className="coverage-editor__plant-info">
              {/* <ListCard plant={plant} compact={true} /> */}
              <div className="coverage-editor__plant-info__plant-names">
                <h3 className="coverage-editor__plant-info__plant-latin">
                  {plant.scientificName}
                </h3>
                <p className="coverage-editor__plant-info__plant-common">
                  {plant.commonName}
                </p>
              </div>
            </div>

            <div className="coverage-editor__density-section">
              <div className="coverage-editor__density-section-info">
                <p className="coverage-editor__density-section-label">
                  Densité observée:
                </p>
                {coefficients[plant.id] !== undefined && ( // Vérifier explicitement undefined pour 0
                  <p className="coverage-editor__density-section-coefficient">
                    Coefficient: {coefficients[plant.id]}
                  </p>
                )}
              </div>

              <div className="coverage-editor__density-options-grid">
                {" "}
                {/* Nouvelle classe pour la grille */}
                {densityOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`coverage-editor__density-option ${
                      // Nouvelle classe pour la carte
                      coverages[plant.id] === option.value
                        ? "coverage-editor__density-option-selected" // Nouvelle classe pour la sélection
                        : ""
                    }`}
                    onClick={() => handleDensityChange(plant.id, option.value)}
                  >
                    <div className="coverage-editor__density-visual-wrapper">
                      {" "}
                      {/* Conteneur pour le SVG */}
                      <DensityVisual level={option.value.toString()} />
                    </div>
                    <div className="coverage-editor__density-label">
                      {" "}
                      {/* Label de la densité */}
                      {option.label}
                    </div>
                    <div className="coverage-editor__density-percentage">
                      {" "}
                      {/* Pourcentage */}
                      {option.percentage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="coverage-editor__content"></div>{" "}
    </div>
  );
};
export default CoverageEditor;

// Ancienne version du composant
// const CoverageEditor = ({
//   selectedPlants,
//   onCoverageChange,
//   initialCoverages,
// }) => {
//   const [coverages, setCoverages] = useState(initialCoverages || {});
//   const [coefficients, setCoefficients] = useState({});

//   const densityOptions = [
//     { value: 0, label: "Quelques pieds", coefficient: 0 },
//     { value: 5, label: "< 25%", coefficient: 1 },
//     { value: 25, label: "25%", coefficient: 2 },
//     { value: 50, label: "50%", coefficient: 3 },
//     { value: 75, label: "75%", coefficient: 4 },
//     { value: 100, label: "100%", coefficient: 5 },
//   ];

//   useEffect(() => {
//     console.log("Selected Plants: ", selectedPlants);
//     const initialCoverages = {};
//     // Initialise les coverages avec 0 pour chaque plante sélectionnée
//     selectedPlants.forEach((plant) => {
//       // Utilise les coverages existants ou initialise à 0
//       initialCoverages[plant.id] = coverages[plant.id] || 0;
//     });
//     console.log("Initial Coverages: ", initialCoverages);
//     setCoverages(initialCoverages);
//     // updateTotalCoverage(initialCoverages);
//   }, [selectedPlants]);

//   const handleDensityChange = (plantId, value) => {
//     const newCoverages = { ...coverages, [plantId]: value };
//     const option = densityOptions.find((opt) => opt.value === value);
//     const coefficient = option ? option.coefficient : 0;
//     const newCoefficient = { ...coefficients, [plantId]: coefficient };
//     setCoefficients(newCoefficient);
//     setCoverages(newCoverages);
//     onCoverageChange(newCoverages, newCoefficient);
//     console.log("New Coefficients: ", newCoefficient);
//   };

//   return (
//     <div className="coverage-editor">
//       <div className="coverage-editor__header">
//         <h2>Etape 2: Attribution de la densité des espèces</h2>
//         <p className="coverage-editor__header__description">
//           Veuillez indiquer la densité de chaque espèce sur votre terrain.
//         </p>
//       </div>
//       <div className="coverage-editor__plants-list">
//         {selectedPlants.map((plant) => (
//           <div key={plant.id} className="coverage-editor__plant-item">
//             <div className="coverage-editor__plant-image">
//               {plant.images && (
//                 <img src={plant.images[0]?.url} alt={plant.commonName} />
//               )}
//             </div>
//             <div className="coverage-editor__plant-info">
//               {/* <ListCard plant={plant} compact={true} /> */}
//               <div className="coverage-editor__plant-info__plant-names">
//                 <h3 className="coverage-editor__plant-info__plant-latin">
//                   {plant.scientificName}
//                 </h3>
//                 <p className="coverage-editor__plant-info__plant-common">
//                   {plant.commonName}
//                 </p>
//               </div>
//             </div>

//             <div className="coverage-editor__density-section">
//               <div className="coverage-editor__density-section-info">
//                 <p className="coverage-editor__density-section-label">
//                   Densité observée:
//                 </p>
//                 {coefficients[plant.id] && (
//                   <p className="coverage-editor__density-section-coefficient">
//                     Coefficient: {coefficients[plant.id]}
//                   </p>
//                 )}
//               </div>

//               <div className="coverage-editor__density-section-options">
//                 {densityOptions.map((option) => (
//                   <div
//                     key={option.value}
//                     className="coverage-editor__density-section-option"
//                     onClick={() => handleDensityChange(plant.id, option.value)}
//                   >
//                     <div
//                       className={`coverage-editor__density-section-option-circle ${
//                         coverages[plant.id] === option.value
//                           ? "coverage-editor__density-section-option-circle-selected"
//                           : ""
//                       }`}
//                     >
//                       {option.value > 0 && (
//                         <div
//                           className="coverage-editor__density-section-option-circle-inner"
//                           style={{
//                             width: `${Math.max(30, option.value * 0.7)}%`,
//                             height: `${Math.max(30, option.value * 0.7)}%`,
//                           }}
//                         ></div>
//                       )}
//                     </div>
//                     <span className="coverage-editor__density-section-option-label">
//                       {option.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="coverage-editor__content"></div>{" "}
//     </div>
//   );
// };
// export default CoverageEditor;
