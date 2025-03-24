import { Dot } from "lucide-react";

const PlantBioIndicators = ({ plant }) => {
  return (
    <div className="plant-bio-indicators">
      <div className="plant-bio-indicators__header"></div>
      <div className="plant-bio-indicators__content">
        {plant["indicatorTraits"].map((indicator, index) => (
          <li key={index} className="plant-bio-indicators__content__item">
            <Dot size={10} />
            {indicator}
          </li>
        ))}
      </div>
    </div>
  );
};
export default PlantBioIndicators;
