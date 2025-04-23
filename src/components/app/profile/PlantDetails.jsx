import { Info, Sprout } from "lucide-react";
import CollapsibleCard from "../shared/CollapsibleCard.jsx";

const PlantDetails = ({ plant }) => {
  console.log("PLANT DETAILS", plant);
  return (
    <div className="plant-details">
      {/* <div className="plant-details__header">Un rapide portrait</div> */}
      <CollapsibleCard
        title="Carte d'identité"
        icon={<Info size={20} />}
        defaultOpen={true}
      >
        <div className="plant-identity">
          <p>
            <strong>Famille:</strong> {plant.family[0] || "Non spécifiée"}
          </p>
          <p>
            <strong>Taille:</strong>{" "}
            {plant.description.size.lenght > 0
              ? plant.description.size
              : "Non spécifiée"}
          </p>
          {/* <p><strong>Type:</strong> {plant.type || "Non spécifié"}</p> */}
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title="Morphologie"
        icon={<Sprout size={20} />}
        defaultOpen={false}
      >
        {/* <div className="plant-details__content"> */}
        {plant.description.generalDescription && (
          <div className="plant-details__content__description">
            <p>{plant.description.generalDescription}</p>
          </div>
        )}
        {plant.description.leaf && (
          <div className="plant-details__content__description">
            <strong>🌿 Feuilles</strong>
            <p>{plant.description.leaf}</p>
          </div>
        )}
        {plant.description.flower && (
          <div className="plant-details__content__description">
            <strong>🌺 Fleur</strong>
            <p>{plant.description.flower}</p>
          </div>
        )}
        {plant.description.fruit && (
          <div className="plant-details__content__description">
            <strong>🍇 Fruit</strong>
            <p>{plant.description.fruit}</p>
          </div>
        )}
        <div className="plant-details__footer"></div>
        {/* </div> */}
      </CollapsibleCard>
    </div>
  );
};
export default PlantDetails;
