// Liste des résultats de recherche des plantes
import { useContext } from "react";
import { PlantsContext } from "../../../context/PlantsContext.jsx";
import PlantCard from "../shared/PlantCard.jsx";

const PlantList = () => {
  const { filteredPlants, loading, error } = useContext(PlantsContext);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // console.log("PLANT LIST RENDU !");

  return (
    <div className="plant-list">
      {filteredPlants.length === 0 ? (
        <p>Aucune plante ne correspond à ces critères</p>
      ) : (
        filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))
      )}
    </div>
  );
};
export default PlantList;
