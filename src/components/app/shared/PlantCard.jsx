import { usePlantDatabase } from "../../../hooks/usePlantDatabase.js";

const PlantCard = ({ famille }) => {
  const { getPlantById, filterPlants, loading, error } = usePlantDatabase();
  console.log("Famille", famille);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  // const plant = getPlantById(parseInt(plantId));
  const plant = filterPlants({ Famille: famille });

  if (!plant) {
    return <div>Plant not found</div>;
  }
  return (
    <div className="plant-card-container">
      {plant.map((plant) => (
        <div key={plant.id} className="plant-card">
          <h2 className="plant_card__title">{plant["Nom commun"]}</h2>
          <p className="plant_card__scientific_title">{plant["Nom Coste"]}</p>
          <p className="plant_card__family">{plant["Famille"]}</p>
          {/* <p className="plant_card__biotope">
            {plant["Biotope secondaire"].slice(0, 2).join(" / ")}
          </p> */}
        </div>
      ))}
    </div>
  );
};

export default PlantCard;
