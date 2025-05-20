import { useState } from "react";

const PlantImages = ({ plant }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
  return (
    <div className="plant-images">
      <div className="plant-images__header">
        {plant["images"].length > 0
          ? "Découvrez moi en images !"
          : "Pas d'images pour le moment"}
      </div>
      <div className="plant-images__content">
        {plant["images"].map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={plant["commonName"]}
            onClick={() => openModal(image)}
          />
        ))}
      </div>
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <span className="modal__close" onClick={closeModal}>
              &times;
            </span>
            <img src={selectedImage.url} alt={plant["commonName"]} />
          </div>
        </div>
      )}
    </div>
  );
};
export default PlantImages;
