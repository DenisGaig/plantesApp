//import PlantList from "../../components/app/database/PlantList.jsx";
//import FilterBar from "../../components/app/shared/FilterBar.jsx";
import AdvancedSearch from "../database/AdvancedSearch.jsx";

const PlantDatabase = () => {
  // const { filteredPlants } = usePlantDatabase();
  return (
    <div className="plant-database">
      <h1>A la recherche de plantes</h1>
      <AdvancedSearch />
      {/* <PlantList /> */}
    </div>
  );
};

export default PlantDatabase;
