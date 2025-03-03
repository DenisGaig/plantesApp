const PlantCard = ({ plant }) => {
  if (!plant) return <p>Plante non disponible</p>;

  const soilStates = {
    1: { className: "plant_card__soil-state__good", text: "A l'équilibre" },
    2: { className: "plant_card__soil-state__medium", text: "Equilibre rompu" },
    3: {
      className: "plant_card__soil-state__bad",
      text: "Graves déséquilibres",
    },
  };

  const soilState = soilStates[plant["Etat du sol"]] || soilStates[3];

  return (
    <div className="plant-card">
      <h3 className="plant_card__title">{plant["Nom commun"]}</h3>
      <p className="plant_card__scientific_title">({plant["Nom Coste"]})</p>
      <p className="plant_card__family">{plant["Famille"]}</p>
      {plant["Biotope primaire"] && plant["Biotope primaire"].length > 0 && (
        <div className="plant_card__biotope">
          <h4>Biotope primaire</h4>
          <ul>
            {plant["Biotope primaire"].slice(0, 2).map((biotope, index) => (
              <li key={index}>- {biotope}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="plant_card__soil-state">
        <p>
          Etat du sol:{" "}
          <span className={soilState.className}>{soilState.text}</span>
        </p>

        {plant.Comestible === "O" && (
          <span className="plant_card__comestible">Comestible</span>
        )}
        {plant.Comestible === "T" && (
          <span className="plant_card__toxique">Toxique</span>
        )}
      </div>
      {/* <p className="plant_card__biotope">
            {plant["Biotope secondaire"].slice(0, 2).join(" / ")}
          </p> */}
    </div>
  );
};

export default PlantCard;
