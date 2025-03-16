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

  const soilState = soilStates[plant["Etat du sol"]] || soilStates[3];

  return (
    <Link
      to={`/app/plants/${plant.id}${searchParams}`}
      className="plant-card__link"
    >
      <div className="plant-card">
        <div className="plant-card__image">
          {/* <img src="" className="plant-card__image" alt="" /> */}
        </div>
        <h3 className="plant-card__title">{plant["Nom commun"]}</h3>
        <p className="plant-card__scientific_title">
          ({plant["scientific_name"]})
        </p>
        <p className="plant-card__family">{plant["Famille"]}</p>
        {/* {plant["Biotope primaire"] && plant["Biotope primaire"].length > 0 && (
        <div className="plant-card__biotope">
          <h4>Biotope primaire</h4>
          <ul>
            {plant["Biotope primaire"].slice(0, 2).map((biotope, index) => (
              <li key={index}>- {biotope}</li>
            ))}
          </ul>
        </div>
      )} */}
        <div className="plant-card__soil-state">
          <p>
            Etat du sol:{" "}
            <span className={soilState.className}>{soilState.text}</span>
          </p>

          {plant.Comestible === "O" && (
            <span className="plant-card__comestible">Comestible</span>
          )}
          {plant.Comestible === "T" && (
            <span className="plant-card__toxique">Toxique</span>
          )}
        </div>
        {/* <p className="plant-card__biotope">
            {plant["Biotope secondaire"].slice(0, 2).join(" / ")}
          </p> */}
      </div>
    </Link>
  );
};

export default PlantCard;
