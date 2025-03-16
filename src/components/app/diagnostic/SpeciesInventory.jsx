const SpeciesInventory = ({ selectedPlants }) => {
  // const { selectedPlants } = usePlants();
  return (
    <div className="species-inventory">
      <ul className="species-inventory__list">
        {selectedPlants.map((plant) => (
          <li key={plant.id} className="species-inventory__item">
            <div className="species-inventory__item-image">
              {plant.images[0] && (
                <img src={plant.images[0]} alt={plant.name} />
              )}
            </div>
            <div className="species-inventory__item-content">
              <h4>{plant.scientificName}</h4>
              <p>{plant.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpeciesInventory;
