import { useContext } from "react";
import { PlantsContext } from "../../../context/PlantsContext.jsx";

const FilterBar = () => {
  // const { filters, updateFilters, plants } = usePlantDatabase();
  const { filters, updateFilters, plants } = useContext(PlantsContext);

  // Extraire les familles uniques pour le filtre
  const familles = [...new Set(plants.map((plant) => plant.Famille))].sort();

  return (
    <div className="filter-bar">
      <div className="filter-bar_group">
        <label htmlFor="famille">Famille: </label>
        <select
          id="famille"
          value={filters.famille}
          onChange={(e) => updateFilters({ famille: e.target.value })}
        >
          <option value="">Toutes</option>
          {familles.map((famille) => (
            <option key={famille} value={famille}>
              {famille}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar_group">
        <label htmlFor="biotope">Biotopes:</label>
        <input
          type="text"
          id="biotope"
          value={filters.biotope}
          onChange={(e) => updateFilters({ biotope: e.target.value })}
          placeholder="Ex: forêt, haie..."
        />
      </div>

      <div className="filter-bar_group">
        <label htmlFor="comestible">Comestible:</label>
        <select
          id="comestible"
          value={filters.comestible}
          onChange={(e) => updateFilters({ comestible: e.target.value })}
        >
          <option value="">Tous</option>
          <option value="O">Oui</option>
          <option value="N">Non</option>
        </select>
      </div>

      <button
        className="filter-bar_reset-button"
        onClick={() =>
          updateFilters({
            famille: "",
            biotope: "",
            comestible: "",
            etatDuSol: null,
          })
        }
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
};
export default FilterBar;
