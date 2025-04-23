// Liste des résultats de recherche des plantes
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { PLANTS_PER_PAGE } from "../../../constants.ts";
import PlantCard from "../shared/PlantCard.jsx";

const PlantList = ({ filteredPlants, viewMode, currentPage, onPageChange }) => {
  const location = useLocation();
  const currentSearchParams = location.search;

  // Pagination
  const [plantsPerPage] = useState(PLANTS_PER_PAGE);

  // Calculer les index des plantes à afficher
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(
    indexOfFirstPlant,
    indexOfLastPlant
  );
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  const paginate = (pageNumber) => onPageChange(pageNumber);

  return (
    <div className="plant-list-container">
      <div
        className={viewMode === "list" ? "plant-list list" : "plant-list grid"}
      >
        {currentPlants.length === 0 ? (
          <p>Aucune plante ne correspond à ces critères</p>
        ) : (
          currentPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              searchParams={currentSearchParams}
              viewMode={viewMode}
              currentPage={currentPage}
            />
          ))
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
