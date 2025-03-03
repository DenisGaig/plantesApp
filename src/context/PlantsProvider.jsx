import { usePlantDatabase } from "../hooks/usePlantDatabase.js";
import { PlantsContext } from "./PlantsContext.jsx";

export function PlantsProvider({ children }) {
  const plantDatabase = usePlantDatabase();

  return (
    <PlantsContext.Provider value={plantDatabase}>
      {children}
    </PlantsContext.Provider>
  );
}
