import { useState } from "react";

const PlantNetCard = ({ result, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!result) return null;
  // Accédez de manière sécurisée aux propriétés pour éviter les erreurs
  const score = result.score ? (result.score * 100).toFixed(2) : "N/A";
  const species = result.species || {};
  const scientificName =
    species.scientificNameWithoutAuthor || "Nom scientifique non disponible";
  const commonName = species.commonNames?.[0] || "Nom commun non disponible";
  const genus =
    species.genus?.scientificNameWithoutAuthor || "Genre non disponible";
  const family =
    species.family?.scientificNameWithoutAuthor || "Famille non disponible";

  function ImageModal({ src, alt, onClose }) {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <img src={src} alt={alt} className="modal-image" />
        </div>
      </div>
    );
  }

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Vérifiez si images existe et est un tableau avant d'essayer d'itérer dessus
  const hasImages =
    result.images && Array.isArray(result.images) && result.images.length > 0;
  return (
    <div className="plantNet-card">
      <div className="plantNet-card__header">
        <p className="plantNet-card__header-score">{score}%</p>
        <h4>{scientificName}</h4>
        <div className="planNet-card__header-name">
          <h5>NOM COMMUN</h5>
          <p>{commonName}</p>
        </div>
        <div className="planNet-card__header-genus">
          <h5>GENRE</h5>
          <p>{genus}</p>
        </div>
        <div className="planNet-card__header-family">
          <h5>FAMILLE</h5>
          <p>{family}</p>
        </div>
      </div>
      <div className="plantNet-card__body">
        {hasImages &&
          result.images.map((image, index) => {
            // Vérifiez si l'image et son URL existent
            if (!image || !image.url || !image.url.m) return null;
            return (
              <div>
                <img
                  className="plantNet-card__body-image"
                  key={index}
                  src={image.url.m}
                  alt={`Image ${index + 1} of ${
                    result.species.commonNames?.[0]
                  }`}
                  onClick={() => handleImageClick(image)}
                />

                {isModalOpen && selectedImage && (
                  <ImageModal
                    src={selectedImage.url.m}
                    alt={`Image ${selectedImage.index + 1} of ${
                      result.species.commonNames?.[0]
                    }`}
                    onClose={handleCloseModal}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PlantNetCard;
