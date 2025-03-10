const ListCard = ({ plant }) => {
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
    <div className="list-plant-card">
      <div className="list-plant-card__image"></div>
      <div className="list-plant-card__content">
        <h3 className="list-plant-card__content__title">
          {plant["Nom commun"]}
        </h3>
        <p className="list-plant-card__content__scientific_title">
          ({plant["Nom Coste"]})
        </p>

        <div className="list-plant-card__content__soil-state">
          <h4>Etat du sol</h4>
          <p className={soilState.className}>{soilState.text}</p>
        </div>
      </div>
    </div>
  );
};
export default ListCard;
