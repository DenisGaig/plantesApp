import { Link } from "react-router-dom";

const ListCard = ({ plant, searchParams }) => {
  if (!plant) return <p>Plante non disponible</p>;
  const soilStates = {
    1: {
      className: "list-plant_card__soil-state__good",
      text: "A l'équilibre",
    },
    2: {
      className: "list-plant_card__soil-state__medium",
      text: "Equilibre rompu",
    },
    3: {
      className: "list-plant_card__soil-state__bad",
      text: "Graves déséquilibres",
    },
  };
  const soilState = soilStates[plant["Etat du sol"]] || soilStates[3];
  return (
    <Link
      to={`/app/plants/${plant.id}${searchParams}`}
      className="list-plant-card__link"
    >
      <div className="list-plant-card">
        <div className="list-plant-card__image"></div>
        <div className="list-plant-card__content">
          <h3 className="list-plant-card__content__title">
            {plant["Nom commun"]}
          </h3>
          <p className="list-plant-card__content__scientific_title">
            ({plant["scientific_name"]})
          </p>

          <div className="list-plant-card__content__soil-state">
            <h4>Etat du sol</h4>
            <p className={soilState.className}>{soilState.text}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ListCard;
