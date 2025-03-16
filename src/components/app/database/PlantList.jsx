// Liste des résultats de recherche des plantes
import ListCard from "../shared/ListCard.jsx";
import PlantCard from "../shared/PlantCard.jsx";

import { useLocation } from "react-router-dom";

const PlantList = ({ filteredPlants, viewMode }) => {
  // const { filteredPlants, loading, error } = useContext(PlantsContext);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  // console.log("PLANT LIST RENDU !");
  const location = useLocation();
  const currentSearchParams = location.search;

  return (
    <div
      className={viewMode === "list" ? "plant-list list" : "plant-list grid"}
    >
      {filteredPlants.length === 0 ? (
        <p>Aucune plante ne correspond à ces critères</p>
      ) : (
        filteredPlants.map((plant) =>
          viewMode === "list" ? (
            <ListCard
              key={plant.id}
              plant={plant}
              searchParams={currentSearchParams}
            />
          ) : (
            <PlantCard
              key={plant.id}
              plant={plant}
              searchParams={currentSearchParams}
            />
          )
        )
      )}
    </div>
  );
};
export default PlantList;
