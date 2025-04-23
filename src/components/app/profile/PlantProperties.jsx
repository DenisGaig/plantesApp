import { BookOpen, HeartPulse, UtensilsCrossed } from "lucide-react";
import CollapsibleCard from "../shared/CollapsibleCard.jsx";

const PlantProperties = ({ plant }) => {
  return (
    <div className="plant-properties">
      <CollapsibleCard
        title="Propriétés médicinales"
        icon={<HeartPulse />}
        defaultOpen={true}
      >
        {plant.medicinalUses && (
          <div className="plant-medicinal-use">
            <p>
              {plant.medicinalUses.map((use, index) => (
                <li key={index} className="plant-medicinal-use__item">
                  {use}
                </li>
              ))}
            </p>
          </div>
        )}
      </CollapsibleCard>
      <CollapsibleCard
        title="Usages culinaire"
        icon={<UtensilsCrossed />}
        defaultOpen={true}
      >
        {plant.culinaryUses && (
          <div className="plant-culinary-use">
            <p>
              {plant.culinaryUses.map((use, index) => (
                <li key={index} className="plant-culinary-use__item">
                  {use}
                </li>
              ))}
            </p>
          </div>
        )}
      </CollapsibleCard>
      <CollapsibleCard
        title="Encore plus..."
        icon={<BookOpen />}
        defaultOpen={false}
      >
        {plant.culinaryUses && (
          <div className="plant-notes">
            <p>
              {plant.notes.map((note, index) => (
                <li key={index} className="plant-notes__item">
                  {note}
                </li>
              ))}
            </p>
          </div>
        )}
      </CollapsibleCard>
    </div>
  );
};
export default PlantProperties;
