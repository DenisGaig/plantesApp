import {
  FileText,
  Flower2,
  Home,
  Image,
  Info,
  Skull,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePlantDatabase } from "../../../hooks/usePlantDatabase.js";
import PlantBioIndicators from "./PlantBioIndicators";
import PlantDetails from "./PlantDetails";
import PlantImages from "./PlantImages";
import PlantProperties from "./PlantProperties.jsx";

const PlantProfile = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const { id } = useParams();
  console.log("ID", id);
  const { getPlantById } = usePlantDatabase();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const fromPath = searchParams.get("from");

  const handleBackToSearch = () => {
    // Extraire le paramètre "from" de l'URL

    console.log("fromPath:", fromPath);
    if (fromPath) {
      // Décoder l'URL pour gérer les caractères spéciaux
      const decodedPath = decodeURIComponent(fromPath);
      console.log("Retour à:", decodedPath);

      // Naviguer vers la page d'origine avec tous ses paramètres
      navigate(decodedPath);
    } else {
      // Fallback - si pour une raison quelconque le paramètre "from" est absent
      // Vous pouvez utiliser votre ancienne logique ici
      const currentParams = new URLSearchParams(location.search);
      const uniqueParams = new URLSearchParams();

      for (const [key, value] of currentParams.entries()) {
        if (key !== "from") {
          // Ignorer le paramètre "from"
          uniqueParams.delete(key);
          uniqueParams.append(key, value);
        }
      }

      navigate(`/app/plants?${uniqueParams.toString()}`);
    }
  };

  useEffect(() => {
    const loadPlant = async () => {
      try {
        setLoading(true);
        const plantData = await getPlantById(id);
        console.log("Plante chargée: ", plantData);
        setPlant(plantData);
        console.log("État plant mis à jour :", plantData);
        setLoading(false);
      } catch (error) {
        console.error(error, "Erreur lors du chargement de la plante");
      } finally {
        setLoading(false);
      }
    };
    loadPlant();
  }, [id, getPlantById]);

  const MelliferousRating = ({ rating }) => {
    const beeCount = Math.min(Math.max(rating, 0), 3); // sécurité : garde entre 0 et 3
    // const bees = "🐝".repeat(beeCount);
    const bees = Array.from({ length: beeCount }, (_, index) => (
      <img src="/bee3.svg" width="24px" height="24px" alt="bee" key={index} />
    ));
    return (
      <span>
        {bees.length > 0 ? (
          <div className="melliferous-rating"> {bees} Mellifère</div>
        ) : (
          "Non mellifère"
        )}
      </span>
    );
  };

  const SoilCondition = ({ soilCondition }) => {
    return (
      <div className="soil-conditions">
        {" "}
        <img src="/soilIndicator.svg" width="24px" height="24px" alt="soil" />
        Indique un sol :{" "}
        <div
          className="soil-conditions__indicator"
          style={{
            backgroundColor:
              soilCondition > 2
                ? "#e74c3c"
                : soilCondition > 1
                ? "#f39c12"
                : "#2ecc71",
          }}
        >
          {soilCondition > 2
            ? "Très dégradé"
            : soilCondition > 1
            ? "Dégradé"
            : "Equilibré"}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Chargement...</div>;
  }
  if (!plant) {
    return <div>Plante non trouvée</div>;
  }

  const menu = [
    {
      name: "Description",
      icon: <FileText size={20} />,
      component: <PlantDetails plant={plant} />,
    },
    {
      name: "Ecologie & Habitats",
      icon: <Home size={30} />,
      component: <PlantBioIndicators plant={plant} />,
    },
    {
      name: "Usages & Propriétés",
      icon: <Info size={30} />,
      component: <PlantProperties plant={plant} />,
    },
    {
      name: "Images",
      icon: <Image size={20} />,
      component: <PlantImages plant={plant} />,
    },
  ];
  console.log("PLANTE", plant);
  return (
    <div className="plant-profile">
      <button
        onClick={handleBackToSearch}
        className="plant-profile__back-button"
      >
        ← Retour aux résultats
      </button>
      <div className="plant-profile__header">
        <div className="plant-profile__header__image">
          {plant.images.length > 0 ? (
            <img src={plant["images"][0]?.url} alt={plant["commonName"]} />
          ) : (
            <img src="/plant-placeholder.webp" alt={plant["commonName"]} />
          )}
        </div>
        <div className="plant-profile__header__title">
          <div className="plant-profile__header__title__scientific-name">
            <h2>{plant["scientificName"][0]}</h2>
            <h3 className="plant-profile__header__title__scientific-name__synonyms">
              {plant["scientificName"][1] ? plant["scientificName"][1] : ""}
              {plant.scientificName[2] ? ` / ${plant.scientificName[2]}` : ""}
            </h3>
          </div>
          <h3 className="plant-profile__header__title__common-name">
            {plant["commonName"] ? plant["commonName"] : ""}
          </h3>
          <div className="plant-profile__header__title__infos">
            <p className="plant-profile__header__title__infos__item">
              <MelliferousRating rating={plant["melliferous"]} />
            </p>
            <p className="plant-profile__header__title__infos__item">
              {plant.isEdible === null ? (
                <div className="isEdible"></div>
              ) : plant.isEdible ? (
                <div className="isEdible">
                  <Utensils size={16} /> Comestible
                </div>
              ) : (
                <div className="isEdible">
                  <Skull size={20} /> Toxique
                </div>
              )}
            </p>
            <p className="plant-profile__header__title__infos__item">
              <div className="flowering-period">
                <Flower2 size={16} /> {plant["floweringPeriod"]}
              </div>
            </p>
          </div>
          <div className="plant-profile__header__title__soil">
            {plant.soilCondition && (
              <SoilCondition soilCondition={plant.soilCondition} />
            )}
          </div>
        </div>
      </div>
      <div className="plant-profile__tabs">
        {menu.map((item) => (
          <button
            className={`tabs-button ${activeTab === item.name ? "active" : ""}`}
            onClick={() => setActiveTab(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
            {/* <div className="plant-profile__menu-item__underline"></div>{" "} */}
          </button>
        ))}
      </div>
      <div className="plant-profile__content">
        {menu.find((item) => item.name === activeTab).component}
      </div>
    </div>
  );
};
export default PlantProfile;
