import PlantList from "../../components/app/database/PlantList.jsx";
import FilterBar from "../../components/app/shared/FilterBar.jsx";

const PlantDatabase = () => {
  // const { filteredPlants } = usePlantDatabase();
  return (
    <div>
      {" "}
      <h1>A la recherche de plantes</h1>
      <div className="plant-list">
        <FilterBar />
        <PlantList />
      </div>{" "}
    </div>
  );
};

export default PlantDatabase;
