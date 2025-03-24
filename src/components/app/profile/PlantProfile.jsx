import { FileText, Image, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePlantDatabase } from "../../../hooks/usePlantDatabase.js";
import PlantBioIndicators from "./PlantBioIndicators";
import PlantDetails from "./PlantDetails";
import PlantImages from "./PlantImages";

const PlantProfile = () => {
  const [activeTab, setActiveTab] = useState("Détails");
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

  // const handleBackToSearch = () => {
  //   // Extraire les paramètres de recherche de l'URL actuelle
  //   const currentParams = new URLSearchParams(location.search);

  //   // Créer un nouvel objet URLSearchParams pour éviter les doublons
  //   const uniqueParams = new URLSearchParams();

  //   // Ajouter chaque paramètre une seule fois (en prenant la dernière valeur)
  //   for (const [key, value] of currentParams.entries()) {
  //     // Supprimer le paramètre existant s'il existe déjà
  //     uniqueParams.delete(key);
  //     // Ajouter le paramètre avec sa valeur
  //     uniqueParams.append(key, value);
  //   }

  //   // Naviguer vers la page de recherche avec les paramètres uniques
  //   navigate(`/app/plants?${uniqueParams.toString()}`);
  // };

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

  if (loading) {
    return <div>Chargement...</div>;
  }
  if (!plant) {
    return <div>Plante non trouvée</div>;
  }

  const menu = [
    {
      name: "Détails",
      icon: <FileText size={20} />,
      component: <PlantDetails plant={plant} />,
    },
    {
      name: "Bio-indicateurs",
      icon: <Leaf size={20} />,
      component: <PlantBioIndicators plant={plant} />,
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
        <div className="plant-profile__header__image"></div>
        <div className="plant-profile__header__title">
          <h2>
            {plant["Nom scientifique"]
              ? plant["Nom scientifique"]
              : plant["scientificName"]}
          </h2>
          <h4>
            {plant["commonName"]
              ? plant["commonName"]
              : plant["scientificName"]}
          </h4>
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
            <div className="plant-profile__menu-item__underline"></div>{" "}
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
