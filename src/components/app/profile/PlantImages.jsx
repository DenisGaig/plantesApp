const PlantImages = ({ plant }) => {
  return (
    <div className="plant-images">
      <div className="plant-images__header">
        {plant["images"].length > 0
          ? "Découvrez moi en images !"
          : "Pas d'images pour le moment"}
      </div>
      <div className="plant-images__content">
        {plant["images"].map((image, index) => (
          <img key={index} src={image.url} alt={plant["commonName"]} />
        ))}
      </div>
    </div>
  );
};
export default PlantImages;
