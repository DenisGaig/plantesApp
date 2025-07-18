import {
  AlertTriangle,
  Info,
  Plus,
  Skull,
  Trash2,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlants } from "../../../context/PlantsProvider.jsx";

const PlantCard = ({
  plant,
  searchParams,
  viewMode = "grid",
  currentPage = 1,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { addIdentifiedPlant, removeIdentifiedPlant, isPlantIdentified } =
    usePlants();

  const handleNavigateToPlant = (plantId) => {
    console.log("Navigating to plant: ", plantId);

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

  const isInDatabase = !isNaN(parseInt(plant.id)) && isFinite(plant.id);
  const isSelected = isPlantIdentified(plant.id);

  if (!plant) return <p>Plante non disponible</p>;

  const soilStates = {
    1: { className: "plant-card__soil-state__good", text: "" },
    2: { className: "plant-card__soil-state__medium", text: "" },
    3: {
      className: "plant-card__soil-state__bad",
      text: "",
    },
  };

  const soilState = soilStates[plant["soilCondition"]] || soilStates[3];

  const AlertTriangleComponent = () => {
    const [showTooltip, setShowTooltip] = useState({
      visible: false,
      content: "",
      position: { x: 0, y: 0 },
    });

    const handleMouseEnter = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const description =
        "Cette plante n'est pas dans la base de données et ne sera pas incluse dans le diagnostic.";
      setShowTooltip({
        visible: true,
        content: description,
        position: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 20,
        },
      });
    };

    const handleMouseLeave = () => {
      setShowTooltip({ visible: false, content: "", position: { x: 0, y: 0 } });
    };

    return (
      <div>
        <AlertTriangle
          onMouseEnter={(e) => handleMouseEnter(e)}
          style={{ cursor: "pointer" }} // Ajouter un style pour indiquer que l'icône est cliquable
          onMouseLeave={handleMouseLeave}
        />
        {showTooltip.visible && (
          <div
            className="tooltip"
            style={{
              left: `${showTooltip.position.x}px`,
              top: `${showTooltip.position.y}px`,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              pointerEvents: "none",
              transform: "translateY(-100%)",
              zIndex: 1000,
              width: "300px",
              maxWidth: "300px",
            }}
          >
            {showTooltip.content}
            <div className="tooltip-arrow"></div>
            <div className="tooltip-arrow-border"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="plant-card">
      {viewMode === "grid" ? (
        <div
          className={`plant-card__grid ${
            isSelected ? " plant-card__grid--selected" : ""
          }`}
        >
          {isSelected && (
            <div className="plant-card__grid__selected-badge"></div>
          )}
          <div className="plant-card__grid__image">
            {plant.images.length > 0 ? (
              <img src={plant.images[0]?.url} alt={plant.commonName} />
            ) : (
              <img src="/plant-placeholder.webp" alt={plant.commonName} />
            )}
            {/* {plant.images && (
              <img src={plant.images[0]?.url} alt={plant.commonName} />
            )} */}
          </div>
          <h3 className="plant-card__title">
            <span>{plant.commonName[0]}</span>
            {"  "}
            {plant.commonName[1] && <span>({plant.commonName[1]})</span>}
          </h3>
          <p className="plant-card__scientific_title">
            ({plant["scientificName"]})
          </p>
          <p className="plant-card__description">
            {plant.description.generalDescription?.[0]}
          </p>

          <div className="plant-card__soil-state">
            <p className="plant-card__soil-state__symbol">
              Sol: <span className={soilState.className}>{soilState.text}</span>
            </p>

            {plant.isEdible && (
              <span className="plant-card__comestible">
                <Utensils size={20} color="green" strokeWidth={1.5} />
              </span>
            )}
            {!plant.isEdible && (
              <span className="plant-card__toxique">
                <Skull size={20} color="red" strokeWidth={1.5} />
              </span>
            )}
          </div>

          <div className="plant-card__actions">
            <button
              onClick={() => handleNavigateToPlant(plant.id)}
              className="plant-card__actions--info"
            >
              <Info size={20} />
            </button>
            {!isSelected ? (
              <button
                className="plant-card__actions--addPlant"
                onClick={() => handleAddPlant(plant)}
              >
                <span>Ajouter</span> <Plus size={16} />
              </button>
            ) : (
              <button
                className="plant-card__actions--removePlant"
                onClick={() => handleRemovePlant(plant)}
              >
                <span>Retirer</span> <Trash2 size={16} />
              </button>
            )}
            {/* </Link> */}
          </div>
        </div>
      ) : (
        viewMode === "list" && (
          <div
            className={`plant-card__list ${
              isSelected ? " plant-card__list--selected" : ""
            }  ${isInDatabase ? "" : "plant-card__list--warning"}`}
          >
            {isSelected && (
              <div className="plant-card__list__selected-badge"></div>
            )}

            <div className="plant-card__list__image">
              {plant.images.length > 0 ? (
                <img src={plant.images[0]?.url} alt={plant.commonName} />
              ) : (
                <img src="/plant-placeholder.webp" alt={plant.commonName} />
              )}
            </div>
            <div className="plant-card__list__content">
              <h3
                className={`plant-card__title ${
                  isSelected ? "plant-card__title--selected" : ""
                }`}
              >
                <span>{plant.commonName[0]}</span>
                {"  "}
                {plant.commonName[1] && <span>({plant.commonName[1]})</span>}
              </h3>
              <p className="plant-card__scientific_title">
                ({plant.scientificName})
              </p>
              {plant.score && (
                <span className="plant-card__score">
                  Confiance :{" "}
                  {plant.score
                    ? Math.round((plant.score * 100).toFixed(2))
                    : "N/A"}{" "}
                  %
                </span>
              )}
            </div>

            <div className="plant-card__actions">
              {!isInDatabase && (
                <div className="plant-card__list__warning-badge">
                  <AlertTriangleComponent />
                </div>
              )}
              {isInDatabase && (
                <button
                  onClick={() => handleNavigateToPlant(plant.id)}
                  className="plant-card__actions--info"
                >
                  Infos <Info size={16} />
                </button>
              )}
              {!isSelected ? (
                <button
                  className="plant-card__actions--addPlant"
                  onClick={() => handleAddPlant(plant)}
                >
                  <span>Ajouter</span> <Plus size={16} />
                </button>
              ) : (
                <button
                  className="plant-card__actions--removePlant"
                  onClick={() => handleRemovePlant(plant)}
                >
                  <span>Retirer</span> <Trash2 size={16} />
                </button>
              )}
              {/* </Link> */}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PlantCard;
