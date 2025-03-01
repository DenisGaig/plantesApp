import { useEffect, useState } from "react";
import plantesData from "../data/plantes.json";

export function usePlantDatabase() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setPlants(plantesData);
      console.log("Plantes bien chargées");
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  // Récupérer une plante par son ID
  const getPlantById = (id) => {
    return plants.find((plant) => plant.id === id);
  };

  // Récupérer une plante par selon certains critères
  const filterPlants = (criteria) => {
    return plants.filter((plant) => {
      return Object.keys(criteria).every((key) => {
        return plant[key] === criteria[key];
      });
    });
  };

  return { plants, loading, error, getPlantById, filterPlants };
}
