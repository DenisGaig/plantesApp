import { useEffect, useState } from "react";

const CoverageEditor = ({
  selectedPlants,
  onCoverageChange,
  initialCoverages,
}) => {
  const [coverages, setCoverages] = useState(initialCoverages || {});
  const [totalCoverage, setTotalCoverage] = useState(0);

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
    updateTotalCoverage(initialCoverages);
  }, [selectedPlants]);

  const updateTotalCoverage = (updatedCoverages) => {
    const total = Object.values(updatedCoverages).reduce(
      (sum, value) => sum + value,
      0
    );
    setTotalCoverage(total);

    // Passe les coverages mis à jour et le total au composant parent
    onCoverageChange(updatedCoverages, total);
  };

  const handleSliderChange = (plantId, value) => {
    const newValue = parseInt(value);
    const currentValue = coverages[plantId] || 0;
    const otherValuesTotal = totalCoverage - currentValue;

    // Vérifie si la nouvelle valeur dépasse 100%
    if (otherValuesTotal + newValue > 100) {
      const maxPossibleValue = 100 - otherValuesTotal;
      const newCoverages = { ...coverages, [plantId]: maxPossibleValue };
      setCoverages(newCoverages);
      updateTotalCoverage(newCoverages);
      // alert(`La valeur maximale pour cette plante est ${maxPossibleValue}%`);
      return;
    } else {
      // sinon met à jour les coverages
      const newCoverages = { ...coverages, [plantId]: newValue };
      setCoverages(newCoverages);
      updateTotalCoverage(newCoverages);
    }
  };

  return (
    <div className="coverage-editor">
      <div className="coverage-editor__header">
        <h2>Etape 2: Attribution de la densité des espèces</h2>
        <p className="coverage-editor__header__description">
          Veuillez indiquer la densité de chaque espèce sur votre terrain.
        </p>
        <p className="coverage-editor__header__total">
          Total actuel: <strong>{totalCoverage}%</strong>
          <span
            className={
              totalCoverage === 100
                ? "coverage-editor__header__total--valid"
                : "coverage-editor__header__total--invalid"
            }
          >
            {totalCoverage === 100 ? " (Valide)" : " (doit atteindre 100%)"}
          </span>
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

            <div className="coverage-editor__slider-container">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={coverages[plant.id] || 0}
                onChange={(e) => handleSliderChange(plant.id, e.target.value)}
                className="coverage-editor__slider"
              />
              <span className="coverage-editor__percentage">
                {coverages[plant.id] || 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="coverage-editor__content"></div>{" "}
    </div>
  );
};
export default CoverageEditor;
