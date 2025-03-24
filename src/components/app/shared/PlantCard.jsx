import { Link } from "react-router-dom";

const PlantCard = ({ plant, searchParams }) => {
  if (!plant) return <p>Plante non disponible</p>;

  const soilStates = {
    1: { className: "plant-card__soil-state__good", text: "A l'équilibre" },
    2: { className: "plant-card__soil-state__medium", text: "Equilibre rompu" },
    3: {
      className: "plant-card__soil-state__bad",
      text: "Graves déséquilibres",
    },
  };

  const soilState = soilStates[plant["soilCondition"]] || soilStates[3];

  return (
    <Link
      to={`/app/plants/${plant.id}${searchParams}`}
      className="plant-card__link"
    >
      <div className="plant-card">
        <div className="plant-card__image">
          {/* <img src="" className="plant-card__image" alt="" /> */}
        </div>
        <h3 className="plant-card__title">{plant["commonName"]}</h3>
        <p className="plant-card__scientific_title">
          ({plant["scientificName"]})
        </p>
        <p className="plant-card__family">{plant["family"]}</p>

        <div className="plant-card__soil-state">
          <p>
            Etat du sol:{" "}
            <span className={soilState.className}>{soilState.text}</span>
          </p>

          {plant.edible === "O" && (
            <span className="plant-card__comestible">Comestible</span>
          )}
          {plant.edible === "T" && (
            <span className="plant-card__toxique">Toxique</span>
          )}
        </div>
        {/* <p className="plant-card__biotope">
            {plant["secondaryBiotope"].slice(0, 2).join(" / ")}
          </p> */}
      </div>
    </Link>
  );
};

export default PlantCard;
