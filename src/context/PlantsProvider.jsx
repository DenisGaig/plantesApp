import { useContext, useEffect, useState } from "react";
import { PlantsContext } from "./PlantsContext.jsx";

export function PlantsProvider({ children }) {
  // const plantDatabase = usePlantDatabase();
  const [selectedPlants, setSelectedPlants] = useState(() => {
    // Récupérer les plantes du localStorage au chargement initial
    const storedPlants = localStorage.getItem("selectedPlants");
    return storedPlants ? JSON.parse(storedPlants) : [];
  });

  useEffect(() => {
    // Sauvegarder les plantes dans le localStorage à chaque mise à jour
    localStorage.setItem("selectedPlants", JSON.stringify(selectedPlants));
  }, [selectedPlants]);

  const addPlant = (plant) => {
    setSelectedPlants((prevPlants) => [...prevPlants, plant]);
  };

  const removePlant = (plant) => {
    setSelectedPlants(selectedPlants.filter((p) => p.id !== plant.id));
  };

  return (
    <PlantsContext.Provider value={{ selectedPlants, addPlant, removePlant }}>
      {children}
    </PlantsContext.Provider>
  );
}

export const usePlants = () => useContext(PlantsContext);
