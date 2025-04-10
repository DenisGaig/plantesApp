// Liste des résultats de recherche des plantes
import ListCard from "../shared/ListCard.jsx";
import PlantCard from "../shared/PlantCard.jsx";

import { useState } from "react";
import { useLocation } from "react-router-dom";

const PlantList = ({ filteredPlants, viewMode }) => {
  // const { filteredPlants, loading, error } = useContext(PlantsContext);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  // console.log("PLANT LIST RENDU !");
  const location = useLocation();
  const currentSearchParams = location.search;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [plantsPerPage] = useState(6);

  // Calculer les index des plantes à afficher
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(
    indexOfFirstPlant,
    indexOfLastPlant
  );
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="plant-list-container">
      <div
        className={viewMode === "list" ? "plant-list list" : "plant-list grid"}
      >
        {currentPlants.length === 0 ? (
          <p>Aucune plante ne correspond à ces critères</p>
        ) : (
          currentPlants.map((plant) =>
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

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
export default PlantList;
