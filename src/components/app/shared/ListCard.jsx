import { useLocation, useNavigate } from "react-router-dom";
import { usePlants } from "../../../context/PlantsProvider.jsx";

const ListCard = ({ plant, searchParams, compact = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { addIdentifiedPlant, removeIdentifiedPlant, isPlantIdentified } =
    usePlants();

  const handleNavigateToPlant = (plantId) => {
    const currentPath = encodeURIComponent(location.pathname + location.search);
    console.log("Current path: ", currentPath);
    navigate(`/app/plants/${plantId}?from=${currentPath}`);
  };

  const handleAddPlant = (plant) => {
    addIdentifiedPlant(plant);
  };
  const handleRemovePlant = (plant) => {
    removeIdentifiedPlant(plant);
  };

  const isSelected = isPlantIdentified(plant.id);

  if (!plant) return <p>Plante non disponible</p>;

  return (
    <div className="list-plant-card">
      <div className="list-plant-card__image">
        {plant.images && (
          <img src={plant.images[0]?.url} alt={plant.commonName} />
        )}
      </div>
      <div className="list-plant-card__content">
        <h3 className="list-plant-card__content__title">{plant.commonName}</h3>
        <p className="list-plant-card__content__scientific_title">
          ({plant.scientificName})
        </p>
        {plant.score && (
          <span className="list-plant-card__content__score">
            Confiance :{" "}
            {plant.score ? Math.round((plant.score * 100).toFixed(2)) : "N/A"} %
          </span>
        )}
      </div>
      {!compact && (
        <div className="list-plant-card__content__info">
          <button
            onClick={() => handleNavigateToPlant(plant.id)}
            className="list-plant-card__content__info__link"
          >
            Plus d'infos
          </button>
          {!isSelected ? (
            <button
              className="list-plant-card__content__info__addPlant"
              onClick={() => handleAddPlant(plant)}
            >
              <span>Ajouter à la liste</span> 🌿
            </button>
          ) : (
            <button
              className="list-plant-card__content__info__addPlant"
              onClick={() => handleRemovePlant(plant)}
            >
              <span>Retirer de la liste</span> 🌿
            </button>
          )}
          {/* </Link> */}
        </div>
      )}
    </div>
  );
};
export default ListCard;
