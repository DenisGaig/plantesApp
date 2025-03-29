import { useEffect, useState } from "react";

const CoverageEditor = ({
  selectedPlants,
  onCoverageChange,
  initialCoverages,
}) => {
  const [coverages, setCoverages] = useState(initialCoverages || {});
  const [coefficients, setCoefficients] = useState({});

  const densityOptions = [
    { value: 0, label: "Quelques pieds", coefficient: 0 },
    { value: 5, label: "< 25%", coefficient: 1 },
    { value: 25, label: "25%", coefficient: 2 },
    { value: 50, label: "50%", coefficient: 3 },
    { value: 75, label: "75%", coefficient: 4 },
    { value: 100, label: "100%", coefficient: 5 },
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
        <h2>Etape 2: Attribution de la densité des espèces</h2>
        <p className="coverage-editor__header__description">
          Veuillez indiquer la densité de chaque espèce sur votre terrain.
        </p>
      </div>
      <div className="coverage-editor__plants-list">
        {selectedPlants.map((plant) => (
          <div key={plant.id} className="coverage-editor__plant-item">
            <div className="coverage-editor__plant-image">
              {plant.images && (
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
                {coefficients[plant.id] && (
                  <p className="coverage-editor__density-section-coefficient">
                    Coefficient: {coefficients[plant.id]}
                  </p>
                )}
              </div>

              <div className="coverage-editor__density-section-options">
                {densityOptions.map((option) => (
                  <div
                    key={option.value}
                    className="coverage-editor__density-section-option"
                    onClick={() => handleDensityChange(plant.id, option.value)}
                  >
                    <div
                      className={`coverage-editor__density-section-option-circle ${
                        coverages[plant.id] === option.value
                          ? "coverage-editor__density-section-option-circle-selected"
                          : ""
                      }`}
                    >
                      {option.value > 0 && (
                        <div
                          className="coverage-editor__density-section-option-circle-inner"
                          style={{
                            width: `${Math.max(30, option.value * 0.7)}%`,
                            height: `${Math.max(30, option.value * 0.7)}%`,
                          }}
                        ></div>
                      )}
                    </div>
                    <span className="coverage-editor__density-section-option-label">
                      {option.label}
                    </span>
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
